/**
 * author:shiwu.wyy@antgroup.com
 */

import { useContext } from '@alipay/graphinsight';
import ReactDOM from 'react-dom';
import Algorithm from '@antv/algorithm';
import { Button, Tabs, Tooltip, Menu, Modal, Dropdown, message, Row, Col } from 'antd';
import { ExclamationCircleOutlined, DeleteOutlined } from '@ant-design/icons';
import { GraphinData } from '@antv/graphin';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import { PatternMatchProps, SPLITOR } from './registerMeta';
import FormattedMessage, { formatMessage } from './locale';
import ResultTable from './resultTable';
import PatternEditor, { TypeProperties } from './patternEditor';
import PatternPane from './patternPane';
import { ITEM_STATE } from './registerMeta';
import { filterByPatternRules } from './util';
import Util from '../utils';
import { TypeInfo } from './editDrawer';
import 'antd/dist/antd.css';
import './index.less';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { GADDI, breadthFirstSearch } = Algorithm;
const { createUuid, clearItemsStates, fittingString } = Util;

const MAX_PATTERN_NUM = 4;
const EXTRACT_MESSAGE_KEY = 'kg-pattern-match-extract-message';
const EXTRACT_MODE_CANVAS_CLASSNAME = 'kg-pattern-match-extract-mode-canvas';


let newTabIndex = 1;
let previousSize = { width: 500, height: 500 };
let keydown = false;

const PatternMatch: React.FC<PatternMatchProps> = ({
  style,
  onClose,
  onOpen,
  options = {},
}) => {
  const { onGraphEditorVisibleChange, onExtractModeChange, exportPattern, exportButton } = options;
  // const { graph, data, schemaData } = useContext(StudioContext);
  const { graph, data, schemaData } = useContext();

  const intialPatternInfoMap = {
    '1': {
      id: '1',
      title: <FormattedMessage id="pattern-title" value={'1'} />,
      data: null
    }
  };

  const initialPanes = [
    {
      title: <FormattedMessage id="pattern-title" value={intialPatternInfoMap['1'].id} />,
      content: <PatternPane
        {...intialPatternInfoMap['1']}
        //@ts-ignore
        schemaEdgeMap={schemaEdgeMap}
        editPattern={() => setEditorVisible(true)}
        //@ts-ignore
        importData={importData}
      />,
      key: intialPatternInfoMap['1'].id
    },
  ];

  const [panes, setPanes] = useState(initialPanes);
  const [activeKey, setActiveKey] = useState('1');
  const [editorVisible, setEditorVisible] = useState(false);
  const [patternInfoMap, setPatternInfoMap] = useState(intialPatternInfoMap);
  const [result, setResult] = useState([] as GraphinData[]);
  const [hullIds, setHullIds] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState<string | false>(false);
  const [nodeProperties, setNodeProperties] = useState({} as  TypeProperties);
  const [edgeProperties, setEdgeProperties] = useState({} as  TypeProperties);
  const [nodeTypes, setNodeTypes] = useState([] as TypeInfo[]);
  const [edgeTypes, setEdgeTypes] = useState([] as TypeInfo[]);
  const [schemaEdgeMap, setSchemaEdgeMap] = useState({});
  const [schemaNodeMap, setSchemaNodeMap] = useState({});

  useEffect(() => {
    const sEdgeMap = {};
    const sNodeMap = {};
    schemaData.edges.forEach(schemaEdge => sEdgeMap[schemaEdge.edgeType] = schemaEdge);
    schemaData.nodes.forEach(schemaNode => sNodeMap[schemaNode.nodeType] = schemaNode);

    // 数据结构 { [nodeType: string]: Set }
    const nodeTypeProperties = {};
    data.nodes.forEach(node => {
      nodeTypeProperties[node.nodeType] = nodeTypeProperties[node.nodeType] || new Set();
      Object.keys(node.data).forEach(key => nodeTypeProperties[node.nodeType].add(key));
    });
    const nTypes = Object.keys(nodeTypeProperties).map(key => {
      const fittedText = fittingString(key, 280, 14);
      return {
        key,
        text: key,
        content: <Tooltip title={fittedText?.includes('…') ? key : ''}>
          {fittedText}
        </Tooltip>
      };
    });
    // 数据结构 { [edgeType: string]: Set }
    const edgeTypeProperties = {};
    data.edges.forEach(edge => {
      const { edgeType } = edge;
      const schema = sEdgeMap[edgeType] || {};
      const { sourceNodeType, targetNodeType } = schema;
      const spo = `${sourceNodeType}${SPLITOR}${edgeType}${SPLITOR}${targetNodeType}`;
      edgeTypeProperties[spo] = edgeTypeProperties[spo] || new Set();
      Object.keys(edge.data).forEach(key => edgeTypeProperties[spo].add(key));
    });
    const eTypes = Object.keys(edgeTypeProperties).map(key => {
      const [sourceNodeType, typeName, targetNodeType] = key.split(SPLITOR);
      const subText = `${sourceNodeType} → ${targetNodeType}`;
      const fittedText = fittingString(typeName, 280, 14);
      const fittedSubText = fittingString(subText, 280, 14);
      return {
        key,
        typeName,
        sourceNodeType,
        targetNodeType,
        content: <Tooltip
          title={(fittedText?.includes('…') || fittedSubText?.includes('…')) ? `${typeName} (${subText})` : ''}
        >
          {fittedText}
          <p className="kg-node-importance-tip">{fittedSubText}</p>
        </Tooltip>
      }
    });
    setSchemaEdgeMap(sEdgeMap);
    setSchemaNodeMap(sNodeMap);
    setNodeProperties(nodeTypeProperties);
    setEdgeProperties(edgeTypeProperties);
    setNodeTypes(nTypes);
    setEdgeTypes(eTypes);
  }, [data]);

  // 编辑器的显示抛出回调
  useEffect(() => {
    onGraphEditorVisibleChange?.(editorVisible);
  }, [editorVisible]);

  // 模式编辑完成后，patternInfoMap 发生变化，触发模式 tabs 中显示的内容变化
  useEffect(() => {
    const newPanes = panes.map(pane => ({
      ...pane,
      content: <PatternPane
        id={pane.key}
        data={patternInfoMap[pane.key]?.data}
        schemaEdgeMap={schemaEdgeMap}
        editPattern={() => setEditorVisible(true)}
        extractPattern={enableExtractingMode}
        importData={importData}
      />
    }));
    setPanes(newPanes);
  }, [patternInfoMap]);

  const enableExtractingMode = (patternId) => {
    if (!graph || graph.destroyed) {
      return;
    }
    message.info({
      key: EXTRACT_MESSAGE_KEY,
      className: 'kg-pattern-match-extract-tip-long',
      duration: 0,
      content: formatMessage({ id: 'extract-pattern-tip-long' }),
      style: {
        marginTop: '20px'
      }
    });
    graph.setMode('pattern-match-lasso'); // 切换为 lasso 交互模式，该模式下没有其他 behavior
    // 恢复图上的选中状态，为拉索框选做准备
    clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Selected]);
    clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Selected]);
    setExtracting(patternId);
    
    onClose?.(); // 隐藏抽屉;
    onExtractModeChange?.(true);
    // 设置 canvas dom 描边样式
    setCanvasDomStyle(true);
  }

  const quitExtractMode = () => {
    graph.setMode('default'); // 恢复默认交互模式
    message.destroy(EXTRACT_MESSAGE_KEY); // 销毁提示 message
    setExtracting(false); // 恢复面板状态
    onOpen?.(); // 显示抽屉
    setExtracting(false); // 恢复面板状态
    onExtractModeChange?.(false);
    // 设置 canvas dom 描边样式
    setCanvasDomStyle(false);
  }

  const extractPattern = () => {
    if (!graph || graph.destroyed) {
      quitExtractMode();
      return;
    }

    if (!extracting) return;

    const patternId = extracting;
    const nodes = graph.findAllByState('node', ITEM_STATE.Selected) || [];
    const edges = graph.findAllByState('edge', ITEM_STATE.Selected) || [];
    if (!nodes.length) return;

    // 验证当前模式图是连通的
    const data: GraphinData = {
      nodes: nodes.map(node => node.getModel() as any),
      edges: edges.map(edge => edge.getModel() as any)
    }
    const traversedTag = {};
    breadthFirstSearch(data, data.nodes[0].id, {
      enter: ({ current }) => {
        traversedTag[current] = true;
      }
    }, false);
    if (Object.keys(traversedTag).length < data.nodes.length) {
      message.info(formatMessage({ id: 'save-failed-must-connected' }));
      return;
    }

    const newPatternInfoMap = {...patternInfoMap};
    // 抽取成模式
    const newIdMap = {};
    const pattern: GraphinData = { nodes: [], edges: [] };
    data.nodes.forEach((node, i) => {
      const { data: nodeData, id: dataId } = node;
      const schema = schemaData.nodes.find(item => item.nodeType === nodeData.nodeType);
      const { nodeType = nodeData.nodeType } = schema || {};
      const id = createUuid();
      newIdMap[dataId] = { id, nodeType };
      pattern.nodes.push({
        id,
        oriId: dataId,
        cluster: undefined,
        rules: undefined,
        nodeType,
        style: {
          label: {
            value: `${nodeType}-${pattern.nodes.length}`,
          }
        },
        originLabel: `${nodeType}-${pattern.nodes.length}`,
        data: { id, nodeType },
      });
    });

    // 抽取边的同时，验证当前模式图中所有边的端点都在 nodes 中
    let invalid = false;

    for (let i = 0; i < data.edges.length; i++) {
      const edge = data.edges[i];
      const { id: dataId, source: dataSource, target: dataTarget, data: edgeData } = edge;
      const schema = schemaData.edges.find(item => item.edgeType === edgeData.edgeType);
      const { edgeType = edgeData.edgeType } = schema || {};
      if (!newIdMap[dataSource] || !newIdMap[dataTarget]) {
        invalid = true;
        break;
      }
      const { id: source, name: sourceNodeType } = newIdMap[dataSource];
      const { id: target, name: targetNodeType } = newIdMap[dataTarget];
      
      pattern.edges.push({
        id: `${source}-${target}-${createUuid()}`,
        oriId: dataId,
        source,
        target,
        rules: [],
        type: source === target ? 'loop' : 'graphin-line',
        loopCfg: {
          position: 'top',
          dist: source === target ? 25 : 20,
        },
        style: {
          label: {
            value: `${edgeType}-${pattern.edges.length}`,
          }
        },
        label: `${edgeType}-${pattern.edges.length}`,
        labelCfg: { autoRotate: true },
        edgeType,
        sourceNodeType,
        targetNodeType,
      });
    }

    if (invalid) {
      message.info(formatMessage({ id: 'save-failed-edge-must-have-nodes' }));
      return;
    }

    newPatternInfoMap[patternId].data = pattern;
    setPatternInfoMap(newPatternInfoMap); // 放入模式编辑器中

    quitExtractMode();
  }

  const cancelExtracting = () => {
    setExtracting(false);
    if (graph && !graph.destroyed) {
      // 如果有选中的内容，退出需要二次提示
      const selectedNodes = graph.findAllByState('node', ITEM_STATE.Selected);
      const selectedEdges = graph.findAllByState('node', ITEM_STATE.Selected);
      if (selectedNodes?.length || selectedEdges?.length) {
        confirm({
          title: formatMessage({ id: "extract-confirm-cancel" }),
          icon: <ExclamationCircleOutlined />,
          content: formatMessage({ id: "extract-confirm-cancel-content" }),
          onOk() {
            clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Selected]);
            clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Selected]);
            graph.setMode('default');
            message.destroy(EXTRACT_MESSAGE_KEY);
            onOpen?.(); // 显示抽屉
            quitExtractMode();
          },
        });
      } else {
        graph.setMode('default');
        message.destroy(EXTRACT_MESSAGE_KEY);
        onOpen?.(); // 显示抽屉
        quitExtractMode();
      }
    }
  }

  // 为 graph 绑定元素更新监听，更新 hulll
  const updateHull = e => {
    if (!graph || graph.destroyed) {
      return;
    }
    const id = e?.item?.getType?.() === 'node' ? e.item.getID() : undefined;
    const hulls = graph.getHulls();
    if (!hulls) {
      return;
    }
    const foundHullKeys: string[] = [];
    Object.keys(hulls).forEach(key => {
      const hull = hulls[key];
      if (id === undefined) {
        foundHullKeys.push(key);
      } else if (hull?.members?.find(node => node.getID?.() === id)) {
        foundHullKeys.push(key);
      }
    });
    foundHullKeys.forEach(key => {
      hulls[key].updateData(hulls[key].members, []);
    })
  }

  const removeHulls = () => {
    setHullIds(ids => {
      const hullMap = graph.get('hullMap') || {};
      ids?.forEach(hullId => {
        const hull = graph.getHullById(hullId);
        if (hull) {
          graph.removeHull(hull);
        }
        delete hullMap[hullId];
      });
      return [];
    });
  }

  const handleKeydown = (e) => {
    const code = e.key;
    if (!code) {
      return;
    }
    if (code.toLowerCase() === 'w') keydown = true;
    else keydown = false;
  }

  const handleKeyup = e => keydown = false

  // tab 切换，取消图上的选中状态
  useEffect(() => {
    if (graph && !graph.destroyed) {
      clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Selected]);
      clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Selected]);
    }
  }, [activeKey]);

  useEffect(() => {
    message.destroy(EXTRACT_MESSAGE_KEY); // 销毁提示 message
    if (!graph || graph.destroyed) {
      return;
    }
    graph.addBehaviors([
      {
        type: 'lasso-select',
        trigger: 'drag',
        shouldDeselect: () => false
      } as any,
      'click-select',
      'zoom-canvas',
      {
        type: 'drag-canvas',
        shouldBegin: () => keydown,
      }
    ], 'pattern-match-lasso');

    graph.on('afterupdateitem', updateHull);
    graph.on('afterlayout', updateHull);
    graph.on('graphin:datachange' as any, removeHulls);
    graph.on('node:toggleevent' as any, removeHulls);
    graph.on('sizechange' as any, updateDomSize);
    graph.on('keydown', handleKeydown);
    graph.on('keyup', handleKeyup)
    return () => {
      message.destroy(EXTRACT_MESSAGE_KEY); // 销毁提示 message
      if (graph && !graph.destroyed) {
        setCanvasDomStyle(false);
        graph.off('afterudpateitem', updateHull);
        graph.off('afterlayout', updateHull);
        graph.off('graphin:datachange', removeHulls);
        graph.off('node:toggleevent', removeHulls);
        graph.off('sizechange', updateDomSize);
        graph.off('keydown', handleKeydown);
        graph.off('keyup', handleKeyup)
      }
    }
  }, []);

  /** 浏览器宽高改变时，在抽取状态下需要更新画布宽高以便显示画布外边框 */
  const updateDomSize = ({ width, height }) => {
    previousSize = { width, height };
    const canvasDOM = graph.get('canvas').get('el');
    if (canvasDOM.classList.contains(EXTRACT_MODE_CANVAS_CLASSNAME)) {
      setTimeout(() => {
        graph.changeSize(width - 32, height - 32);
      }, 151);
    } else if (width !== graph.getWidth() || height !== graph.getHeight()) {
      graph.changeSize(width, height);
    }
  }

  const setCanvasDomStyle = (extractMode) => {
    const canvasDOM = graph.get('canvas').get('el');
    if (extractMode) {
      graph.changeSize(previousSize.width - 32, previousSize.height - 32);
      canvasDOM.classList.add(EXTRACT_MODE_CANVAS_CLASSNAME);
    } else {
      const { width, height } = previousSize;
      graph.changeSize(width, height);
      canvasDOM.classList.remove(EXTRACT_MODE_CANVAS_CLASSNAME);
    }
  }

  const addTab = copyItem => {
    if (panes.length > MAX_PATTERN_NUM - 1) {
      message.info(formatMessage({ id: 'pattern-num-limit' }));
      return;
    }
    newTabIndex += 1;
    const id = `${newTabIndex}`;
    const newPanes = [...panes];
    const newPatternInfoMap = {...patternInfoMap};
    newPatternInfoMap[id] = {
      id,
      title: <FormattedMessage id="pattern-title" value={id} />,
      data: null
    };
    let isCloningPattern = false;
    if (copyItem && patternInfoMap[copyItem.key]?.data) {
      newPatternInfoMap[id].data = cloneDeep(patternInfoMap[copyItem.key].data);
      isCloningPattern = true;
    }
    newPanes.push({
      content: <PatternPane
        id={id}
        data={newPatternInfoMap[id]}
        schemaEdgeMap={schemaEdgeMap}
        editPattern={() => setEditorVisible(true)}
        importData={importData}
      />,
      title: <FormattedMessage id="pattern-title" value={id} />,
      key: id
    });
    setPanes(newPanes);
    setPatternInfoMap(newPatternInfoMap);
    setActiveKey(id);
  }

  const removeTab = (key) => {
    let newActiveKey = activeKey;
    let lastIndex;
    panes.forEach((pane, i) => {
      if (pane.key === key) {
        lastIndex = i - 1;
      }
    });
    const newPanes = panes.filter(pane => pane.key !== key);
    if (newPanes.length && newActiveKey === key) {
      if (lastIndex >= 0) {
        newActiveKey = newPanes[lastIndex].key;
      } else {
        newActiveKey = newPanes[0].key;
      }
    }
    const newPatternInfoMap = {...patternInfoMap};
    delete newPatternInfoMap[key];
    setActiveKey(newActiveKey);
    setPatternInfoMap(newPatternInfoMap);
    setPanes(newPanes);
  }

  const onTabEdit = (targetKey, action) => {
    if (action === 'remove') {
      removeTab(targetKey);
    }
  }

  const drawHulls = matches => {
    removeHulls();
    const ids: string[] = [];
    matches.forEach(match => {
      const hullId = createUuid();
      ids.push(hullId);
      match.hullId = hullId;
      graph.createHull({
        id: hullId,
        members: match.nodes?.map(node => node.id),
        padding: 10,
      });
    });
    setHullIds(ids);
  }

  const onMatch = async () => {
    if (!graph || graph.destroyed) {
      return;
    }
    if (!activeKey || !patternInfoMap[+activeKey]?.data) {
      message.info(formatMessage({ id: 'cannot-match-empty-pattern' }));
      return;
    }
    const res = patternInfoMap[+activeKey].data;
    const pattern = {
      nodes: res.nodes.map(node => {
        return {
          id: node.id,
          label: node.nodeType,
          name: node.nodeType,
          rules: node.rules
        };
      }),
      edges: res.edges.map(edge =>  {
        return {
          id: edge.id,
          label: edge.edgeType,
          source: edge.source,
          target: edge.target,
          rules: edge.rules
        };
      }),
    };
    const graphData: GraphinData = {
      nodes: [],
      edges: []
    };
    data.nodes.forEach(node => {
      if (!graph.findById(node.id)?.isVisible()) {
        return;
      }
      graphData.nodes.push({
        id: node.id,
        data: node.data,
        label: node.nodeType
      })
    });
    data.edges.forEach(edge => {
      if (!graph.findById(edge.id)?.isVisible()) {
        return;
      }
      graphData.edges.push({
        id: edge.id,
        data: edge.data,
        source: edge.source,
        target: edge.target,
        label: edge.edgeType
      });
    });

    // 计算模式匹配结果
    setLoading(true);
    const directed = true;
    let matches: GraphinData[] = [];
    try {
      matches = await GADDI(
        graphData,
        pattern,
        directed,
        undefined as any,
        undefined as any,
        'label',
        'label'
      ) as GraphinData[];
    } catch (error) {
      console.warn('Pattern Matching Failed.', error);
    }
    if (!matches?.length) {
      message.info(formatMessage({ id: 'no-result' }));
      setLoading(false);
      drawHulls([]);
      setResult([]);
      return;
    }
    
    // 对结果 matches 进行 rules 的筛选
    filterByPatternRules(graphData, pattern, matches, directed);
    // 进行 rules 筛选之后，若 matches 被删空了，提示没找到匹配
    if (!matches?.length) {
      message.info(formatMessage({ id: 'no-result' }));
    }

    setLoading(false);
    drawHulls(matches);
    setResult(matches);
  }

  const onExport = () => {
    if (!graph || graph.destroyed) {
      return;
    }
    if (!activeKey || !patternInfoMap[+activeKey]?.data) {
      message.info(formatMessage({ id: 'cannot-match-empty-pattern' }));
      return;
    }
    const res = patternInfoMap[+activeKey].data;
    const pattern = {
      nodes: res.nodes.map(node => {
        node.data.label = node.nodeType;
        node.data.rules = node.rules;
        return node.data;
      }),
      edges: res.edges.map(edge =>  {
        edge.data.label = edge.nodeType;
        edge.data.rules = edge.rules;
        return edge.data;
      }),
    }
    exportPattern?.(pattern);
  }
  
  const importData = (data, patternId) => {
    const newPatternInfoMap = { ...patternInfoMap };
    newPatternInfoMap[patternId].data = data;
    setPatternInfoMap(newPatternInfoMap);
  }

  const savePattern = (id, saveData) => {
    const newPatternInfoMap = {...patternInfoMap};
    if (!newPatternInfoMap[id]) {
      newPatternInfoMap[id] = {
        id,
        title: <FormattedMessage id="pattern-title" value={id} />,
      }
    }
    newPatternInfoMap[id].data = saveData;
    setPatternInfoMap(newPatternInfoMap);
  }

  const reset = () => {
    clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Selected]);
    clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Selected]);
    removeHulls();
    setResult([]);
  }

  const patternTabsMenu = <Menu className="kg-pattern-match-patten-tab-dropdown">
    <Menu.Item key='new' onClick={addTab}><FormattedMessage id="new-pattern" /></Menu.Item>
    {panes?.map(item => (
      <Menu.Item key={item.key} onClick={() => addTab(item)}>
        <FormattedMessage id="clone-title" value={item.key} />
      </Menu.Item>
    ))}
  </Menu>;
  
  // 组件挂载时，获取 Canvas 的父元素，用于通过 Portal 放置额外按钮。
  const [extraButtonsContainer, setExtraButtonsContainer] = useState<HTMLDivElement>();
  useEffect(() => {
    const canvasDOM: HTMLCanvasElement = graph.get('canvas').get('el');
    const parentDOM = canvasDOM.parentNode;
    const container = document.createElement('div');
    parentDOM?.appendChild(container);
    setExtraButtonsContainer(container);
    previousSize = { width: graph.getWidth(), height: graph.getHeight() };
    return () => {
      container.parentNode?.removeChild(container);
    }
  }, []);

  const buttonsPortal = extracting && extraButtonsContainer && ReactDOM.createPortal(
    <div className="kg-pattern-match-extract-buttons">
      <Button onClick={cancelExtracting}><FormattedMessage id='cancel' /></Button>
      <Button type="primary" onClick={extractPattern}><FormattedMessage id='confirm' /></Button>
    </div>,
    extraButtonsContainer,
  );

  return <div style={style}>
      <div className="kg-pattern-match-content-wrapper" >
        <div
          className="kg-pattern-match-pattern-add-wrapper"
          style={{
            left: panes.length === 1 ? 79 : (106 + (panes.length - 1) * 108),
            display: panes.length > (MAX_PATTERN_NUM - 1) ? 'none' : 'block'
          }}
        >
          <Dropdown overlay={patternTabsMenu} placement="bottomCenter">
            <div className="kg-pattern-match-pattern-add" onClick={addTab}>+</div>
          </Dropdown>
        </div>
        <Tabs
          type="editable-card"
          activeKey={`${activeKey}`}
          onChange={setActiveKey}
          onEdit={onTabEdit}
          hideAdd
          style={{
            marginTop: panes.length > (MAX_PATTERN_NUM - 1) ? '-4px' : '-40px'
          }}
        >
          {panes.map(pane => (
            <TabPane tab={pane.title} key={pane.key} closable={panes.length > 1}>
              {pane.content}
            </TabPane>
          ))}
        </Tabs>
      </div>
      <Row className="button-wrapper" justify="space-between">
        <Col span={6}>
          <Button
            className="kg-pattern-match-apply-button"
            style={{ display: extracting ? 'none' : 'inline-block' }}
            type='primary'
            loading={loading}
            onClick={onMatch}
          >
            <FormattedMessage id="match" />
          </Button>
        </Col>
        <Col span={6}>
          {patternInfoMap[+activeKey]?.data ?  <Button
            className="kg-pattern-match-export-button"
            style={{
              ...(exportButton?.style || {}),
              display: extracting ? 'none' : 'inline-block'
            }}
            loading={loading}
            disabled={!!extracting}
            onClick={onExport}
          >
            {exportButton?.text || <FormattedMessage id="export-pattern" />}
          </Button> : ''}
        </Col>
        <Col span={4} offset={6}>
          <Button
            className="kg-pattern-match-reset-button"
            danger
            onClick={reset}
            icon={<DeleteOutlined />}
          ></Button>
        </Col>
      </Row>
      
      {result?.length && !extracting ? <ResultTable
        matches={result}
      /> : ''}
    <PatternEditor
      visible={editorVisible}
      patternInfo={patternInfoMap[activeKey]}
      setVisible={setEditorVisible}
      savePattern={savePattern}
      nodeProperties={nodeProperties}
      edgeProperties={edgeProperties}
      nodeTypes={nodeTypes}
      edgeTypes={edgeTypes}
      schemaNodeMap={schemaNodeMap}
      schemaEdgeMap={schemaEdgeMap}
    />
    {buttonsPortal}
  </div>;
};

export default PatternMatch;

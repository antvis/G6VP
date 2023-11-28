/**
 * author:shiwu.wyy@antgroup.com
 */

import { DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import Algorithm from '@antv/algorithm';
import { common, useContext } from '@antv/gi-sdk';
import { GraphinData } from '@antv/graphin';
import { useMemoizedFn } from 'ahooks';
import { Button, Col, Dropdown, Menu, Modal, Row, Tabs, Tooltip, message } from 'antd';
import { cloneDeep, set } from 'lodash';
import React, { memo, useEffect, useMemo, useRef, useState } from 'react';
import Util from '../utils';
import { TypeInfo } from './editDrawer';
import PatternEditor, { TypeProperties } from './patternEditor';
import PatternPane from './patternPane';
import { ControlledValues, ITEM_STATE, PatternMatchProps, SPLITOR } from './registerMeta';
import ResultTable from './resultTable';
import { filterByPatternRules } from './util';

import $i18n from '../i18n';
import './index.less';

const { confirm } = Modal;
const { TabPane } = Tabs;
const { GADDI, breadthFirstSearch } = Algorithm;
const { createUuid, clearItemsStates, fittingString } = Util;

const MAX_PATTERN_NUM = 4;
const PATTERN_MATCH_MODE = 'pattern-match-lasso';
const EXTRACT_MESSAGE_KEY = 'kg-pattern-match-extract-message';
const EXTRACT_MODE_CANVAS_CLASSNAME = 'kg-pattern-match-extract-mode-canvas';

let newTabIndex = 1;
let previousSize = { width: 500, height: 500 };
let keydown = false;

const PatternMatch: React.FC<PatternMatchProps> = ({ style, controlledValues, onClose, onOpen, options = {} }) => {
  const {
    onGraphEditorVisibleChange,
    onExtractModeChange,
    exportPattern = content => common.createDownload(JSON.stringify(content), 'pattern.json'),
    exportButton,
  } = options;
  const { graph, context, updateHistory } = useContext();
  const { data, schemaData } = context;

  const [activeKey, setActiveKey] = useState('1');
  const [editorVisible, setEditorVisible] = useState(false);
  const [result, setResult] = useState([] as GraphinData[]);
  const [hullIds, setHullIds] = useState([] as string[]);
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState<string | false>(false);
  // 数据结构 { [nodeType: string]: Set }
  const [nodeProperties, setNodeProperties] = useState({} as TypeProperties);
  // 数据结构 { [edgeType: string]: Set }
  const [edgeProperties, setEdgeProperties] = useState({} as TypeProperties);
  const [nodeTypes, setNodeTypes] = useState([] as TypeInfo[]);
  const [edgeTypes, setEdgeTypes] = useState([] as TypeInfo[]);
  const [schemaEdgeMap, setSchemaEdgeMap] = useState({});
  const [schemaNodeMap, setSchemaNodeMap] = useState({});
  const graphModeCacheRef = useRef(graph?.getMode() || 'default');

  const initialPatternInfoMap = useMemo(
    () => ({
      '1': {
        id: '1',
        title: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.Mode', dm: '模式-1' }),
        data: null,
      },
    }),
    [],
  );
  const [patternInfoMap, setPatternInfoMap] = useState(initialPatternInfoMap);

  const importData = (data, patternId) => {
    const newPatternInfoMap = { ...patternInfoMap };
    newPatternInfoMap[patternId].data = data;
    setPatternInfoMap(newPatternInfoMap);
  };

  const [panes, setPanes] = useState(() => [
    {
      title: $i18n.get(
        {
          id: 'gi-assets-algorithm.src.PatternMatch.Component.ModeIntialpatterninfomapid',
          dm: '模式-{intialPatternInfoMapId}',
        },
        { intialPatternInfoMapId: initialPatternInfoMap['1'].id },
      ),
      content: (
        <PatternPane
          {...initialPatternInfoMap['1']}
          schemaEdgeMap={schemaEdgeMap}
          editPattern={() => setEditorVisible(true)}
          importData={importData}
        />
      ),

      key: initialPatternInfoMap['1'].id,
    },
  ]);

  useEffect(() => {
    if (!graph || graph.destroyed) return;

    // init previousSize
    previousSize = { width: graph.getWidth(), height: graph.getHeight() };

    const handleClickEdge = e => {
      const mode = graph.getMode();
      if (mode !== PATTERN_MATCH_MODE) return;
      // 选中边时，自动选中边的端点
      const edge = e.item;
      const source = edge.getSource();
      const target = edge.getTarget();
      graph.setItemState(source, ITEM_STATE.Active, true);
      graph.setItemState(target, ITEM_STATE.Active, true);
    };
    graph.on('edge:click', handleClickEdge);
    return () => {
      graph.off('edge:click', handleClickEdge);
    };
  }, []);

  useEffect(() => {
    const sEdgeMap = {};
    const sNodeMap = {};
    schemaData.edges.forEach(schemaEdge => (sEdgeMap[schemaEdge.edgeType] = schemaEdge));
    schemaData.nodes.forEach(schemaNode => (sNodeMap[schemaNode.nodeType] = schemaNode));

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
        content: <Tooltip title={fittedText?.includes('…') ? key : ''}>{fittedText}</Tooltip>,
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
        content: (
          <Tooltip title={fittedText?.includes('…') || fittedSubText?.includes('…') ? `${typeName} (${subText})` : ''}>
            {fittedText}
            <p className="kg-node-importance-tip">{fittedSubText}</p>
          </Tooltip>
        ),
      };
    });
    setSchemaEdgeMap(sEdgeMap);
    setSchemaNodeMap(sNodeMap);
    setNodeProperties(nodeTypeProperties);
    setEdgeProperties(edgeTypeProperties);
    setNodeTypes(nTypes);
    setEdgeTypes(eTypes);
  }, [data]);

  // 编辑器的显示抛出回调
  useEffect(() => onGraphEditorVisibleChange?.(editorVisible), [editorVisible]);

  // 模式编辑完成后，patternInfoMap 发生变化，触发模式 tabs 中显示的内容变化
  useEffect(() => {
    const newPanes = panes.map(pane => ({
      ...pane,
      content: (
        <PatternPane
          id={pane.key}
          data={patternInfoMap[pane.key]?.data}
          schemaEdgeMap={schemaEdgeMap}
          editPattern={() => setEditorVisible(true)}
          extractPattern={enableExtractingMode}
          importData={importData}
        />
      ),
    }));
    setPanes(newPanes);
  }, [patternInfoMap]);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const key = `${newTabIndex + 1}`;
      addTab({ key });
      savePattern(key, controlledValues.pattern);
      onMatch(controlledValues.pattern);
      onOpen?.();
    }
  }, [controlledValues]);

  useEffect(() => {
    const handleClick = e => {
      const { item } = e;
      graph.setItemState(item, ITEM_STATE.Active, !item.hasState(ITEM_STATE.Active));
    };
    if (extracting) {
      graph.on('edge:click', handleClick);
      graph.on('node:click', handleClick);
    } else {
      graph.off('edge:click', handleClick);
      graph.off('node:click', handleClick);
    }
    return () => {
      graph.off('edge:click', handleClick);
      graph.off('node:click', handleClick);
    };
  }, [extracting]);

  const enableExtractingMode = useMemoizedFn(patternId => {
    if (!graph || graph.destroyed) return;
    previousSize = { width: graph.getWidth(), height: graph.getHeight() };
    message.info({
      key: EXTRACT_MESSAGE_KEY,
      className: 'kg-pattern-match-extract-tip-long',
      duration: 0,
      content: (
        <>
          {$i18n.get({
            id: 'gi-assets-algorithm.src.PatternMatch.Component.TheCanvasIsInThe',
            dm: '画布处于选择状态，你可以通过【圈选】或【点选】子图，被选中的子图将被抽取为模式。【按住 W】 可拖拽画布',
          })}

          <Button onClick={cancelExtracting} style={{ marginLeft: 8 }} size="small">
            {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.Cancel', dm: '取消' })}
          </Button>
          <Button type="primary" onClick={extractPattern} style={{ marginLeft: 8 }} size="small">
            {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.Confirm', dm: '确认' })}
          </Button>
        </>
      ),

      style: {
        marginTop: '20px',
      },
    });
    graph.setMode(PATTERN_MATCH_MODE); // 切换为 lasso 交互模式，该模式下没有其他 behavior
    // 恢复图上的选中状态，为拉索框选做准备
    clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Active]);
    clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Active]);
    setExtracting(patternId);

    onClose?.(); // 隐藏抽屉;
    onExtractModeChange?.(true);
    // 设置 canvas dom 描边样式
    setCanvasDomStyle(true);
  });

  const quitExtractMode = () => {
    graph.setMode(graphModeCacheRef.current); // 恢复默认交互模式
    message.destroy(EXTRACT_MESSAGE_KEY); // 销毁提示 message
    setExtracting(false); // 恢复面板状态
    onOpen?.(); // 显示抽屉
    setExtracting(false); // 恢复面板状态
    onExtractModeChange?.(false);
    // 设置 canvas dom 描边样式
    setCanvasDomStyle(false);
  };

  const extractPattern = useMemoizedFn(() => {
    if (!graph || graph.destroyed) {
      quitExtractMode();
      return;
    }

    if (!extracting) return;

    const patternId = extracting;
    const selectedNodeIds = (graph.findAllByState('node', ITEM_STATE.Active) || []).map(node => node.getID());
    const selectedEdgeIds = (graph.findAllByState('edge', ITEM_STATE.Active) || []).map(node => node.getID());

    if (!selectedNodeIds.length) return;

    // 验证当前模式图是连通的
    const patternGraphData: GraphinData = {
      nodes: data.nodes.filter(node => selectedNodeIds.includes(node.id)),
      edges: data.edges.filter(edge => selectedEdgeIds.includes(edge.id)),
    };
    const traversedTag = {};
    breadthFirstSearch(
      patternGraphData,
      patternGraphData.nodes[0].id,
      {
        enter: ({ current }) => {
          traversedTag[current] = true;
        },
      },
      false,
    );
    if (Object.keys(traversedTag).length < patternGraphData.nodes.length) {
      message.info(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.FailedToCreateTheSchema',
          dm: '创建模式失败。模式必须是连通的',
        }),
      );
      return;
    }

    const newPatternInfoMap = { ...patternInfoMap };
    // 抽取成模式
    const newIdMap = {};
    const pattern: GraphinData = { nodes: [], edges: [] };
    patternGraphData.nodes.forEach((node, i) => {
      const { id: dataId, nodeType } = node;
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
          },
        },
        originLabel: `${nodeType}-${pattern.nodes.length}`,
        data: { id, nodeType },
      });
    });

    // 抽取边的同时，验证当前模式图中所有边的端点都在 nodes 中
    let invalid = false;

    for (let i = 0; i < patternGraphData.edges.length; i++) {
      const edge = patternGraphData.edges[i];
      const { id: dataId, source: dataSource, target: dataTarget, edgeType } = edge;
      if (!newIdMap[dataSource] || !newIdMap[dataTarget]) {
        invalid = true;
        break;
      }
      const { id: source, nodeType: sourceNodeType } = newIdMap[dataSource];
      const { id: target, nodeType: targetNodeType } = newIdMap[dataTarget];

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
          },
        },
        label: `${edgeType}-${pattern.edges.length}`,
        labelCfg: { autoRotate: true },
        edgeType,
        sourceNodeType,
        targetNodeType,
      });
    }

    if (invalid) {
      message.info(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.FailedToCreateTheSchema.1',
          dm: '创建模式失败。模式中不可以存在悬挂边',
        }),
      );
      return;
    }

    newPatternInfoMap[patternId].data = pattern;
    setPatternInfoMap(newPatternInfoMap); // 放入模式编辑器中

    quitExtractMode();
  });

  const cancelExtracting = () => {
    setExtracting(false);
    if (!graph || graph.destroyed) return;
    // 如果有选中的内容，退出需要二次提示
    const selectedNodes = graph.findAllByState('node', ITEM_STATE.Active);
    const selectedEdges = graph.findAllByState('node', ITEM_STATE.Active);
    if (selectedNodes?.length || selectedEdges?.length) {
      confirm({
        title: $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.ConfirmToExitTheExtraction',
          dm: '确认退出抽取模式',
        }),
        icon: <ExclamationCircleOutlined />,
        content: $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.IfTheSelectedContentAlready',
          dm: '已有选中内容，退出将不会将使用选中内容作为模式。确认退出吗？',
        }),
        onOk() {
          clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Active]);
          clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Active]);
          graph.setMode(graphModeCacheRef.current);
          message.destroy(EXTRACT_MESSAGE_KEY);
          onOpen?.(); // 显示抽屉
          quitExtractMode();
        },
      });
    } else {
      graph.setMode(graphModeCacheRef.current);
      message.destroy(EXTRACT_MESSAGE_KEY);
      onOpen?.(); // 显示抽屉
      quitExtractMode();
    }
  };

  // 为 graph 绑定元素更新监听，更新 hulll
  const updateHull = e => {
    if (!graph || graph.destroyed) return;
    const id = e?.item?.getType?.() === 'node' ? e.item.getID() : undefined;
    const hulls = graph.getHulls();
    if (!hulls) return;
    const foundHullKeys: string[] = [];
    Object.keys(hulls).forEach(key => {
      const hull = hulls[key];
      if (id === undefined) foundHullKeys.push(key);
      else if (hull?.members?.find(node => node.getID?.() === id)) foundHullKeys.push(key);
    });
    foundHullKeys.forEach(key => hulls[key].updateData(hulls[key].members, []));
  };

  const removeHulls = () => {
    setHullIds(ids => {
      const hullMap = graph.get('hullMap') || {};
      ids?.forEach(hullId => {
        const hull = graph.getHullById(hullId);
        if (hull) graph.removeHull(hull);
        delete hullMap[hullId];
      });
      return [];
    });
  };

  const handleKeydown = e => {
    const code = e.key;
    if (!code) return;
    if (code.toLowerCase() === 'w') keydown = true;
    else keydown = false;
  };

  const handleKeyup = e => (keydown = false);

  // tab 切换，取消图上的选中状态
  useEffect(() => {
    if (graph && !graph.destroyed) {
      clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Active]);
      clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Active]);
    }
  }, [activeKey]);

  useEffect(() => {
    message.destroy(EXTRACT_MESSAGE_KEY); // 销毁提示 message
    if (!graph || graph.destroyed) return;
    graph.addBehaviors(
      [
        {
          type: 'lasso-select',
          trigger: 'drag',
          selectedState: ITEM_STATE.Active,
          shouldDeselect: () => false,
        } as any,
        'zoom-canvas',
        {
          type: 'drag-canvas',
          shouldBegin: () => keydown,
        },
      ],

      'pattern-match-lasso',
    );

    graph.on('afterupdateitem', updateHull);
    graph.on('afterlayout', updateHull);
    graph.on('graphin:datachange' as any, removeHulls);
    graph.on('node:toggleevent' as any, removeHulls);
    graph.on('sizechange' as any, updateDomSize);
    graph.on('keydown', handleKeydown);
    graph.on('keyup', handleKeyup);
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
        graph.off('keyup', handleKeyup);
      }
    };
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
  };

  const setCanvasDomStyle = extractMode => {
    const canvasDOM = graph.get('canvas').get('el');
    if (extractMode) {
      graph.changeSize(previousSize.width - 32, previousSize.height - 32);
      canvasDOM.classList.add(EXTRACT_MODE_CANVAS_CLASSNAME);
    } else {
      const { width, height } = previousSize;
      graph.changeSize(width, height);
      canvasDOM.classList.remove(EXTRACT_MODE_CANVAS_CLASSNAME);
    }
  };

  const addTab = (copyItem: any = undefined) => {
    if (panes.length > MAX_PATTERN_NUM - 1) {
      message.info(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.FailedToAddModeThe',
          dm: '添加模式失败。模式数量已达上限！',
        }),
      );
      return;
    }
    newTabIndex += 1;
    const id = `${newTabIndex}`;
    const newPanes = [...panes];
    const newPatternInfoMap = { ...patternInfoMap };
    newPatternInfoMap[id] = {
      id,
      title: $i18n.get(
        {
          id: 'gi-assets-algorithm.src.PatternMatch.Component.ModeId',
          dm: '模式-{id}',
        },
        { id: id },
      ),
      data: null,
    };
    if (copyItem && patternInfoMap[copyItem.key]?.data) {
      newPatternInfoMap[id].data = cloneDeep(patternInfoMap[copyItem.key].data);
    }
    newPanes.push({
      content: (
        <PatternPane
          id={id}
          data={newPatternInfoMap[id]}
          schemaEdgeMap={schemaEdgeMap}
          editPattern={() => setEditorVisible(true)}
          importData={importData}
        />
      ),

      title: $i18n.get(
        {
          id: 'gi-assets-algorithm.src.PatternMatch.Component.ModeId',
          dm: '模式-{id}',
        },
        { id: id },
      ),
      key: id,
    });
    setPanes(newPanes);
    setPatternInfoMap(newPatternInfoMap);
    setActiveKey(id);
  };

  const removeTab = key => {
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
    const newPatternInfoMap = { ...patternInfoMap };
    delete newPatternInfoMap[key];
    setActiveKey(newActiveKey);
    setPatternInfoMap(newPatternInfoMap);
    setPanes(newPanes);
  };

  const onTabEdit = (targetKey, action) => {
    if (action === 'remove') removeTab(targetKey);
  };

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
  };

  const onMatch = async (patternProp?: GraphinData) => {
    if (!graph || graph.destroyed) {
      handleUpdateHistory(
        {},
        false,
        $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.TheGraphInstanceDoesNot', dm: '图实例不存在' }),
      );
      return;
    }
    if (!patternProp && (!activeKey || !patternInfoMap[+activeKey]?.data)) {
      message.info(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.TheNullPatternCannotBe',
          dm: '无法匹配空模式！',
        }),
      );
      handleUpdateHistory(
        {},
        false,
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.TheNullPatternCannotBe',
          dm: '无法匹配空模式！',
        }),
      );
      return;
    }
    const res = patternInfoMap[+activeKey].data;
    const pattern =
      patternProp ||
      ({
        nodes: res.nodes.map(node => {
          return {
            id: node.id,
            label: node.nodeType,
            name: node.nodeType,
            rules: node.rules,
          };
        }),
        edges: res.edges.map(edge => {
          return {
            id: edge.id,
            label: edge.edgeType,
            source: edge.source,
            target: edge.target,
            rules: edge.rules,
          };
        }),
      } as GraphinData);

    const graphData: GraphinData = {
      nodes: [],
      edges: [],
    };
    data.nodes.forEach(node => {
      if (!graph.findById(node.id)?.isVisible()) return;
      graphData.nodes.push({
        id: node.id,
        data: node.data,
        label: node.nodeType,
      });
    });
    data.edges.forEach(edge => {
      if (!graph.findById(edge.id)?.isVisible()) return;
      graphData.edges.push({
        id: edge.id,
        data: edge.data,
        source: edge.source,
        target: edge.target,
        label: edge.edgeType,
      });
    });

    // 计算模式匹配结果
    setLoading(true);
    const directed = true;
    let matches: GraphinData[] = [];
    try {
      matches = (await GADDI(
        graphData,
        pattern,
        directed,
        undefined as any,
        undefined as any,
        'label',
        'label',
      )) as GraphinData[];
    } catch (error) {
      console.warn('Pattern Matching Failed.', error);
    }
    if (!matches?.length) {
      message.info(
        $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.NoMatchFound', dm: '没有找到匹配！' }),
      );
      setLoading(false);
      drawHulls([]);
      setResult([]);
      handleUpdateHistory(
        { pattern },
        false,
        $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.NoMatchFound', dm: '没有找到匹配！' }),
      );
      return;
    }

    // 对结果 matches 进行 rules 的筛选
    filterByPatternRules(graphData, pattern, matches, directed);
    // 进行 rules 筛选之后，若 matches 被删空了，提示没找到匹配
    if (!matches?.length) {
      message.info(
        $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.NoMatchFound', dm: '没有找到匹配！' }),
      );
    }

    setLoading(false);
    drawHulls(matches);
    setResult(matches);

    handleUpdateHistory({ pattern });
  };

  const onExport = () => {
    if (!graph || graph.destroyed) return;
    if (!activeKey || !patternInfoMap[+activeKey]?.data) {
      message.info(
        $i18n.get({
          id: 'gi-assets-algorithm.src.PatternMatch.Component.TheNullPatternCannotBe',
          dm: '无法匹配空模式！',
        }),
      );
      return;
    }
    const res = patternInfoMap[+activeKey].data;
    const pattern = {
      nodes: res.nodes.map(node => {
        set(node, 'data.label', node.nodeType);
        set(node, 'data.rules', node.rules);
        return node.data;
      }),
      edges: res.edges.map(edge => {
        set(edge, 'data.label', edge.edgeType);
        set(edge, 'data.rules', edge.rules);
        return edge.data;
      }),
    };
    exportPattern?.(pattern);
  };

  const savePattern = (id, saveData) => {
    const newPatternInfoMap = { ...patternInfoMap };
    if (!newPatternInfoMap[id]) {
      newPatternInfoMap[id] = {
        id,
        title: $i18n.get(
          {
            id: 'gi-assets-algorithm.src.PatternMatch.Component.ModeId',
            dm: '模式-{id}',
          },
          { id: id },
        ),
      };
    }
    newPatternInfoMap[id].data = saveData;
    setPatternInfoMap(newPatternInfoMap);
  };

  const reset = () => {
    clearItemsStates(graph, graph.getEdges(), [ITEM_STATE.Active]);
    clearItemsStates(graph, graph.getNodes(), [ITEM_STATE.Active]);
    removeHulls();
    setResult([]);
  };

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpdateHistory = (params: ControlledValues, success: boolean = true, errorMsg?: string) => {
    const { pattern } = params;
    if (!pattern) return;
    updateHistory({
      componentId: 'PatternMatch',
      type: 'analyse',
      subType: $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.PatternMatching', dm: '模式匹配' }),
      statement: `子图 ${pattern.nodes?.length} 个节点，${pattern.edges?.length} 条边`,
      success,
      errorMsg,
      params: {
        pattern: {
          nodes: pattern.nodes.map(node => ({
            nodeType: node.label || node.name,
            ...node,
          })),
          edges: pattern.edges.map(edge => ({
            edgeType: edge.label,
            ...edge,
          })),
        },
      },
    });
  };

  const patternTabsMenu = (
    <Menu className="kg-pattern-match-patten-tab-dropdown">
      <Menu.Item key="new" onClick={addTab}>
        {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.CreateMode', dm: '新建模式' })}
      </Menu.Item>
      {panes?.map(item => (
        <Menu.Item key={item.key} onClick={() => addTab(item)}>
          {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.CopyMode', dm: '复制模式-' })}
          {item.key}
        </Menu.Item>
      ))}
    </Menu>
  );

  // 组件挂载时，获取 Canvas 的父元素，用于通过 Portal 放置额外按钮。
  const [extraButtonsContainer, setExtraButtonsContainer] = useState<HTMLDivElement>();
  useEffect(() => {
    const canvasDOM: HTMLCanvasElement = graph.get('canvas').get('el');
    const parentDOM = canvasDOM.parentNode;
    const container = document.createElement('div');
    parentDOM?.appendChild(container);
    setExtraButtonsContainer(container);
    return () => {
      container.parentNode?.removeChild(container);
    };
  }, []);

  return (
    <div style={style}>
      <div className="kg-pattern-match-content-wrapper">
        <div
          className="kg-pattern-match-pattern-add-wrapper"
          style={{
            left: panes.length === 1 ? 79 : 106 + (panes.length - 1) * 108,
            display: panes.length > MAX_PATTERN_NUM - 1 ? 'none' : 'block',
          }}
        >
          <Dropdown overlay={patternTabsMenu} placement="bottomCenter">
            <div className="kg-pattern-match-pattern-add" onClick={addTab}>
              +
            </div>
          </Dropdown>
        </div>
        <Tabs
          type="editable-card"
          activeKey={activeKey}
          onChange={setActiveKey}
          onEdit={onTabEdit}
          hideAdd
          style={{
            marginTop: panes.length > MAX_PATTERN_NUM - 1 ? '-4px' : '-40px',
          }}
          items={panes.map(({ key, title, content }) => ({
            label: title,
            key,
            closable: panes.length > 1,
            children: content,
          }))}
        />
      </div>
      <Row className="button-wrapper" justify="space-between">
        <Col span={6}>
          <Button
            className="kg-pattern-match-apply-button"
            style={{ display: extracting ? 'none' : 'inline-block' }}
            type="primary"
            loading={loading}
            onClick={() => onMatch()}
          >
            {$i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.Match', dm: '匹配' })}
          </Button>
        </Col>
        <Col span={6}>
          {patternInfoMap[+activeKey]?.data ? (
            <Button
              className="kg-pattern-match-export-button"
              style={{
                ...(exportButton?.style || {}),
                display: extracting ? 'none' : 'inline-block',
              }}
              loading={loading}
              disabled={!!extracting}
              onClick={onExport}
            >
              {exportButton?.text ||
                $i18n.get({ id: 'gi-assets-algorithm.src.PatternMatch.Component.ExportMode', dm: '导出模式' })}
            </Button>
          ) : (
            ''
          )}
        </Col>
        <Col span={4} offset={6}>
          <Button className="kg-pattern-match-reset-button" danger onClick={reset} icon={<DeleteOutlined />}></Button>
        </Col>
      </Row>

      {result?.length && !extracting ? <ResultTable matches={result} /> : ''}
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
    </div>
  );
};

export default memo(PatternMatch);

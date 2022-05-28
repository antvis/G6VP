import React, { useRef, useEffect, useState } from 'react';
import { Tabs, Row, Col, Button, Divider, Layout, Menu, message, Input, Tooltip } from 'antd';
import { IItemBase } from '@antv/g6';
import { useContext, extra } from '@alipay/graphinsight';
import { IEdgeSchema, INodeSchema } from '@alipay/graphinsight/lib/process/schema'; // TODO 确认引入方式
import Graphin, { Behaviors, GraphinData, Utils as GraphinUtils } from '@antv/graphin';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { uniqueId } from '@antv/algorithm/lib/util';
import Algorithm from '@antv/algorithm';
import { cloneDeep } from 'lodash';
import deepmerge from 'deepmerge';
// import StudioContext from '../../../context';
import FormattedMessage, { formatMessage } from './locale';
// import { transformOrigin } from '../../../graph/utils/transformData';
// import transform from '../../../graph/utils/transform';
import AddRelation from './AddRelation';
import EditDrawer, { TypeInfo } from './editDrawer';
// import { FetchSchemaProperties } from '../NodeImportance/types';
import templates from './templates';
import Util from '../utils';
import { ITEM_STATE, SPLITOR } from './registerMeta';
// import { EdgeShape } from '../../../graph/types';
// import '../../ContextMenu/index.less';
import { formatDataModels } from './util';
import './index.less';

const { TabPane } = Tabs;
const { Search } = Input;
const { Header, Sider, Content } = Layout;
const { ClickSelect, DragCanvas, ZoomCanvas, DragNode, DragCombo, LassoSelect } = Behaviors;
const { breadthFirstSearch } = Algorithm;
const { createUuid, fittingString, focusNodeY } = Util;
const { deepClone } = extra;

type ItemBriefInfo = {
  id: string,
  type: 'node' | 'edge'
}
type ContextMenu = {
  type: 'node' | 'edge',
  visible: boolean,
  item: IItemBase | null,
  x: number,
  y: number
}
export type TypeProperties =  { [type: string]: Set<string> };
interface Props {
  visible: boolean;
  patternInfo: {
    id: string;
    title: string;
    data: any;
  };
  setVisible: (visible: boolean) => void;
  savePattern: (id: string, data: any) => void;
  nodeProperties: TypeProperties;
  edgeProperties: TypeProperties;
  nodeTypes: TypeInfo[];
  edgeTypes: TypeInfo[];
  schemaEdgeMap: { [key: string]: IEdgeSchema };
  schemaNodeMap: { [key: string]: INodeSchema };
}

let currentNodeIdx = 0;
const emptyData = { nodes: [], edges: [] };


const PatternEditor: React.FC<Props> = ({
  visible,
  patternInfo,
  nodeProperties,
  edgeProperties,
  nodeTypes,
  edgeTypes,
  schemaEdgeMap,
  schemaNodeMap,
  setVisible,
  savePattern,
}) => {

  const { schemaData, data, config } = useContext();

  const graphRef = useRef();
  const schemaGraphRef = useRef();
  const menuRef = React.createRef<HTMLDivElement>();

  const [graphData, setGraphData] = useState(patternInfo?.data || {
    nodes: [],
    edges: []
  });
  const [schemaNodes, setSchemaNodes] = useState([] as any[]);
  const [contextMenu, setContextMenu] = useState({
    type: 'node',
    visible: false,
    item: null,
    x: 0,
    y: 0
  } as ContextMenu);
  const [editItem, setEditItem] = useState({} as ItemBriefInfo);
  const [activePanel, setActivePanel] = useState('node');
  const [editData, setEditData] = useState();



  const clearSchemaNodeStates = () => {
    const schemaGraph = (schemaGraphRef?.current as any)?.graph;
    if (schemaGraph && !schemaGraph.destroyed) {
      schemaGraph.findAllByState('node', ITEM_STATE.Active).forEach(node => {
        schemaGraph.clearItemStates(node, ITEM_STATE.Active);
        schemaGraph.updateItem(node, {});
      });
    }
  }

  // 编辑器每次显示出来的时候，修改一下编辑图和 schema 选择图的大小。每次隐藏时，左侧恢复到默认的选择面板（schema 节点选择的面板）
  useEffect(() => {
    const graph = (graphRef?.current as any)?.graph;
    clearSchemaNodeStates();

    if (visible && graph && !graph.destroyed) {
      const dom = (graphRef.current as any).graphDOM;
      graph.changeSize(dom.clientWidth, dom.clientHeight);
      const schemaGraph = (schemaGraphRef?.current as any)?.graph;
      const schemaGraphDom = (schemaGraphRef.current as any).graphDOM;
      schemaGraphDom.style.backgroundColor = 'rgba(0, 0, 0, 0)';
      schemaGraph.changeSize(schemaGraphDom.clientWidth, schemaGraphDom.clientHeight);

      // 处理 schema 节点数据，用于绘制左侧 schema 节点选择面板上的图
      const schemaNodeData = cloneDeep(schemaData) as any;
      schemaNodeData.nodes.forEach(node => {
        const { nodeType } = node;
        node.id = `${nodeType}-${createUuid()}`
        node.originLabel = nodeType;
        node.ellipsedLabel = fittingString(nodeType, 140, 12);
        node.style = {
          ...node.style,
          label: {
            value: node.ellipsedLabel
          }
        };
      });
      const nodes = schemaNodeData.nodes.filter(node => !!nodeProperties[node.nodeType]);
      setSchemaNodes(formatDataModels('node', nodes, config));

    } else if (!visible) {
      setActivePanel('node');
    }
  }, [visible]);

  useEffect(() => {
    const schemaGraph = (schemaGraphRef?.current as any)?.graph;
    if (schemaGraph && !schemaGraph.destroyed) {
      if (schemaNodes?.length === 1) {
        setTimeout(() => {
          schemaGraph.updateItem(schemaNodes[0].id, {
            x: 30,
            y: 50
          });
        }, 0);
      } else {
        schemaGraph.updateLayout({
          type: 'grid',
          cols: 3,
          width: 200,
          nodeSize: 50
        });
      }
    }
  }, [schemaNodes]);

  // 添加事件
  useEffect(() => {
    // 为 schema 节点列表图添加点击事件
    const schemaGraph = (schemaGraphRef?.current as any)?.graph;
    schemaGraph.on('node:click', e => {
      clearSchemaNodeStates();
      currentNodeIdx += 1;
      const nodeSchema = e.item.getModel();
      const nodeId = createUuid();
      const newNode = {
        ...nodeSchema,
        style: {
          ...nodeSchema.style,
          label: {
            value: `${nodeSchema.nodeType}-n${currentNodeIdx}`
          },
        },
        id: nodeId,
      };
      newNode.id = nodeId;
      delete newNode.x;
      delete newNode.y;
      setGraphData(oldData => ({
        nodes: [...oldData.nodes].concat([newNode]),
        edges: GraphinUtils.processEdges(oldData.edges)
      }));
    });

    // 为编辑图增加右键菜单、元素点击打开右侧编辑抽屉等事件
    const graph = (graphRef?.current as any)?.graph;
    graph.needHighlightRelative = true;
    graph.on('node:contextmenu', e => {
      e.preventDefault();
      const nodeModel = e.item.getModel();
      const pos = graph.getCanvasByPoint(nodeModel.x, nodeModel.y)

      const graphTop = graph.getContainer().offsetTop;
      const graphLeft = graph.getContainer().offsetLeft;
      setContextMenu({
        type: 'node',
        visible: true,
        item: e.item,
        x: pos.x + graphLeft,
        y: pos.y + graphTop,
      })
    });
    graph.on('edge:contextmenu', e => {
      e.preventDefault();
      const pos = graph.getCanvasByPoint(e.x, e.y)
      const graphTop = graph.getContainer().offsetTop;
      const graphLeft = graph.getContainer().offsetLeft;
      setContextMenu({
        type: 'edge',
        visible: true,
        item: e.item,
        x: pos.x + graphLeft,
        y: pos.y + graphTop,
      })
    });
    graph.on('canvas:click', e => {
      setContextMenu(oldMenu => ({
        ...oldMenu,
        visible: false,
      }));
      setEditItem({} as ItemBriefInfo);
    });

    // 打开节点的编辑面板
    graph.on('node:click', e => {
      setEditItem({
        type: 'node',
        id: e.item.getID()
      });
    });

    // 打开边的编辑面板
    graph.on('edge:click', e => {
      const model = e.item.getModel();
      setEditItem({
        type: 'edge',
        id: model.id
      });
    });

    schemaGraph.on('node:mouseenter', e => {
      schemaGraph.updateItem(e.item, {
        style: {
          label: {
            value: e.item.getModel?.()?.originLabel || ''
          }
        }
      })
    });
    schemaGraph.on('node:mouseleave', e => {
      schemaGraph.updateItem(e.item, {
        style: {
          label: {
            value: e.item.getModel?.()?.ellipsedLabel || ''
          }
        }
      })
    });
  }, []);

  // patternInfo.data 传入的值变化时，使用该数据
  useEffect(() => {
    const data = patternInfo?.data || emptyData;
    setGraphData({
      nodes: formatDataModels('node', data.nodes, config),
      edges: GraphinUtils.processEdges(formatDataModels('edge', data.edges, config, schemaEdgeMap)),
    });
  }, [patternInfo?.data]);


  useEffect(() => {
    const data = visible && patternInfo?.data || emptyData
    setGraphData({
      nodes: formatDataModels('node', data.nodes, config),
      edges: GraphinUtils.processEdges(formatDataModels('edge', data.edges, config, schemaEdgeMap)),
    });
  }, [visible])


  const closeEditor = () => {
    setVisible(false);
  }

  const onSave = () => {
    const saveData = (graphRef?.current as any).graph.save();
    
    //  若当前模式为空，则无法保存
    if (!saveData?.nodes?.length) {
      message.info(formatMessage({ id: 'save-failed-not-empty' }));
      return;
    }
    //  验证当前模式中每个节点和边有类型
    const emptyNodes = saveData.nodes.filter(node => !node.nodeType);
    if (emptyNodes?.length) {
      message.info(formatMessage({ id: 'save-failed-no-empty-type' }));
      return;
    }
    const emptyEdges = saveData.edges.filter(edge => !edge.edgeType);
    if (emptyEdges?.length) {
      message.info(formatMessage({ id: 'save-failed-no-empty-type' }));
      return;
    }

    // 验证当前模式图是连通的
    const traversedTag = {};
    breadthFirstSearch(saveData, saveData.nodes[0].id, {
      enter: ({ current }) => {
        traversedTag[current] = true;
      }
    }, false);
    if (Object.keys(traversedTag).length < saveData.nodes.length) {
      message.info(formatMessage({ id: 'save-failed-must-connected' }));
      return;
    }

    savePattern(patternInfo?.id, saveData);
    closeEditor();
  }

  const updateItem = (
    type: 'node' | 'edge',
    updateConfig: {
      id: string,
      nodeType?: string,
      edgeType?: string,
      rules?: string[]
    },
    oldGraphData: GraphinData
  ): {
    newGraphData: GraphinData,
    oldDataItem,
    newItem,
    hasRelated: boolean
  } => {
    const oldDataItem = (oldGraphData[`${type}s`] as any).find(item => item.id === updateConfig.id);
    // 在编辑图上没有找到相应 item
    if (!oldDataItem) {
      return {} as any;
    }

    const name = updateConfig?.[`${type}Type`] || oldDataItem[`${type}Type`]
    let edgeSchema: IEdgeSchema = {} as any;
    let newItem;
    let hasRelated = false;
    const newData: any = deepmerge(oldDataItem, updateConfig);
    if (name) {
      newData.virtual = false;
      const schemaMap = type === 'node' ? schemaNodeMap : schemaEdgeMap;
      edgeSchema = schemaMap[name] as IEdgeSchema;
    }
    
    const transData: GraphinData = { nodes: [], edges: [] };
    if (type === 'node') {
      transData.nodes = [newData];
    } else {
      if (edgeSchema) {
        newData.edgeType = edgeSchema.edgeType;
        newData.style = {
          ...newData.style,
          label: {
            value: edgeSchema.edgeType
          }
        };
        newData.label = edgeSchema.edgeType;
      }
      newData.type = 'graphin-line';
      transData.nodes = oldGraphData.nodes;
      transData.edges = [newData];
    }
    let { nodes, edges } = deepClone(transData);
    nodes = formatDataModels('node', nodes, config);
    edges = formatDataModels('edge', edges, config, schemaEdgeMap);

    let newGraphData: GraphinData = { nodes: [], edges: [] };
    if (type === 'node') {
      newItem = nodes[0];
      newGraphData = {
        nodes: [],
        edges: oldGraphData.edges
      };

      if (name !== oldDataItem.nodeType) {
        // 更新 label
        currentNodeIdx += 1;
        newItem.style = {
          ...newItem.style,
          label: {
            value: `${name}-n${currentNodeIdx}`
          }
        };
        // 更新相关边的 sourceNodeType 和 targetNodeType
        newGraphData.edges.forEach((edge, i) => {
          if (edge.source === newItem.id || edge.target === newItem.id) {
            hasRelated = true;
            const newEdgeData = {
              id: edge.id,
              source: edge.source,
              target: edge.target,
              virtual: true,
              type: 'graphin-line',
              sourceNodeType: edge.source === newItem.id ? name : edge.sourceNodeType,
              targetNodeType: edge.target === newItem.id ? name : edge.targetNodeType,
            }
    
            const processedEdges = formatDataModels('edge', [newEdgeData], config, schemaEdgeMap);
            newGraphData.edges.splice(i, 1, processedEdges[0]);
          }
        });
      }
    } else {
      newItem = edges[0];
      newGraphData = {
        nodes: oldGraphData.nodes,
        edges: []
      }
    }
    newItem.rules = updateConfig.rules || newItem.rules;
    oldGraphData[`${type}s`].forEach(item => {
      newGraphData[`${type}s`].push(item.id === updateConfig.id ? newItem : item);
    });

    return { newGraphData, oldDataItem, newItem, hasRelated }
  }

  const saveItem = (type, updateConfig) => {
    setGraphData(oldGraphData => {
      let newGraphData, newItem, hasRelated;
      let oldDataItem = oldGraphData[`${type}s`].find(item => item.id === updateConfig.id);
      // 在编辑图上没有找到相应 item
      if (!oldDataItem) return oldGraphData
      
      if (type === 'node') {
        if (oldDataItem.nodeType !== updateConfig.nodeType) {
          ({ newGraphData, oldDataItem, newItem, hasRelated } = updateItem(type, updateConfig, oldGraphData));
          // 如果保存的是节点的 name，更新相关边的 sourceNodeType 或 targetNodeType，并删去该边的类型和设置为 virtual
          // 有被修改的相关边，需要重新处理一遍
          if (hasRelated) {
            newGraphData.edges = formatDataModels('edge', newGraphData.edges, config, schemaEdgeMap);
          }
        } else {
          newGraphData = {
            nodes: [{
              ...oldDataItem,
              ...updateConfig
            }]
          }
        }
      } else if (type === 'edge') {
        newGraphData = {
          nodes: oldGraphData.nodes,
          edges: GraphinUtils.processEdges(oldGraphData.edges),
        }
        // 如果传过来 sourceNodeType targetNodeType 代表原本的起点终点没有类型，此时同时设置起点和终点的类型
        if (updateConfig.sourceNodeType) {
          newGraphData = updateItem('node',
            {
              id: oldDataItem.source,
              nodeType: updateConfig.sourceNodeType
            },
            newGraphData).newGraphData;
        }
        if (updateConfig.targetNodeType) {
          newGraphData = updateItem('node',
            {
              id: oldDataItem.target,
              nodeType: updateConfig.targetNodeType
            },
            newGraphData).newGraphData;
        }

        // 更新该边
        ({ newGraphData, oldDataItem, newItem } = updateItem(type, updateConfig, newGraphData));
        // 如果保存的是边，挂载起点类型和终点类型
        newItem.sourceNodeType = updateConfig.sourceNodeType || oldDataItem.sourceNodeType;
        newItem.targetNodeType = updateConfig.targetNodeType || oldDataItem.targetNodeType;
        newGraphData.edges = GraphinUtils.processEdges(formatDataModels('edge', newGraphData.edges, config, schemaEdgeMap));
      }
      return newGraphData || oldGraphData;
    });
  }

  const onContextMenuClick = key => {
    const model = contextMenu.item?.getModel();
    const graph = (graphRef?.current as any)?.graph;
    if (!graph || graph.destroyed || !model) {
      return;
    }
    switch (key) {
      case 'removeNode': {
        // 寻找通过多选选中的节点
        const selectedNodeIds = graph.findAllByState('node', ITEM_STATE.Selected)?.map(node => node.getID());
        // 若没有选中的节点，代表仅对当前菜单操作的节点进行删除
        if (!selectedNodeIds?.length) {
          selectedNodeIds.push(model.id);
        }
        setGraphData(oldGraphData => {
          const newData = {
            nodes: oldGraphData.nodes.filter(node => !selectedNodeIds.includes(node.id)),
            edges: GraphinUtils.processEdges(oldGraphData.edges.filter(edge => !selectedNodeIds.includes(edge.target) && !selectedNodeIds.includes(edge.source))),
          };
          return newData;
        });
        setEditItem({} as ItemBriefInfo);
        break;
      } case 'removeEdge': {
        // 寻找通过多选选中的边
        const selectedEdgeIds = graph.findAllByState('edge', ITEM_STATE.Selected)?.map(edge => edge.getID());
        // 若没有选中的边，代表仅对当前菜单操作的边进行删除
        if (!selectedEdgeIds?.length) {
          selectedEdgeIds.push(model.id);
        }
        setGraphData(oldGraphData => {
          const newData = {
            nodes: oldGraphData.nodes,
            edges: GraphinUtils.processEdges(oldGraphData.edges.filter(edge => !selectedEdgeIds.includes(edge.id))),
          };
          return newData;
        });
        setEditItem({} as ItemBriefInfo);
        break;
      } default:
        break;
    }
    setContextMenu(oldMenu => ({
      ...oldMenu,
      visible: false
    }));
  }

  const createEdge = ({ source, target }) => {
    let sourceType, targetType;
    graphData.nodes.forEach(node => {
      if (node.id === source) {
        sourceType = node.nodeType;
        return;
      }
      if (node.id === target) {
        targetType = node.nodeType;
      }
    })

    let hasRelatedEdges = false;
    if (!sourceType || !targetType) {
      hasRelatedEdges = true;
    } else {
      Object.keys(edgeProperties).forEach(key => {
        const [sourceNodeType, typeName, targetNodeType] = key.split(SPLITOR) || [];
        // 筛选出与选定的节点类型相关的边类型
        if (sourceNodeType !== sourceType || targetNodeType !== targetType) {
          return;
        }
        hasRelatedEdges = true;
      });
    }

    // 起点和终点的节点类型之间不存在边，不可创建
    if (!hasRelatedEdges) {
      message.info(formatMessage({ id: 'create-edge-failed-no-edge-type', sourceType, targetType }));
      return;
    }

    const id = `${source}-${target}-${uniqueId()}`;
    const newEdge = {
      id,
      source,
      target,
      type: 'graphin-line',
    };

    setEditItem({
      type: 'edge',
      id: id,
    });
    setTimeout(() => {
      setEditData(newEdge as any);
    }, 0);

    setGraphData(oldData => {
      const newEdges = [...oldData.edges];
      newEdges.push(newEdge);
      return {
        nodes: oldData.nodes,
        edges: GraphinUtils.processEdges(newEdges),
      }
    });
  }

  const processTemplateData = data => {
    const newData: GraphinData = {
      nodes: [],
      edges: []
    };
    const nodeMap = {};
    data.nodes.forEach(node => {
      const newNode = {
        ...node,
        id: `${node.id}${createUuid()}`,
        virtual: true
      };
      nodeMap[node.id] = newNode;
      newData.nodes.push(newNode);
    });
    data.edges.forEach(edge => {
      newData.edges.push({
        ...edge,
        id: edge.id ? `${edge.id}${createUuid()}` : createUuid(),
        type: 'graphin-line',
        source: nodeMap[edge.source].id,
        target: nodeMap[edge.target].id,
        colorType: '#959595',
        virtual: true,
        name: ''
      });
    });
    
    // let transformedData = transformOrigin(
    //   newData,
    //   locale,
    //   schemaEdgeLocale,
    //   false,
    //   'BaseNode',
    //   false,
    //   nodeTypeIdMap,
    // );
    // const graph = (graphRef?.current as any)?.graph;
    // transformedData = transform(
    //   cloneDeep(transformedData),
    //   graph || null,
    //   {},
    //   false,
    // );
    return newData;
  }

  const addTemplate = template => {
    const newData = processTemplateData(template.data);
    setGraphData(oldGraphData =>({
      nodes: oldGraphData.nodes.concat(newData.nodes),
      edges: GraphinUtils.processEdges(oldGraphData.edges.concat(newData.edges))
    }));
  }

  useEffect(() => {
    if (editItem?.type) {
      const data = graphData?.[`${editItem?.type}s`]?.find(item => item.id === editItem?.id);
      setEditData(data);
    } else {
      setEditData(undefined);
    }
  }, [editItem]);

  const onSearch = value => {
    clearSchemaNodeStates();
    const lowerCaseValue = value.toLowerCase();
    const nodeData = schemaNodes.find(node =>
      node.nodeType === value ||
      node.nodeType.toLowerCase() === lowerCaseValue
    );
    if (nodeData) {
      const schemaGraph = (schemaGraphRef?.current as any)?.graph;
      if (!schemaGraph || schemaGraph.destroyed) {
        return;
      }
      const nodeItem = schemaGraph.findById(nodeData.id);
      if (nodeItem) {
        focusNodeY(schemaGraph, nodeItem, schemaGraph.get('height'), 50);
        schemaGraph.setItemState(nodeItem, ITEM_STATE.Active, true);
      }
    }
  }

  return (<Layout
      className="kg-pattern-match-editor-container"
      style={{display: visible ? 'block' : 'none'}}
    >
      <Header className="kg-pattern-match-editor-header">
        <Row>
          <Col span={4} onClick={closeEditor}>
            <ArrowLeftOutlined className="kg-pattern-match-editor-back" />
            <span className="kg-pattern-match-editor-title">{patternInfo?.title}</span>
          </Col>
          <Col span={4} offset={16}>
            <Button onClick={closeEditor}><FormattedMessage id="cancel" /></Button>
            <Button className="kg-pattern-match-editor-save" type="primary" onClick={onSave}><FormattedMessage id="save" /></Button>
          </Col>
        </Row>
      </Header>
      <Divider className="kg-pattern-match-editor-divider"/>
      <Layout className="kg-pattern-match-editor-content">
        <Sider
          className="kg-pattern-match-editor-left-sider"
          width={240}
        >
          <Tabs
            className="kg-pattern-match-editor-adder"
            defaultActiveKey="node"
            activeKey={activePanel}
            onChange={key => setActivePanel(key)}
          >
            <TabPane tab={<FormattedMessage id="add-node" />} key="node">
              <Search placeholder={formatMessage({ id: "input-name-search-node" })} onSearch={onSearch} style={{ width: 200 }} />
              <div className="kg-pattern-match-schema-graph-wrapper">
                <Graphin
                  data={{
                    nodes: schemaNodes,
                    edges: []
                  }}
                  ref={schemaGraphRef as any}
                  layout={{
                    type: 'grid',
                    cols: 3,
                    width: 200,
                    nodeSize: 50
                  }}
                  animate={false}
                  modes={{
                    default: [{
                      type: 'scroll-canvas',
                      direction: 'y',
                      scalableRange: -0.99
                    }]
                  }}
                >
                  <ClickSelect disabled />
                  <ZoomCanvas disabled />
                  <DragCanvas disabled />
                  <LassoSelect disabled />
                  <DragNode disabled />
                  <DragCombo disabled />
                </Graphin>
              </div>
            </TabPane>
            <TabPane tab={<FormattedMessage id="add-template" />} key="template" style={{ height: '100%' }}>
              <div className="kg-pattern-match-template-wrapper">
                {templates.map(template => (
                  <div
                    className="kg-pattern-match-template"
                    key={template.id}
                    onClick={() => addTemplate(template)}
                    style={{
                      backgroundImage: `url("${template.screenshot}")`,
                      backgroundSize: '100%'
                    }}
                  />
                ))}
              </div>
            </TabPane>
          </Tabs>
        </Sider>
        <Content>
          <Graphin
            data={graphData}
            ref={graphRef as any}
            layout={{
              type: 'dagre',
              rankdir: 'lr'
            }}
            animate={false}
            minZoom={0.1}
            modes={{
              default: [ 'kg-drag-node', 'kg-zoom-canvas', 'kg-click', 'kg-hover'],
              edit: ['kg-drag-canvas', 'kg-zoom-canvas', 'kg-drag-node', 'kg-link-edge'],
            }}
          >
            <ClickSelect disabled />
            <ZoomCanvas disabled />
            <DragCanvas />
            <LassoSelect />
            <DragNode disabled />
            <DragCombo disabled />
            <div
              className='graph-contextmenu-content'
              style={{
                width: '80px',
                visibility: contextMenu.visible ? 'visible' : 'hidden',
                position: 'absolute',
                top: `${contextMenu.y}px`,
                left: `${contextMenu.x}px`
              }}
              ref={menuRef} 
            >
             {contextMenu.type === 'node' ? <Menu>
                <Menu.Item key='removeNode' onClick={() => onContextMenuClick('removeNode')}><FormattedMessage id="delete-node" /></Menu.Item>
                <Menu.Item key='addRelation' onClick={() => onContextMenuClick('addRelation')}>
                  <AddRelation
                    graph={(graphRef?.current as any)?.graph}
                    currentItem={contextMenu.item}
                    options={{
                      onOk: createEdge
                    }}
                    name={<FormattedMessage id="contextmenu-add-relation" />}
                  />
                </Menu.Item>
              </Menu> : <Menu>
                <Menu.Item key='removeEdge' onClick={() => onContextMenuClick('removeEdge')}><FormattedMessage id="delete-relation" /></Menu.Item>
              </Menu>} 
            </div>
          </Graphin>
        </Content>
      </Layout>
      <EditDrawer
        {...editItem}
        itemData={editData}
        visible={!!editItem?.type}
        nodeProperties={nodeProperties}
        edgeProperties={edgeProperties}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        saveItem={saveItem}
        onClose={() => { setEditItem({} as ItemBriefInfo) }}
      />
    </Layout>
  );
};

export default PatternEditor;
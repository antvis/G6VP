import { CaretRightOutlined } from '@ant-design/icons';
import { findShortestPath } from '@antv/algorithm';
import { NodeSelectionWrap, getNodeSelectionLabel } from '@antv/gi-common-components';
import type { NodeFormatProps } from '@antv/gi-common-components';
import { useContext } from '@antv/gi-sdk';
import { Button, Col, Collapse, Empty, Form, InputNumber, Row, Space, Switch, Timeline, message } from 'antd';
import { enableMapSet } from 'immer';
import React, { memo, useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import $i18n from '../../i18n';
import PanelExtra from './PanelExtra';
import SegmentFilter from './SegmentFilter';
import './index.less';
import { IHighlightElement, IState } from './typing';
import { getPathByWeight } from './utils';

const { Panel } = Collapse;

export interface IPathAnalysisProps extends NodeFormatProps {
  hasDirection: boolean;
  hasMaxDeep: boolean;
  nodeSelectionMode: string[];
  pathNodeLabel: string;
  controlledValues?: {
    source: string;
    target: string;
    direction: string;
  };
  onOpen: () => void;
  filter?: (node: any) => boolean;
}

enableMapSet();

const PathAnalysis: React.FC<IPathAnalysisProps> = props => {
  const {
    nodeSelectionMode,
    pathNodeLabel,
    controlledValues,
    onOpen = () => {},
    hasMaxDeep,
    hasDirection,
    labelFormat,
    filter,
  } = props;
  const { data: graphData, graph, sourceDataMap, updateHistory } = useContext();

  const [state, updateState] = useImmer<IState>({
    allNodePath: [],
    allEdgePath: [],
    nodePath: [],
    edgePath: [],
    highlightPath: new Set<number>(),
    isAnalysis: false,
    filterRule: {
      type: 'All-Path',
    },
    selecting: '',
  });

  // 缓存被高亮的节点和边
  const highlightElementRef = useRef<IHighlightElement>({
    nodes: new Set(),
    edges: new Set(),
  });

  const [form] = Form.useForm();

  const handleResetForm = () => {
    form.resetFields();
    updateState(draft => {
      draft.allNodePath = [];
      draft.allEdgePath = [];
      draft.nodePath = [];
      draft.edgePath = [];
      draft.highlightPath = new Set();
      draft.isAnalysis = false;
      draft.filterRule = {
        type: 'All-Path',
      };
      draft.selecting = '';
    });
    cancelHighlight();
  };

  const handleSearch = () => {
    form.validateFields().then(values => {
      cancelHighlight();
      const { source, target, direction = false } = values;
      const history = {
        componentId: 'PathAnalysis',
        type: 'analyse',
        subType: $i18n.get({ id: 'basic.components.PathAnalysis.Component.Path', dm: '路径' }),
        statement: $i18n.get(
          {
            id: 'basic.components.PathAnalysis.Component.StartPointSourceEndPoint',
            dm: '起点: {source}, 终点: {target}',
          },
          { source: source, target: target },
        ),
        params: {
          source,
          target,
          direction: String(direction),
        },
      };
      try {
        const { allPath: allNodePath, allEdgePath }: any = findShortestPath(graphData, source, target, direction);
        if (!allNodePath?.length) {
          let info = $i18n.get({
            id: 'basic.components.PathAnalysis.Component.NoPathThatMeetsThe',
            dm: '无符合条件的路径',
          });
          if (direction) {
            info = $i18n.get(
              {
                id: 'basic.components.PathAnalysis.Component.InfoYouCanTryTo',
                dm: '{info}，可尝试将“是否有向”设置为“无向”，或改变起点与终点',
              },
              { info: info },
            );
          } else {
            info = $i18n.get(
              {
                id: 'basic.components.PathAnalysis.Component.InfoYouCanTryTo.1',
                dm: '{info}，可尝试改变起点与终点',
              },
              { info: info },
            );
          }
          message.info(info);
          updateHistory({
            ...history,
            success: false,
            errorMsg: info,
          });
          return;
        }
        const highlightPath = new Set<number>(allNodePath.map((_, index) => index));

        updateState(draft => {
          draft.allNodePath = allNodePath;
          draft.allEdgePath = allEdgePath;
          draft.nodePath = allNodePath;
          draft.edgePath = allEdgePath;
          draft.isAnalysis = true;
          draft.highlightPath = highlightPath;
          draft.filterRule = {
            type: 'All-Path',
          };
          draft.selecting = '';
        });
        // 更新到历史记录
        updateHistory({
          ...history,
          success: true,
        });
      } catch (error) {
        updateHistory({ ...history, success: false, errorMsg: error });
      }
    });
  };

  const onSwitchChange = (pathId: number) => {
    updateState(draft => {
      if (draft.highlightPath.has(pathId)) {
        draft.highlightPath.delete(pathId);
      } else {
        draft.highlightPath.add(pathId);
      }
    });
  };

  // 取消所有节点和边的高亮状态
  const cancelHighlight = () => {
    [...highlightElementRef.current?.nodes].forEach(nodeId => {
      graph.findById(nodeId) && graph.setItemState(nodeId, 'active', false);
    });
    [...highlightElementRef.current.edges].forEach(edgeId => {
      // graph.findById(edgeId) && graph.setItemState(edgeId, 'active', false);
      if (graph.findById(edgeId)) {
        graph.setItemState(edgeId, 'active', false);
        graph.updateItem(edgeId, {
          style: {
            animate: {
              visible: false,
              type: 'circle-running',
              color: 'red',
              repeat: true,
              duration: 1000,
            },
          },
        });
      }
    });
  };

  useEffect(() => {
    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];

      if (!state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          graph.findById(nodeId) && graph.setItemState(nodeId, 'active', false);
          highlightElementRef.current?.nodes.delete(nodeId);
        });

        edges.forEach(edgeId => {
          graph.findById(edgeId) && graph.setItemState(edgeId, 'active', false);
          highlightElementRef.current?.edges.delete(edgeId);
        });
      }
    }

    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];
      if (state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          graph.findById(nodeId) && graph.setItemState(nodeId, 'active', true);
          highlightElementRef.current?.nodes.add(nodeId);
        });
        edges.forEach(edgeId => {
          // graph.findById(edgeId) && graph.setItemState(edgeId, 'active', true);
          if (graph.findById(edgeId)) {
            graph.setItemState(edgeId, 'active', true);
            graph.updateItem(edgeId, {
              style: {
                animate: {
                  visible: true,
                  type: 'circle-running',
                  color: 'red',
                  repeat: true,
                  duration: 1000,
                },
              },
            });
          }
          highlightElementRef.current?.edges.add(edgeId);
        });
      }
    }
  }, [state.highlightPath]);

  // 过滤逻辑副作用
  useEffect(() => {
    cancelHighlight();
    highlightElementRef.current = { nodes: new Set(), edges: new Set() };

    let nodePath: string[][] = [];
    let edgePath: string[][] = [];
    if (state.filterRule.type === 'Shortest-Path') {
      const pathLenMap = {};
      let minLen = Infinity;
      state.allEdgePath.forEach((path, pathId) => {
        const len = state.filterRule.weightPropertyName
          ? getPathByWeight(path, state.filterRule.weightPropertyName, sourceDataMap)
          : path.length;
        minLen = Math.min(minLen, len);
        pathLenMap[pathId] = len;
      });

      nodePath = state.allNodePath.filter((_, pathId) => pathLenMap[pathId] === minLen);
      edgePath = state.allEdgePath.filter((_, pathId) => pathLenMap[pathId] === minLen);
    } else if (state.filterRule.type === 'Edge-Type-Filter' && state.filterRule.edgeType) {
      const validPathId = new Set();
      state.allEdgePath.forEach((path, pathId) => {
        const isMatch = path.every(edgeId => {
          const edgeConfig = sourceDataMap.edges[edgeId];
          return edgeConfig?.edgeType === state.filterRule.edgeType;
        });
        if (isMatch) {
          validPathId.add(pathId);
        }
      });
      nodePath = state.allNodePath.filter((_, pathId) => validPathId.has(pathId));
      edgePath = state.allEdgePath.filter((_, pathId) => validPathId.has(pathId));
    } else {
      nodePath = state.allNodePath;
      edgePath = state.allEdgePath;
    }

    updateState(draft => {
      draft.nodePath = nodePath;
      draft.edgePath = edgePath;
      draft.highlightPath = new Set(nodePath.map((_, index) => index));
    });
  }, [state.allNodePath, state.allEdgePath, state.filterRule]);

  useEffect(() => {
    handleResetForm();
  }, [graphData]);

  /**
   * 外部控制参数变化，进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { source, target, direction } = controlledValues;
      onOpen();
      form.setFieldsValue({
        source,
        target,
        direction: direction !== 'false',
      });
      handleSearch();
    }
  }, [controlledValues]);

  const items = [
    { name: 'source', label: $i18n.get({ id: 'basic.components.PathAnalysis.Component.StartNode', dm: '起始节点' }) },
    {
      name: 'target',
      label: $i18n.get({ id: 'basic.components.PathAnalysis.Component.TargetNode', dm: '目标节点' }),
    },
  ];

  return (
    <div className="gi-path-analysis">
      <div className="gi-path-analysis-container">
        <div className="gi-path-analysis-title">
          {$i18n.get({ id: 'basic.components.PathAnalysis.Component.PathConfiguration', dm: '路径配置' })}
        </div>
        <Form form={form}>
          <NodeSelectionWrap
            // @ts-ignore 
            graph={graph}
            form={form}
            items={items}
            filter={filter}
            data={graphData.nodes}
            labelFormat={labelFormat}
            nodeLabel={pathNodeLabel}
            nodeSelectionMode={nodeSelectionMode}
          />

          {hasDirection && (
            <Form.Item
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
              name="direction"
              label={$i18n.get({ id: 'basic.components.PathAnalysis.Component.IsThereAnyDirection', dm: '是否有向' })}
            >
              <Switch
                checkedChildren={$i18n.get({ id: 'basic.components.PathAnalysis.Component.Directed', dm: '有向' })}
                unCheckedChildren={$i18n.get({ id: 'basic.components.PathAnalysis.Component.Undirected', dm: '无向' })}
                defaultChecked
              />
            </Form.Item>
          )}

          {hasMaxDeep && (
            <Form.Item
              name="maxdeep"
              label={$i18n.get({ id: 'basic.components.PathAnalysis.Component.MaximumDepth', dm: '最大深度' })}
              wrapperCol={{ span: 24 }}
              labelCol={{ span: 24 }}
            >
              <InputNumber min={1} style={{ width: '100%' }} />
            </Form.Item>
          )}

          <Form.Item>
            <Row>
              <Col span={18}>
                <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
                  {$i18n.get({ id: 'basic.components.PathAnalysis.Component.QueryPath', dm: '查询路径' })}
                </Button>
              </Col>
              <Col span={6} style={{ textAlign: 'right' }}>
                <Space size={'small'}>
                  <Button onClick={handleResetForm}>
                    {$i18n.get({ id: 'basic.components.PathAnalysis.Component.Reset', dm: '重置' })}
                  </Button>
                </Space>
              </Col>
            </Row>
          </Form.Item>
        </Form>
      </div>

      {state.nodePath.length > 0 && (
        <div className="gi-path-analysis-container">
          <div className="gi-path-analysis-title">
            <div>{$i18n.get({ id: 'basic.components.PathAnalysis.Component.QueryResults', dm: '查询结果' })}</div>
            <SegmentFilter />
          </div>
          <Collapse
            defaultActiveKey={0}
            ghost={true}
            className="gi-collapse-container"
            expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} />}
          >
            {state.nodePath.map((path, index) => {
              return (
                <Panel
                  key={index}
                  header={$i18n.get(
                    { id: 'basic.components.PathAnalysis.Component.PathNumber', dm: `路径 ${index + 1}` },
                    { number: index + 1 },
                  )}
                  extra={
                    <PanelExtra pathId={index} highlightPath={state.highlightPath} onSwitchChange={onSwitchChange} />
                  }
                >
                  <Timeline>
                    {path.map(nodeId => {
                      const nodeConfig = sourceDataMap.nodes[nodeId];
                      const data = nodeConfig?.data || {};
                      return (
                        <Timeline.Item>
                          {getNodeSelectionLabel(data, { nodeLabel: pathNodeLabel, labelFormat }).ele || nodeId}
                        </Timeline.Item>
                      );
                    })}
                  </Timeline>
                </Panel>
              );
            })}
          </Collapse>
        </div>
      )}

      {state.isAnalysis && state.nodePath.length === 0 && <Empty />}
    </div>
  );
};

export default memo(PathAnalysis);

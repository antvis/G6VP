import { CaretRightOutlined, DeleteOutlined, FormOutlined } from '@ant-design/icons';
import { useContext, utils } from '@antv/gi-sdk';
import { Button, Col, Collapse, Empty, Form, Row, Select, Space, Switch, Timeline } from 'antd';
import { enableMapSet } from 'immer';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import FilterRule from './FilterRule';
import './index.less';
import PanelExtra from './PanelExtra';
import { IHighlightElement, IState } from './typing';
import { getPathByWeight } from './utils';

const { findAllPath } = utils;

const { Panel } = Collapse;

export interface IPathAnalysisProps {
  pathNodeLabel: string;
}

enableMapSet();

const PathAnalysis: React.FC<IPathAnalysisProps> = props => {
  const { pathNodeLabel } = props;
  const { data: graphData, graph, sourceDataMap } = useContext();
  //console.log(graphData, '@graphData')
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
  let nodeClickListener = e => {};

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
      const { source, target, direction = true } = values;
      const { allNodePath, allEdgePath } = findAllPath(graphData, source, target, direction);
      const highlightPath = new Set(allNodePath.map((_, index) => index));
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
              color: 'rgba(236,65,198,1)',
              repeat: true,
              duration: 1000,
            },
          },
        });
      }
    });
  };

  const beginSelect = type => {
    updateState(draft => {
      draft.selecting = type;
    });
    graph.off('node:click', nodeClickListener);

    nodeClickListener = e => {
      updateState(draft => {
        draft.selecting = '';
      });
      const { item } = e;
      if (!item || item.destroyed) return;
      form.setFieldsValue({ [type]: item.getID() });
    };
    graph.once('node:click', nodeClickListener);
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
                  color: 'rgba(236,65,198,1)',
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

  return (
    <div className="gi-path-analysis">
      {/* <h2 className="gi-path-analysis-title">路径分析</h2> */}
      <Form form={form}>
        <Row justify="space-between">
          <Col span={22}>
            <Form.Item label="起始节点" name="source" rules={[{ required: true, message: '请填写起点节点ID' }]}>
              <Select
                showSearch
                optionFilterProp="children"
                onChange={() => {
                  updateState(draft => {
                    draft.selecting = '';
                  });
                }}
              >
                {graphData.nodes.map(node => (
                  <Select.Option key={node.id} value={node.id}>
                    {node.id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2} style={{ lineHeight: '32px', textAlign: 'right' }}>
            <FormOutlined
              style={{ cursor: 'pointer', color: state.selecting === 'source' ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }}
              onClick={() => beginSelect('source')}
            />
          </Col>
        </Row>
        <Row justify="space-between">
          <Col span={22}>
            <Form.Item label="目标节点" name="target" rules={[{ required: true, message: '请填写终点节点ID' }]}>
              <Select
                showSearch
                optionFilterProp="children"
                onChange={() => {
                  updateState(draft => {
                    draft.selecting = '';
                  });
                }}
              >
                {graphData.nodes.map(node => (
                  <Select.Option key={node.id} value={node.id}>
                    {node.id}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
          <Col span={2} style={{ lineHeight: '32px', textAlign: 'right' }}>
            <FormOutlined
              style={{ cursor: 'pointer', color: state.selecting === 'target' ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }}
              onClick={() => beginSelect('target')}
            />
          </Col>
        </Row>
        <Form.Item name="direction" label="是否有向">
          <Switch checkedChildren="有向" unCheckedChildren="无向" defaultChecked />
        </Form.Item>
        <Form.Item>
          <Row>
            <Col span={16}>
              <Button type="primary" onClick={handleSearch} style={{ width: '100%' }}>
                查询路径
              </Button>
            </Col>
            <Col offset="2" span={6} style={{ textAlign: 'right' }}>
              <Space size={'small'}>
                {state.isAnalysis && state.allNodePath.length > 0 && (
                  <FilterRule state={state} updateState={updateState} />
                )}
                <Button danger onClick={handleResetForm} icon={<DeleteOutlined />}></Button>
              </Space>
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <div className="gi-path-analysis-path-list-container">
        {state.nodePath.length > 0 && (
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
                  header={`路径${index + 1}`}
                  extra={
                    <PanelExtra pathId={index} highlightPath={state.highlightPath} onSwitchChange={onSwitchChange} />
                  }
                >
                  <Timeline>
                    {path.map(nodeId => {
                      const nodeConfig = sourceDataMap.nodes[nodeId];
                      const data = nodeConfig?.data || {};
                      return <Timeline.Item>{data[pathNodeLabel] || nodeId}</Timeline.Item>;
                    })}
                  </Timeline>
                </Panel>
              );
            })}
          </Collapse>
        )}
        {state.isAnalysis && state.nodePath.length === 0 && <Empty />}
      </div>
    </div>
  );
};

export default PathAnalysis;

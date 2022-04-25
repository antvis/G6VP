import { useContext } from '@alipay/graphinsight';
import { CaretRightOutlined, DeleteOutlined } from '@ant-design/icons';
import { Button, Col, Collapse, Empty, Form, Row, Select, Space, Timeline } from 'antd';
import { enableMapSet } from 'immer';
import React, { useEffect, useRef } from 'react';
import { useImmer } from 'use-immer';
import FilterRule from './FilterRule';
import './index.less';
import PanelExtra from './PanelExtra';
import { IHighlightElement, IState } from './typing';
import { findAllPath, getPathByWeight } from './utils';

const { Panel } = Collapse;

export interface IPathAnalysisProps {
  pathNodeLabel: string;
}

enableMapSet();

const PathAnalysis: React.FC<IPathAnalysisProps> = props => {
  const { pathNodeLabel } = props;
  const { data: graphData, graph, sourceDataMap } = useContext();
  const [state, updateState] = useImmer<IState>({
    allNodePath: [],
    allEdgePath: [],
    nodePath: [],
    edgePath: [],
    pathStatusMap: {},
    highlightPath: new Set<number>(),
    isAnalysis: false,
    filterRule: {
      type: 'All-Path',
    },
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
      draft.nodePath = [];
      draft.edgePath = [];
      draft.pathStatusMap = {};
      draft.highlightPath = new Set();
      draft.isAnalysis = false;
    });
    cancelHighlight();
  };

  const handleSearch = () => {
    form.validateFields().then(values => {
      cancelHighlight();
      const { source, target } = values;
      const { allNodePath, allEdgePath } = findAllPath(graphData, source, target, true);
      const highlightPath = new Set(allNodePath.map((_, index) => index));
      updateState(draft => {
        draft.allNodePath = allNodePath;
        draft.allEdgePath = allEdgePath;
        draft.nodePath = allNodePath;
        draft.edgePath = allEdgePath;
        draft.isAnalysis = true;
        draft.highlightPath = highlightPath;
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
      graph.setItemState(nodeId, 'active', false);
    });
    [...highlightElementRef.current.edges].forEach(edgeId => {
      graph.setItemState(edgeId, 'active', false);
    });
  };

  useEffect(() => {
    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];

      if (!state.highlightPath.has(i)) {
        state.pathStatusMap[i] &&
          nodes.forEach(nodeId => {
            graph.setItemState(nodeId, 'active', false);
            highlightElementRef.current?.nodes.delete(nodeId);
          });

        state.pathStatusMap[i] &&
          edges.forEach(edgeId => {
            graph.setItemState(edgeId, 'active', false);
            highlightElementRef.current?.edges.delete(edgeId);
          });

        updateState(draft => {
          draft.pathStatusMap[i] = false;
        });
      }
    }

    for (let i = 0; i < state.nodePath.length; i++) {
      const nodes = state.nodePath[i];
      const edges = state.edgePath[i];
      if (state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          graph.setItemState(nodeId, 'active', true);
          highlightElementRef.current?.nodes.add(nodeId);
        });
        edges.forEach(edgeId => {
          graph.setItemState(edgeId, 'active', true);
          highlightElementRef.current?.edges.add(edgeId);
        });
        updateState(draft => {
          draft.pathStatusMap[i] = true;
        });
      }
    }
  }, [state.highlightPath, state.pathStatusMap]);

  // 过滤逻辑副作用
  useEffect(() => {
    cancelHighlight();
    highlightElementRef.current = { nodes: new Set(), edges: new Set() };

    let nodePath: string[][] = [];
    let edgePath: string[][] = [];
    if (state.filterRule.type === 'All-Path') {
      nodePath = state.allNodePath;
      edgePath = state.allEdgePath;
    } else if (state.filterRule.type === 'Shortest-Path') {
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
    }

    updateState(draft => {
      draft.nodePath = nodePath;
      draft.edgePath = edgePath;
      draft.highlightPath = new Set(nodePath.map((_, index) => index));
      draft.pathStatusMap = {};
    });
  }, [state.allNodePath, state.allEdgePath, state.filterRule]);

  return (
    <div className="gi-path-analysis">
      {/* <h2 className="gi-path-analysis-title">路径分析</h2> */}
      <Form form={form}>
        <Form.Item label="起始节点" name="source" rules={[{ required: true, message: '请填写起点节点ID' }]}>
          <Select showSearch optionFilterProp="children">
            {graphData.nodes.map(node => (
              <Select.Option key={node.id} value={node.id}>
                {node.id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="目标节点" name="target" rules={[{ required: true, message: '请填写终点节点ID' }]}>
          <Select showSearch optionFilterProp="children">
            {graphData.nodes.map(node => (
              <Select.Option key={node.id} value={node.id}>
                {node.id}
              </Select.Option>
            ))}
          </Select>
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
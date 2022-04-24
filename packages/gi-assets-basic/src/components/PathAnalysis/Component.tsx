import React, { useEffect, useRef } from 'react';
import { useContext } from '@alipay/graphinsight';
import { Form, Select, Button, Timeline, Collapse, Empty, Row, Col } from 'antd';
import { useImmer } from 'use-immer';
import { enableMapSet } from 'immer';
import { IState, IHighlightElement } from './typing';
import { getEdgeIdMap, findAllPath, getPathByWeight } from './utils';
import './index.less';
import PanelExtra from './PanelExtra';
import FilterRule from './FilterRule';

const { Panel } = Collapse;

export interface IPathAnalysisProps {
  pathNodeLabel: string;
}

enableMapSet();

const PathAnalysis: React.FC<IPathAnalysisProps> = props => {
  const { pathNodeLabel } = props;
  const { data: graphData, graph, dataMap } = useContext();
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
      const { source, target } = values;
      const { allNodePath, allEdgePath } = findAllPath(graphData, source, target, true);
      updateState(draft => {
        draft.allNodePath = allNodePath;
        draft.allEdgePath = allEdgePath;
        draft.nodePath = allNodePath;
        draft.edgePath = allEdgePath;
        draft.isAnalysis = true;
      });
      cancelHighlight();
    });
  };

  const onSwitchChange = (pathId: number) => {
    updateState(draft => {
      draft.highlightPath.has(pathId) ? draft.highlightPath.delete(pathId) : draft.highlightPath.add(pathId);
    });
  };

  // 取消所有节点和边的高亮状态
  const cancelHighlight = () => {
    [...highlightElementRef.current?.nodes].forEach(nodeId => {
      const node = graph.findById(nodeId);
      node.setState('highlight', false);
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
            const node = graph.findById(nodeId);
            node.setState('highlight', false);
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
          const node = graph.findById(nodeId);
          node.setState('highlight', true);
          highlightElementRef.current?.nodes.add(nodeId);
        });
        edges.forEach(edgeId => {
          graph.setItemState(edgeId, 'active', true);
          highlightElementRef.current?.edges.add(edgeId);
          //const edge = graph.findById(edgeId);
          //edge.setState('highlight', true);
        });
        updateState(draft => {
          draft.pathStatusMap[i] = true;
        });
      }
    }
  }, [state.highlightPath, state.pathStatusMap]);

  useEffect(() => {
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
          ? getPathByWeight(path, state.filterRule.weightPropertyName, dataMap)
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
      draft.highlightPath = new Set();
      draft.pathStatusMap = {};
    });
    cancelHighlight();
  }, [state.allNodePath, state.allEdgePath, state.filterRule]);

  return (
    <div className="gi-path-analysis">
      <h2 className="gi-path-analysis-title">路径分析</h2>
      <Form form={form}>
        <Form.Item label="起点节点ID" name="source" rules={[{ required: true, message: '请填写起点节点ID' }]}>
          <Select showSearch optionFilterProp="children">
            {graphData.nodes.map(node => (
              <Select.Option key={node.id} value={node.id}>
                {node.id}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item label="终点节点ID" name="target" rules={[{ required: true, message: '请填写终点节点ID' }]}>
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
            <Col span={6}>
              <Button style={{ marginRight: 8 }} onClick={handleResetForm}>
                重置
              </Button>
            </Col>
            <Col span={6}>
              <Button type="primary" onClick={handleSearch}>
                查询
              </Button>
            </Col>
            <Col offset={5} span={6}>
              {state.isAnalysis && state.allNodePath.length > 0 && (
                <FilterRule state={state} updateState={updateState} />
              )}
            </Col>
          </Row>
        </Form.Item>
      </Form>
      <div className="gi-path-analysis-path-list-container">
        {state.nodePath.length > 0 && (
          <Collapse defaultActiveKey={0}>
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
                      const nodeConfig = dataMap.nodes[nodeId];
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

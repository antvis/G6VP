import React, { useEffect } from 'react';
import { useContext } from '@alipay/graphinsight';
import { Algorithm } from '@antv/g6';
import { GraphinData } from '@antv/graphin';
import { Form, Select, Button, Timeline, Collapse, Empty } from 'antd';
import { useImmer } from 'use-immer';
import { enableMapSet } from 'immer';
import { IState } from './typing';
import { getEdgeIdMap, findAllPath } from './utils';
import './index.less';
import PanelHeader from './PanelHeader';

const { Panel } = Collapse;

export interface IPathAnalysisProps {}

enableMapSet();

const PathAnalysis: React.FC<IPathAnalysisProps> = () => {
  const { data: graphData, graph } = useContext();
  const [state, updateState] = useImmer<IState>({
    allNodePath: [],
    allEdgePath: [],
    pathStatusMap: {},
    highlightPath: new Set<number>(),
    isAnalysis: false,
  });
  const [form] = Form.useForm();
  //const { findShortestPath, findAllPath } = Algorithm as any;

  const handleResetForm = () => {
    form.resetFields();
    updateState(draft => {
      draft.allNodePath = [];
      draft.allEdgePath = [];
      draft.pathStatusMap = {};
      draft.highlightPath = new Set();
      draft.isAnalysis = false;
    });
  };

  const handleSearch = () => {
    //console.log(graphData, '@graphData')
    //const edge = graph.findById('account_103-account_903-4');
    //console.log(edge, '@edge')
    form.validateFields().then(values => {
      const { source, target } = values;
      const { allNodePath, allEdgePath } = findAllPath(graphData, source, target, true);

      /* const edgeIdMap = getEdgeIdMap(graphData.edges);
      console.log(edgeIdMap, '@edgeIdMap')
      const allEdgePath: string[][] = [];
      allNodePath.forEach(nodeArr => {
        const edgeArr: string[] = [];
        for (let i = 0; i < nodeArr.length - 1; i++) {
          const idx = `${nodeArr[i]}-${nodeArr[i + 1]}`;
          const edgeIds = edgeIdMap.get(idx);
          const edgeId = edgeIds?.shift();
          edgeIdMap.set(idx, edgeIds as string[]);
          edgeArr.push(edgeId as string);
        }
        allEdgePath.push(edgeArr);
      }); */

      updateState(draft => {
        draft.allNodePath = allNodePath;
        draft.allEdgePath = allEdgePath;
        draft.isAnalysis = true;
      });
    });
  };

  const onSwitchChange = (pathId: number) => {
    updateState(draft => {
      draft.highlightPath.has(pathId) ? draft.highlightPath.delete(pathId) : draft.highlightPath.add(pathId);
    });
  };

  useEffect(() => {
    for (let i = 0; i < state.allNodePath.length; i++) {
      const nodes = state.allNodePath[i];
      const edges = state.allEdgePath[i];
      
      if (!state.highlightPath.has(i)) {
        state.pathStatusMap[i] &&
          nodes.forEach(nodeId => {
            const node = graph.findById(nodeId);
            node.setState('highlight', false);
          });

        state.pathStatusMap[i] &&
          edges.forEach(edgeId => {
            graph.setItemState(edgeId, 'active', false);
          });

        updateState(draft => {
          draft.pathStatusMap[i] = false;
        });
      }
    }

    for (let i = 0; i < state.allNodePath.length; i++) {
      const nodes = state.allNodePath[i];
      const edges = state.allEdgePath[i];
      if (state.highlightPath.has(i)) {
        nodes.forEach(nodeId => {
          const node = graph.findById(nodeId);
          node.setState('highlight', true);
        });
        edges.forEach(edgeId => {
          console.log(edgeId, '@edgeId')
          graph.setItemState(edgeId, 'active', true);
        });
        updateState(draft => {
          draft.pathStatusMap[i] = true;
        });
      }
    }
  }, [state.highlightPath]);

  return (
    <div className="gi-path-analysis">
      <h2 className="gi-path-analysis-title">路径查询</h2>
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
          <Button style={{ marginRight: 8 }} onClick={handleResetForm}>
            重置
          </Button>
          <Button type="primary" onClick={handleSearch}>
            查询
          </Button>
        </Form.Item>
      </Form>
      <div className="gi-path-analysis-path-list-container">
        {state.allNodePath.length > 0 && (
          <Collapse defaultActiveKey={0}>
            {state.allNodePath.map((path, index) => {
              return (
                <Panel
                  key={index}
                  header={
                    <PanelHeader pathId={index} highlightPath={state.highlightPath} onSwitchChange={onSwitchChange} />
                  }
                >
                  <Timeline>
                    {path.map(nodeId => {
                      return <Timeline.Item>{nodeId}</Timeline.Item>;
                    })}
                  </Timeline>
                </Panel>
              );
            })}
          </Collapse>
        )}
        {state.allNodePath.length === 0 && state.isAnalysis && <Empty />}
      </div>
    </div>
  );
};

export default PathAnalysis;

// @ts-nocheck
import { ReloadOutlined } from '@ant-design/icons';
import { nodesCosineSimilarity } from '@antv/algorithm';
import { NodeSelectionWrap } from '@antv/gi-common-components';
import type { NodeFormatProps } from '@antv/gi-common-components';
import { useContext } from '@antv/gi-sdk';
import type { GraphinData } from '@antv/graphin';
import { Button, Empty, Form, message } from 'antd';
import { cloneDeep } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import $i18n from '../i18n';
import './index.less';
import SimilarityResultTable from './resultTable';
export interface CommunityDiscoveryProps extends NodeFormatProps {
  style?: React.CSSProperties;
  controlledValues?: {
    algorithm: string;
    seedNodeId: string | null;
  };
  onOpen?: () => void;
  nodeSelectionMode: string[];
  nodeLabel: string;
  filter?: (node: any) => boolean;
}

export enum NodesSimilarityAlgorithm {
  nodesCosineSimilarity = 'nodes-cosine-similarity',
}

interface ResData {
  similarityRes: number[] | undefined;
  similarNodes: any[] | undefined;
}
const CommunityDiscovery: React.FC<CommunityDiscoveryProps> = props => {
  const { controlledValues, style = {}, onOpen, nodeSelectionMode, nodeLabel, labelFormat, filter } = props;
  const { data, graph, updateHistory } = useContext();
  const [communityAlgo, setCommunityAlgo] = useState(NodesSimilarityAlgorithm.nodesCosineSimilarity);
  const [initData, setInitData] = useState<GraphinData>({ nodes: [], edges: [] });

  const [similarityAlgo, setSimilarityAlgo] = useState<string>(NodesSimilarityAlgorithm.nodesCosineSimilarity);
  const [resData, setResData] = useState<ResData>({ similarityRes: [], similarNodes: [] });
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [seedNodeId, setSeedNodeId] = useState<string | null>(null);
  const [topReset, setTopReset] = useState(false);

  const [form] = Form.useForm();

  useEffect(() => {
    setInitData({
      //@ts-ignore
      nodes: cloneDeep(graph.getNodes()).map(node => node.getModel()),
      //@ts-ignore
      edges: cloneDeep(graph.getEdges()).map(edge => {
        const model = edge.getModel();
        return {
          ...model,
          //@ts-ignore
          id: model.id || model.data.id,
        };
      }),
    });
  }, [data]);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const { seedNodeId: controlledSeed, algorithm } = controlledValues;
      onOpen?.();
      setSeedNodeId(controlledSeed);
      setSimilarityAlgo(algorithm);
      form?.setFieldValue('seed', controlledSeed);
      onAnalyse(algorithm);
    }
  }, [controlledValues]);

  /**
   * 更新到历史记录
   * @param success 是否成功
   * @param errorMsg 若失败，填写失败信息
   * @param value 查询语句
   */
  const handleUpdateHistory = (success: boolean, errorMsg?: string) => {
    updateHistory({
      componentId: 'NodesSimilarity',
      type: 'analyse',
      subType: $i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.Component.NodeSimilarity', dm: '节点相似性' }),
      statement: $i18n.get(
        {
          id: 'gi-assets-algorithm.src.NodesSimilarity.Component.AlgorithmSimilarityalgo',
          dm: '算法 {similarityAlgo}',
        },
        { similarityAlgo: similarityAlgo },
      ),
      success,
      errorMsg,
      params: {
        algorithm: similarityAlgo,
        seedNodeId,
      },
    });
  };

  const resetMapping = (mappedNodeIds: string[], mappedEdgeIds: string[]) => {
    graph.getNodes().forEach(node => {
      const id = node.get('id');
      const initModel = initData.nodes?.find(initNode => initNode.id === id);
      if (initModel && !mappedNodeIds?.includes(id)) {
        graph.updateItem(node, {
          style: {
            keyshape: {
              size: initModel.style?.keyshape?.size,
            },
          },
        });
      }
    });
    graph.getEdges().forEach(edge => {
      edge.refresh();
    });
  };

  const formatOriginData = ({ nodes = [], edges = [] }: GraphinData) => {
    return {
      nodes: nodes.map(node => {
        const properties = Object.assign({}, node.data, node.data.properties);
        delete properties.id;
        return {
          id: node.id,
          label: node.label || node.data.label,
          properties,
        };
      }),
      edges: edges.map(edge => ({
        ...edge,
        id: edge.id || edge.data.id,
      })),
    };
  };

  const setNodeStyle = (nodes, similarityKey) => {
    nodes.forEach(node => {
      graph.updateItem(node.id, {
        style: {
          keyshape: {
            size: Math.max(50 * node[similarityKey], 30),
          },
        },
      });
    });
    graph.getEdges().forEach(edge => {
      edge.refresh();
    });
  };

  const highlightNode = nodeId => {
    const node = graph.findById(nodeId);
    if (node) {
      graph.setItemState(nodeId, 'selected', true);
      graph.updateItem(nodeId, {
        style: {
          keyshape: {
            size: 40,
          },
        },
      });
      graph.getEdges().forEach(edge => {
        edge.refresh();
      });
    }
  };

  const onAnalyse = async (algorithm?: string) => {
    setHasAnalysis(true);
    const formatData = formatOriginData(data);
    const { seed } = await form.validateFields();
    setSeedNodeId(seed);
    switch (algorithm || similarityAlgo) {
      case NodesSimilarityAlgorithm.nodesCosineSimilarity:
        if (!graph || graph.destroyed) {
          handleUpdateHistory(
            false,
            $i18n.get({
              id: 'gi-assets-algorithm.src.NodesSimilarity.Component.TheGraphInstanceDoesNot',
              dm: '图实例不存在',
            }),
          );
          return;
        }
        const nodes = formatData?.nodes || [];
        const seedNode = nodes?.find(node => node.id === seed);
        if (!seedNode) {
          message.info(
            $i18n.get({
              id: 'gi-assets-algorithm.src.NodesSimilarity.Component.TheSeedNodeDoesNot',
              dm: '种子节点不存在',
            }),
          );
          handleUpdateHistory(
            false,
            $i18n.get(
              {
                id: 'gi-assets-algorithm.src.NodesSimilarity.Component.TheSeedNodeSeednodeidDoes',
                dm: '种子节点{seedNodeId}不存在',
              },
              { seedNodeId: seed },
            ),
          );
          return;
        }
        highlightNode(seed);
        // @ts-ignore
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes, seedNode, 'properties');
        setResData({
          similarityRes: allCosineSimilarity,
          similarNodes: [seedNode, ...similarNodes],
        });
        setNodeStyle(similarNodes, 'cosineSimilarity');
        handleUpdateHistory(true);
        break;
      default:
        handleUpdateHistory(false, `算法${algorithm || similarityAlgo}不存在`);
        break;
    }
  };

  const renderResult = () => {
    if (!hasAnalysis) {
      return;
    }

    const { similarityRes, similarNodes } = resData || {};

    if (!similarityRes?.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={$i18n.get({
            id: 'gi-assets-algorithm.src.NodesSimilarity.Component.NoDataAvailable',
            dm: '暂无数据',
          })}
        />
      );
    }

    if (similarityAlgo === NodesSimilarityAlgorithm.nodesCosineSimilarity) {
      return (
        <div className="nodes-similarity-result-wrapper">
          <span className="nodes-similarity-title">
            {$i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.Component.AnalysisResults', dm: '分析结果' })}
          </span>
          <SimilarityResultTable similarNodes={similarNodes} topReset={topReset} similarityKey="cosineSimilarity" />
        </div>
      );
    }
  };

  const reset = () => {
    form.resetFields();
    resetMapping([], []);
    setResData({ similarityRes: [], similarNodes: [] });
    setCommunityAlgo(NodesSimilarityAlgorithm.nodesCosineSimilarity);
    setTopReset(true);
  };

  return (
    <div
      style={
        {
          ...style,
        } as any
      }
    >
      <div className="nodes-similarity-wrapper">
        <div>
          <Form form={form} layout={'vertical'}>
            <NodeSelectionWrap
              // @ts-ignore
              graph={graph}
              form={form}
              items={[
                {
                  name: 'seed',
                  label: $i18n.get({
                    id: 'gi-assets-algorithm.src.NodesSimilarity.Component.SeedNode',
                    dm: '种子节点',
                  }),
                },
              ]}
              filter={filter}
              data={data.nodes}
              labelFormat={labelFormat}
              nodeLabel={nodeLabel}
              nodeSelectionMode={nodeSelectionMode}
            />
          </Form>
        </div>

        <div className="nodes-similarity-operations">
          <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={() => onAnalyse()}>
            {$i18n.get({ id: 'gi-assets-algorithm.src.NodesSimilarity.Component.Analysis', dm: '分析' })}
          </Button>
          <ReloadOutlined onClick={reset} />
        </div>

        {renderResult()}
      </div>
    </div>
  );
};

export default memo(CommunityDiscovery);

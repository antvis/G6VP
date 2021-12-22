import { ReloadOutlined } from '@ant-design/icons';
import { nodesCosineSimilarity } from '@antv/algorithm';
import type { GraphinData } from '@antv/graphin';
import { GraphinContext } from '@antv/graphin';
import { Button, Empty, Input, Radio } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import './index.less';
import FormattedMessage, { formatMessage } from './locale';
import SimilarityResultTable from './resultTable';

export interface CommunityDiscoveryProps {
  style?: React.CSSProperties;
}

export enum NodesSimilarityAlgorithm {
  nodesConsineSimilarity = 'nodes-cosine-similarity',
}

interface ResData {
  similarityRes: number[] | undefined;
  similarNodes: any[] | undefined;
}
const CommunityDiscovery: React.FC<CommunityDiscoveryProps> = props => {
  const { style = {} } = props;
  const { graph } = React.useContext(GraphinContext);
  const [communityAlgo, setCommunityAlgo] = useState(NodesSimilarityAlgorithm.nodesConsineSimilarity);
  const [initData, setInitData] = useState<GraphinData>({ nodes: [], edges: [] });

  const [similarityAlgo, setsimilarityAlgo] = useState(NodesSimilarityAlgorithm.nodesConsineSimilarity);
  const [resData, setResData] = useState<ResData>({ similarityRes: [], similarNodes: [] });
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [seedNodeId, setSeedNodeId] = useState(null);
  const [topReset, setTopReset] = useState(false);

  //@ts-ignore
  const data = GraphinContext.GiState?.data;

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

  const similarityAlgoSelections = [
    {
      name: NodesSimilarityAlgorithm.nodesConsineSimilarity,
      content: <></>,
    },
  ];

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
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.label || node.data.label,
        properties: node.data.properties,
      })),
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
            size: Math.max(50 * node[similarityKey], 20),
          },
        },
      });
    });
    graph.getEdges().forEach(edge => {
      edge.refresh();
    });
  };

  const onAnalyse = () => {
    setHasAnalysis(true);
    const formatData = formatOriginData(data);
    switch (similarityAlgo) {
      case NodesSimilarityAlgorithm.nodesConsineSimilarity:
        if (!graph || graph.destroyed) {
          return;
        }
        const nodes = formatData?.nodes || [];
        const seedNode = nodes?.find(node => node.id === seedNodeId);
        // @ts-ignore
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes, seedNode);
        setResData({
          similarityRes: allCosineSimilarity,
          similarNodes: [seedNode, ...similarNodes],
        });
        setNodeStyle(similarNodes, 'cosineSimilarity');
        break;
      default:
        break;
    }
  };

  const renderResult = () => {
    if (!hasAnalysis) {
      return;
    }

    const { similarityRes, similarNodes } = resData || {};

    if (!similarityRes?.length) {
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id={`data.no-data`} />} />;
    }

    if (similarityAlgo === NodesSimilarityAlgorithm.nodesConsineSimilarity) {
      return (
        <div className="nodes-similarity-result-wrapper">
          <span className="nodes-similarity-title">
            <FormattedMessage id="nodes-similarity.result" />
          </span>
          <SimilarityResultTable similarNodes={similarNodes} topReset={topReset} similarityKey="cosineSimilarity" />
        </div>
      );
    }
  };

  const changeAlgo = e => {
    resetMapping([], []);
    setResData({ similarityRes: [], similarNodes: [] });
    setCommunityAlgo(e.target.value);
  };

  const reset = () => {
    resetMapping([], []);
    setResData({ similarityRes: [], similarNodes: [] });
    setCommunityAlgo(NodesSimilarityAlgorithm.nodesConsineSimilarity);
    setTopReset(true);
  };

  const onSeachSeed = e => {
    const nodeId = e.target.value;
    if (graph.findById(nodeId)) {
      setSeedNodeId(nodeId);
      graph.updateItem(nodeId, {
        style: {
          keyshape: {
            size: 60,
          },
        },
      });
      graph.getEdges().forEach(edge => {
        edge.refresh();
      });
    }
  };

  return (
    <div
      style={
        {
          background: '#fff',
          padding: '5px',
          ...style,
        } as any
      }
    >
      <div className="nodes-similarity-wrapper">
        <div>
          <p className="nodes-similarity-title">
            <FormattedMessage id="nodes-similarity.select-seed-node" />
          </p>

          <Input
            placeholder={formatMessage({
              id: 'nodes-similarity.select-seed-node',
            })}
            style={{ display: 'block', margin: '0 0 30px 10px' }}
            onChange={onSeachSeed}
          />
        </div>

        <div className="top-info">
          <p className="nodes-similarity-title">
            <FormattedMessage id={`nodes-similarity.select-algo`} />
          </p>
          <ReloadOutlined onClick={reset} />
        </div>

        <Radio.Group onChange={changeAlgo} value={communityAlgo}>
          {similarityAlgoSelections.map(selection => (
            <div key={selection.name}>
              <Radio value={selection.name} className="nodes-similarity-algo-radio">
                <div className="nodes-similarity-algo-title">
                  <span className="nodes-similarity-algo-title-name">
                    <FormattedMessage id={`nodes-similarity.${selection.name}`} />
                  </span>
                  <span className="nodes-similarity-algo-title-tip">
                    <FormattedMessage id={`nodes-similarity.${selection.name}-tip`} />
                  </span>
                </div>
              </Radio>
              {selection.content}
            </div>
          ))}
        </Radio.Group>

        <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={onAnalyse}>
          <FormattedMessage id="analyse" />
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default CommunityDiscovery;

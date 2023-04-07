import { FormOutlined, ReloadOutlined } from '@ant-design/icons';
import { nodesCosineSimilarity } from '@antv/algorithm';
import { useContext } from '@antv/gi-sdk';
import type { GraphinData } from '@antv/graphin';
import { Button, Col, Empty, Input, message, Row } from 'antd';
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
  const context = useContext();
  const { data, graph } = context;
  const [communityAlgo, setCommunityAlgo] = useState(NodesSimilarityAlgorithm.nodesConsineSimilarity);
  const [initData, setInitData] = useState<GraphinData>({ nodes: [], edges: [] });

  const [similarityAlgo, setSimilarityAlgo] = useState(NodesSimilarityAlgorithm.nodesConsineSimilarity);
  const [resData, setResData] = useState<ResData>({ similarityRes: [], similarNodes: [] });
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [seedNodeId, setSeedNodeId] = useState(null);
  const [topReset, setTopReset] = useState(false);
  const [selecting, setSelecting] = useState(false);

  let nodeClickListener = e => {};

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

  const onAnalyse = () => {
    setSelecting(false);
    setHasAnalysis(true);
    const formatData = formatOriginData(data);
    switch (similarityAlgo) {
      case NodesSimilarityAlgorithm.nodesConsineSimilarity:
        if (!graph || graph.destroyed) {
          return;
        }
        const nodes = formatData?.nodes || [];
        const seedNode = nodes?.find(node => node.id === seedNodeId);
        if (!seedNode) {
          message.info(formatMessage({ id: 'seed-node-not-found' }));
        }
        // @ts-ignore
        const { allCosineSimilarity, similarNodes } = nodesCosineSimilarity(nodes, seedNode, 'properties');
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
            <FormattedMessage id="analysis-result" />
          </span>
          <SimilarityResultTable similarNodes={similarNodes} topReset={topReset} similarityKey="cosineSimilarity" />
        </div>
      );
    }
  };

  const reset = () => {
    resetMapping([], []);
    setResData({ similarityRes: [], similarNodes: [] });
    setCommunityAlgo(NodesSimilarityAlgorithm.nodesConsineSimilarity);
    setTopReset(true);
  };

  const onSeachSeed = e => {
    setSelecting(false);
    const nodeId = typeof e === 'string' ? e : e.target.value;
    setSeedNodeId(nodeId);
    if (graph.findById(nodeId)) {
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

  const beginSelect = () => {
    setSelecting(true);
    graph.off('node:click', nodeClickListener);

    nodeClickListener = e => {
      setSelecting(false);
      const { item } = e;
      if (!item || item.destroyed) return;
      onSeachSeed(item.getID());
      // setSeedNodeId(item.getID());
    };
    graph.once('node:click', nodeClickListener);
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
          <Row justify="space-between">
            <Col span={21}>
              <p className="nodes-similarity-title">
                <FormattedMessage id="itelligent-analysis.nodes-similarity.select-seed-node" />
              </p>
            </Col>
            <Col span={2} offset={1} style={{ lineHeight: '32px', textAlign: 'right' }}>
              <ReloadOutlined onClick={reset} />
            </Col>
          </Row>
          <Row justify="space-between">
            <Col span={21}>
              <Input
                placeholder={formatMessage({
                  id: 'itelligent-analysis.nodes-similarity.select-seed-node',
                })}
                style={{ display: 'block', margin: '0 0 30px 10px' }}
                onChange={onSeachSeed}
                //@ts-ignore
                value={seedNodeId}
              />
            </Col>
            <Col span={2} offset={1} style={{ lineHeight: '32px', textAlign: 'right' }}>
              <FormOutlined
                style={{ cursor: 'pointer', color: selecting ? '#1890ff' : 'rgba(0, 0, 0, 0.65)' }}
                onClick={beginSelect}
              />
            </Col>
          </Row>
        </div>

        <Button type="primary" style={{ width: '100%', marginTop: '12px' }} onClick={onAnalyse}>
          <FormattedMessage id="analyse" />
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default CommunityDiscovery;

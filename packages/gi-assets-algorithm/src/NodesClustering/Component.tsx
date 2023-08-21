import { ReloadOutlined } from '@ant-design/icons';
import { kMeans } from '@antv/algorithm';
import { useContext, type GIGraphData } from '@antv/gi-sdk';
import { Button, Col, Empty, InputNumber, Row, Spin } from 'antd';
import { cloneDeep, isEqual } from 'lodash';
import React, { memo, useEffect, useState } from 'react';
import ClustersTable from '../ClusterTable';

import $i18n from '../i18n';
import './index.less';

export enum NodesClusteringAlgorithm {
  KMeans = 'k-means',
}

export enum DistanceType {
  EuclideanDistance = 'euclideanDistance',
}

export interface NodesClusteringProps {
  style?: React.CSSProperties;
  controlledValues?: {
    algorithm: string;
    clusterK: number | null;
    distanceType: string;
    focusNodeId: string;
  };
  onOpen?: () => void;
}

const NodesClustering: React.FunctionComponent<NodesClusteringProps> = props => {
  const { controlledValues, onOpen } = props;
  const context = useContext();
  const { data, graph, layout, updateContext, updateHistory } = context;
  const [nodeClusteringAlgo, setNodeClusteringAlgo] = useState<string>(NodesClusteringAlgorithm.KMeans);
  const [resData, setResData] = useState<any>(null);
  const [initData, setInitData] = useState<GIGraphData>({
    nodes: [],
    edges: [],
  });
  const [clusterK, setClusterK] = useState<number | null>(2);
  const [distanceType, setDistanceType] = useState<string>(DistanceType.EuclideanDistance);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [prevData, setPrevData] = useState({ nodes: [], edges: [] });
  const [prevLayout, setPrevLayout] = useState(layout);

  const getInitData = () => {
    if (!graph || graph.destroyed) {
      return {
        nodes: [],
        edges: [],
      };
    }
    return {
      nodes: cloneDeep(graph.getNodes()).map(node => node.getModel()),
      edges: cloneDeep(graph.getEdges()).map(edge => edge.getModel()),
    };
  };

  useEffect(() => {
    if (!graph || graph.destroyed) return;
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
  }, [data, graph]);

  /**
   * 受控参数变化，自动进行分析
   * e.g. ChatGPT，历史记录模版等
   */
  useEffect(() => {
    if (controlledValues) {
      const {
        algorithm,
        clusterK: controlledClusterK,
        distanceType: controlledDistanceType,
        focusNodeId: controlledFocusNodeId,
      } = controlledValues;
      setNodeClusteringAlgo(algorithm);
      setClusterK(controlledClusterK);
      setDistanceType(controlledDistanceType);
      onOpen?.();
      onAnalyse();
      if (controlledFocusNodeId) {
        focusNodeAndHighlightHull(controlledFocusNodeId);
      }
    }
  }, [controlledValues]);

  const formatOriginData = ({ nodes = [], edges = [] }: GIGraphData) => {
    return {
      nodes: nodes.map(node => {
        const properties = Object.assign({}, node.data, node.data.properties);
        delete properties.id;
        return {
          id: node.id,
          label: node.label || node.data.label || node.data.name,
          properties,
        };
      }),
      edges: edges.map(edge => ({
        ...edge,
        id: edge.id || edge.data.id,
      })),
    };
  };

  const transDataWithCombo = (graphData, clusters) => {
    const comboNodeMap = {};
    clusters.forEach((cluster, index) => {
      cluster.forEach(node => {
        comboNodeMap[node.id] = `gi-kmeans-combo-${String(index)}`;
      });
    });
    return {
      nodes: graphData?.nodes.map(node => ({
        ...node,
        comboId: comboNodeMap[node.id],
        x: undefined,
        y: undefined,
      })),
      edges: graphData?.edges,
      combos: clusters.map((cluster, index) => ({
        id: `gi-kmeans-combo-${String(index)}`,
        label: $i18n.get(
          {
            id: 'gi-assets-algorithm.src.NodesClustering.Component.CategoryIndex',
            dm: '分类{index}',
          },
          { index: index },
        ),
      })),
    };
  };

  const onAnalyse = () => {
    setHasAnalysis(true);
    setLoading(true);
    setTimeout(() => {
      const formatData = formatOriginData(data);
      switch (nodeClusteringAlgo) {
        case NodesClusteringAlgorithm.KMeans:
          if (!graph || graph.destroyed) {
            return;
          }

          const { clusters } = kMeans(
            formatData,
            //@ts-ignore
            clusterK,
            //@ts-ignore
            'properties',
            [],
            [],
            distanceType,
          );
          setResData(formatData);
          const newData = transDataWithCombo(data, clusters);
          setPrevData(newData);
          updateContext(draft => {
            draft.data = newData;
          });
          break;
        default:
          break;
      }
      setLoading(false);

      updateHistory({
        componentId: 'NodesClustering',
        type: 'analyse',
        subType: $i18n.get({ id: 'gi-assets-algorithm.src.NodesClustering.Component.NodeClustering', dm: '节点聚类' }),
        statement: $i18n.get(
          {
            id: 'gi-assets-algorithm.src.NodesClustering.Component.AlgorithmNodeclusteringalgo',
            dm: '算法 {nodeClusteringAlgo}',
          },
          { nodeClusteringAlgo: nodeClusteringAlgo },
        ),
        success: true,
        params: {
          algorithm: nodeClusteringAlgo,
          clusterK,
          distanceType,
          focusNodeId,
        },
      });
    }, 100);
  };

  const renderResult = () => {
    if (!hasAnalysis) {
      return;
    }
    if (loading) {
      return (
        <Spin spinning>
          <div className="kg-nodes-clustering-result-wrapper" />
        </Spin>
      );
    }

    if (!resData?.nodes?.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={$i18n.get({
            id: 'gi-assets-algorithm.src.NodesClustering.Component.NoDataAvailable',
            dm: '暂无数据',
          })}
        />
      );
    }

    return (
      <div className="nodes-clustering-result-wrapper">
        <span className="intelligent-analysis-title nodes-clustering-result-title">
          {$i18n.get({ id: 'gi-assets-algorithm.src.NodesClustering.Component.AnalysisResults', dm: '分析结果' })}
        </span>
        <ClustersTable
          data={resData}
          clusterTitle={$i18n.get({
            id: 'gi-assets-algorithm.src.NodesClustering.Component.Classification',
            dm: '分类',
          })}
          focusNodeAndHighlightHull={focusNodeAndHighlightHull}
        />
      </div>
    );
  };

  const clearActiveState = () => {
    if (focusNodeId) {
      const focusNode = graph.findById(focusNodeId);
      if (focusNode.hasState('active')) {
        graph.setItemState(focusNodeId, 'active', false);
      }
    }
  };

  const focusNodeAndHighlightHull = (nodeId, focusClusterId = '') => {
    clearActiveState();
    const node = graph.findById(nodeId);
    if (node) {
      graph.setItemState(node, 'active', true);
      setFocusNodeId(nodeId);
    }
  };

  const reset = () => {
    setResData({ nodes: [], edges: [] });
    setNodeClusteringAlgo(NodesClusteringAlgorithm.KMeans);
    setClusterK(2);
    clearActiveState();
    updateContext(draft => {
      draft.data = initData;
      draft.layout = prevLayout;
    });
  };

  useEffect(() => {
    if (!isEqual(data, prevData)) {
      // @ts-ignore
      setInitData(getInitData());
      // 源数据变化，清空当前结果
      setResData({ nodes: [], edges: [] });
      clearActiveState();
      updateContext(draft => {
        draft.layout = prevLayout;
      });
    }
    // @ts-ignore
    setPrevData(cloneDeep(data));
  }, [data, graph]);

  useEffect(() => {
    //@ts-ignore
    setInitData(getInitData());
    //@ts-ignore
    setPrevLayout(layout);
  }, []);

  return (
    <div>
      <div className="nodes-clustering-wrapper">
        <Row justify="space-between">
          <Col span={21}>
            <div className="nodes-clustering-algo-title">
              <h4 className="nodes-clustering-algo-title-name">
                {$i18n.get(
                  {
                    id: 'gi-assets-algorithm.src.NodesClustering.Component.NodesclusteringalgorithmkmeansAlgorithm',
                    dm: '{NodesClusteringAlgorithmKMeans}算法',
                  },
                  { NodesClusteringAlgorithmKMeans: NodesClusteringAlgorithm.KMeans },
                )}
              </h4>
              <div className="nodes-clustering-algo-title-tip">
                {$i18n.get({
                  id: 'gi-assets-algorithm.src.NodesClustering.Component.GatherNodesIntoKClusters',
                  dm: '根据节点之间的距离将节点聚成K个簇',
                })}
              </div>
            </div>
          </Col>
          <Col span={2} offset={1} style={{ lineHeight: '32px', textAlign: 'right' }}>
            <ReloadOutlined onClick={reset} />
          </Col>
        </Row>

        <div className="nodes-clustering-algo-body">
          <span>
            {$i18n.get({ id: 'gi-assets-algorithm.src.NodesClustering.Component.SetTheKValue', dm: '设置 K 值' })}
          </span>
          <InputNumber
            min={1}
            value={clusterK}
            style={{ margin: '10px 20px' }}
            onChange={value => setClusterK(value)}
          />
        </div>

        <Button type="primary" style={{ width: '100%', marginTop: '12px' }} loading={loading} onClick={onAnalyse}>
          {$i18n.get({ id: 'gi-assets-algorithm.src.NodesClustering.Component.Analysis', dm: '分析' })}
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default memo(NodesClustering);

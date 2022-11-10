import { ReloadOutlined } from '@ant-design/icons';
import { kMeans } from '@antv/algorithm';
import { useContext } from '@antv/gi-sdk';
import type { GraphinData } from '@antv/graphin';
import { Button, Empty, InputNumber, Radio, Select, Spin } from 'antd';
import { cloneDeep, isEqual } from 'lodash';
import React, { useEffect, useState } from 'react';
import ClustersTable from '../ClusterTable';
import './index.less';
import FormattedMessage, { formatMessage } from './locale';

const { Option } = Select;

export enum NodesClusteringAlgorithm {
  KMeans = 'k-means',
}

export enum DistanceType {
  EuclideanDistance = 'euclideanDistance',
}

export interface NodesClusteringProps {
  style?: React.CSSProperties;
}

const NodesClustering: React.FunctionComponent<NodesClusteringProps> = props => {
  const context = useContext();
  const { data, graph, layout, updateContext } = context;
  const [nodeClusteringAlgo, setNodeClusteringAlgo] = useState(NodesClusteringAlgorithm.KMeans);
  const [resData, setResData] = useState<any>(null);
  const [initData, setInitData] = useState<GraphinData>({
    nodes: [],
    edges: [],
  });
  const [clusterK, setClusterK] = useState<number | null>(2);
  const [distanceType, setDistanceType] = useState(DistanceType.EuclideanDistance);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [loading, setLoading] = useState(false);
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [prevData, setPrevData] = useState({ nodes: [], edges: [] });
  const [prevLayout, setPrevLayout] = useState({
    type: 'graphin-force',
    options: { preset: 'concentric' },
  });

  const getInitData = () => ({
    nodes: cloneDeep(graph.getNodes()).map(node => node.getModel()),
    edges: cloneDeep(graph.getEdges()).map(edge => edge.getModel()),
  });

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

  const nodesClusteringAlgoSelections = [
    {
      name: NodesClusteringAlgorithm.KMeans,
      content: (
        <div className="nodes-clustering-algo-body">
          <span>
            <FormattedMessage id="itelligent-analysis.nodes-clustering.k-means.set-k" />
          </span>
          <InputNumber
            min={1}
            value={clusterK}
            style={{ margin: '10px 20px' }}
            onChange={value => setClusterK(value)}
          />
          <div>
            <span>
              <FormattedMessage id="itelligent-analysis.nodes-clustering.k-means.set-distance-type" />
            </span>
            <Select defaultValue={distanceType} style={{ width: 180 }} onChange={value => setDistanceType(value)}>
              <Option value={DistanceType.EuclideanDistance}>
                <FormattedMessage id="itelligent-analysis.nodes-clustering.k-means.distance-type.euclideanDistance" />
              </Option>
            </Select>
          </div>
        </div>
      ),
    },
  ];

  const formatOriginData = ({ nodes = [], edges = [] }: GraphinData) => {
    return {
      nodes: nodes.map(node => ({
        id: node.id,
        label: node.label || node.data.label || node.data.name,
        properties: node.data.properties,
      })),
      edges: edges.map(edge => ({
        ...edge,
        id: edge.id || edge.data.id,
      })),
    };
  };

  const transDataWithCombo = (graphData, formatData, clusters) => {
    return {
      nodes: graphData?.nodes.map(node => ({
        ...node,
        comboId: formatData.nodes.find(item => item.id === node.id)?.clusterId,
        x: undefined,
        y: undefined,
      })),
      edges: graphData?.edges,
      combos: clusters.map((cluster, index) => ({
        id: String(index),
        label: `${formatMessage({ id: 'category' })}${index}`,
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
          const newData = transDataWithCombo(data, formatData, clusters);
          setPrevData(newData);
          updateContext(draft => {
            draft.data = newData;
            draft.layout = {
              type: 'comboForce',
              preventOverlap: true,
              preventNodeOverlap: true,
              nodeSize: 40,
              nodeSpacing: 40,
              comboPadding: 5,
              linkDistance: 150,
              nodeStrength: 300,
              comboCollideStrength: 1,
              nodeCollideStrength: 1,
              gravity: 1,
              comboGravity: 100,
              maxIteration: 200,
              clustering: false,
            };
          });
          break;
        default:
          break;
      }
      setLoading(false);
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
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id="data.no-data" />} />;
    }

    return (
      <div className="nodes-clustering-result-wrapper">
        <span className="intelligent-analysis-title nodes-clustering-result-title">
          <FormattedMessage id={'analysis-result'} />
        </span>
        <ClustersTable
          data={resData}
          clusterTitle={formatMessage({ id: 'category' })}
          focusNodeAndHighlightHull={focusNodeAndHighlightHull}
        />
      </div>
    );
  };

  const cleatActiveState = () => {
    if (focusNodeId) {
      const focusNode = graph.findById(focusNodeId);
      if (focusNode.hasState('active')) {
        graph.setItemState(focusNodeId, 'active', false);
      }
    }
  };

  const focusNodeAndHighlightHull = (nodeId, focusClusterId) => {
    cleatActiveState();
    graph.setItemState(nodeId, 'active', true);
    setFocusNodeId(nodeId);
  };

  const changeAlgo = e => {
    setResData(null);
    setNodeClusteringAlgo(e.target.value);
    setLoading(false);
    setHasAnalysis(false);
  };

  const reset = () => {
    setResData({ nodes: [], edges: [] });
    setNodeClusteringAlgo(NodesClusteringAlgorithm.KMeans);
    setClusterK(2);
    cleatActiveState();
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
      cleatActiveState();
      updateContext(draft => {
        draft.layout = prevLayout;
      });
    }
    // @ts-ignore
    setPrevData(cloneDeep(data));
  }, [data]);

  useEffect(() => {
    //@ts-ignore
    setInitData(getInitData());
    //@ts-ignore
    setPrevLayout(layout);
  }, []);

  return (
    <div>
      <div className="nodes-clustering-wrapper">
        <div className="top-info">
          <p className="nodes-clustering-title">
            <FormattedMessage id={`itelligent-analysis.select-algo`} />
          </p>
          <ReloadOutlined onClick={reset} />
        </div>

        <Radio.Group onChange={changeAlgo} value={nodeClusteringAlgo}>
          {nodesClusteringAlgoSelections.map(selection => (
            <div key={selection.name}>
              <Radio value={selection.name} className="nodes-clustering-algo-radio">
                <div className="nodes-clustering-algo-title">
                  <span className="nodes-clustering-algo-title-name">
                    <FormattedMessage id={`itelligent-analysis.nodes-clustering.${selection.name}`} />
                  </span>
                  <span className="nodes-clustering-algo-title-tip">
                    <FormattedMessage id={`itelligent-analysis.nodes-clustering.${selection.name}-tip`} />
                  </span>
                </div>
              </Radio>
              {selection.content}
            </div>
          ))}
        </Radio.Group>

        <Button type="primary" style={{ width: '100%', marginTop: '12px' }} loading={loading} onClick={onAnalyse}>
          <FormattedMessage id="analyse" />
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default NodesClustering;

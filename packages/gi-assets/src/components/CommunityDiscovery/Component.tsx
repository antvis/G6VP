import { InputNumber, Radio, Button, Empty, Spin } from 'antd';
import React, { useState, useEffect } from 'react';
import Graphin, { GraphinContext, Behaviors } from '@antv/graphin';
import type { GraphinData } from '@antv/graphin';
import { cloneDeep } from 'lodash';
import { kCore, louvain, iLouvain } from '@antv/algorithm';
import { ReloadOutlined } from '@ant-design/icons';
import FormattedMessage from './locale';
import ClustersResultTable from './resultTable';
import Utils from '../utils/index';
import './index.less';

const { ClickSelect } = Behaviors;

export interface CommunityDiscoveryProps {
  style?: React.CSSProperties;
}

enum CommunityDiscoveryAlgorithm {
  KCore = 'k-core',
  louvain = 'louvain',
  iLouvain = 'i-louvain',
}

const CommunityDiscovery: React.FC<CommunityDiscoveryProps> = props => {
  const { style = {} } = props;
  const { graph } = React.useContext(GraphinContext);
  const [communityAlgo, setCommunityAlgo] = useState(CommunityDiscoveryAlgorithm.KCore);
  const [resData, setResData] = useState<any>(null);
  const [initData, setInitData] = useState<GraphinData>({ nodes: [], edges: [] });
  const [coreDegreeK, setCoreDegreeK] = useState(2);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [hulls, setHulls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [allClusters, setAllClusters] = useState<any[]>([]);

  const divisionAlgo = [CommunityDiscoveryAlgorithm.louvain, CommunityDiscoveryAlgorithm.iLouvain];

  //@ts-ignore
  const data = GraphinContext.GiState?.data;

  useEffect(() => {
    setInitData({
      nodes: cloneDeep(graph.getNodes()).map(node => node.getModel()),
      edges: cloneDeep(graph.getEdges()).map(edge => {
        const model = edge.getModel();
        return {
          ...model,
          id: model.id || model.data.id,
        }
      }),
    });
  }, [data]);


  const communityAlgoSelections = [
    {
      name: CommunityDiscoveryAlgorithm.KCore,
      content: (
        <div className="community-discovery-algo-body">
           <span>
            <FormattedMessage id={`community-discovery.k-core.set-k`} />
          </span>
          <InputNumber
            min={1}
            value={coreDegreeK}
            style={{ margin: '10px 20px' }}
            onChange={value => setCoreDegreeK(value)}
          />
        </div>
      ),
    },
    {
      name: CommunityDiscoveryAlgorithm.louvain,
      content: <></>,
    },
    {
      name: CommunityDiscoveryAlgorithm.iLouvain,
      content: <></>,
    },
  ];

  const removeAllHulls = () => {
    Utils.removeHulls(hulls, graph);
    setHulls(null);
  };

  const drawHullsByClusters = (clusters, remove?: boolean, focusClusterId?: string) => {
    if (remove) {
      removeAllHulls();
    }
    const hullOptions = clusters
      .map(cluster => ({
        id: cluster.id,
        type: 'smooth-convex',
        members: cluster.nodes.map(node => node.id),
        style:
          cluster.id === focusClusterId
            ? {
                fill: 'lightgreen',
                stroke: 'green',
              }
            : undefined,
      }))
      .map(cluster => Utils.getHullOptions(cluster));

    const newHulls = Utils.drawHulls(hullOptions, remove ? null : hulls, graph);
    setHulls(newHulls);
  };

  const resetMapping = (mappedNodeIds: string[], mappedEdgeIds: string[]) => {
    graph.getNodes().forEach(node => {
      const id = node.get('id');
      const initModel = initData.nodes?.find(initNode => initNode.id === id);
      if (initModel && !mappedNodeIds?.includes(id)) {
        graph.updateItem(node, {
          // size: undefined
          style: {
            keyshape: {
              size: initModel.style?.keyshape?.size
            },
          },
        });
      }
    });
    if (mappedEdgeIds) {
      graph.getEdges().forEach(edge => {
        //@ts-ignore
        const id = edge.getModel().id || '';
        const initModel = initData.edges?.find(initEdge => initEdge.id === id);
        // 暂时这样处理: 目前GI的导入的数据edge没有id，会自动生成，数据里的edge id和graph中edge id对不上
        // @ts-ignore
        const lineWidth = initModel?.style?.keyshape?.lineWidth;
        if (initModel && !mappedEdgeIds?.includes(id)) {
          graph.updateItem(edge, {
            style: {
              keyshape: {
                lineWidth,
              },
            },
          });
        }
      });
    }
    graph.getEdges().forEach(edge => {
      edge.refresh();
    });
  };

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
      }))
    };
  };

  const onCommunityAnalyse = () => {
    setHasAnalysis(true);
    setLoading(true);;
    setTimeout(() => {
      const formatData = formatOriginData(data);
      switch (communityAlgo) {
        case CommunityDiscoveryAlgorithm.KCore:
          if (!graph || graph.destroyed) {
            return;
          }
          const coreData = (kCore(formatData, coreDegreeK) || {
            nodes: [],
            edges: [],
          }) as GraphinData;
          const coreNodeIds = coreData.nodes.map(node => node.id);
          const coreEdgeIds = coreData.edges.map(edge => edge.id);
          const nodes = initData?.nodes.filter(node => coreNodeIds.includes(node.id));
          const edges = initData?.edges.filter(edge => coreEdgeIds.includes(edge.data?.id)) || [];
          let scaleData = { nodes, edges };
          // 如果相隔较远，x、y等比缩放
          if (nodes.length !== initData?.nodes?.length) {
             //@ts-ignore
            scaleData = Utils.scaleNodes(scaleData, 600);
          }
          setResData(scaleData);
  
          resetMapping([], []);
          // 将主图中的相关节点和边放大
          coreData.nodes.forEach(nodeModel => {
            graph.updateItem(nodeModel.id, {
              style: {
                keyshape: {
                  size: 50
                },
              },
            });
          });
          coreData.edges.forEach(edgeData => {
            // 暂时这样处理: 目前GI的导入的数据edge没有id，会自动生成，数据里的edge id和graph中edge id对不上
            // @ts-ignore
            const edge = graph.getEdges().find(edge => edge.getModel().data.id === edgeData.data.id);
            //@ts-ignore
            graph.updateItem(edge, {
              style: {
                keyshape: {
                  lineWidth: 2
                },
              },
            });
          });
          graph.getEdges().forEach(edge => {
            edge.refresh();
          });
          break;
        case CommunityDiscoveryAlgorithm.louvain:
          const clustersLouvain = louvain(formatData, false, 'weight', 0.01).clusters;
          setResData(formatData);
          setAllClusters(clustersLouvain);
          drawHullsByClusters(clustersLouvain);
          break;
        case CommunityDiscoveryAlgorithm.iLouvain:
          const clustersILouvain = iLouvain(formatData, false, 'weight', 0.01).clusters;
          setResData(formatData);
          setAllClusters(clustersILouvain);
          drawHullsByClusters(clustersILouvain);
        default:
          break;
      }
      setLoading(false);
    }, 100);
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
    drawHullsByClusters(allClusters, true, focusClusterId);
    setFocusNodeId(nodeId);
  };

  const renderResult = () => {
    if (!hasAnalysis) {
      return;
    }

    if (loading) {
      return (
        <Spin spinning>
          <div className="kg-community-result-wrapper" />
        </Spin>
      );
    }

    if (!resData?.nodes?.length) {
      return (
        <Empty
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          description={<FormattedMessage id={`data.no-data`} />}
        />
      );
    }

    if (divisionAlgo.includes(communityAlgo)) {
      return (
        <div className="community-discovery-result-wrapper">
          <span className="community-discovery-title">
            <FormattedMessage id="community-discovery.result" />
          </span>
          <ClustersResultTable
            data={resData}
            focusNodeAndHighlightHull={focusNodeAndHighlightHull}
          />
        </div>
      );
    }
    if (communityAlgo === CommunityDiscoveryAlgorithm.KCore) {
      return (
        <div className="community-discovery-result-wrapper">
          <p className="community-discovery-title">
            <FormattedMessage id="community-discovery.result" />
          </p>
          <div className="community-discovery-graph-container">
            <Graphin
              data={resData}
              height={300}
              layout={{
                type: 'preset',
              }}
              fitView
              animate={false}
              minZoom={0.1}
              layoutCache
            >
              <ClickSelect disabled />
            </Graphin>
          </div>
        </div>
      );
    }
  };

  const changeAlgo = e => {
    resetMapping([], []);
    setResData(null);
    removeAllHulls();
    setCommunityAlgo(e.target.value);
  };

  const reset = () => {
    resetMapping([], []);
    setResData(null);
    removeAllHulls();
    setCommunityAlgo(CommunityDiscoveryAlgorithm.KCore);
    cleatActiveState();
  }

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
      <div className="community-discovery-wrapper">
        <div className="top-info">
          <p className="community-discovery-title">
            <FormattedMessage id={`community-discovery.select-algo`} />
          </p>
          <ReloadOutlined  onClick={reset} />
        </div>

        <Radio.Group onChange={changeAlgo} value={communityAlgo}>
          {communityAlgoSelections.map(selection => (
            <div key={selection.name}>
              <Radio value={selection.name} className="community-discovery-algo-radio">
                <div className="community-discovery-algo-title">
                  <span className="community-discovery-algo-title-name">
                    <FormattedMessage
                      id={`community-discovery.${selection.name}`}
                    />
                  </span>
                  <span className="community-discovery-algo-title-tip">
                    <FormattedMessage
                      id={`community-discovery.${selection.name}-tip`}
                    />
                  </span>
                </div>
              </Radio>
              {selection.content}
            </div>
          ))}
        </Radio.Group>

        <Button
          type="primary"
          style={{ width: '100%', marginTop: '12px' }}
          loading={loading}
          onClick={onCommunityAnalyse}>
          <FormattedMessage id="analyse" />
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default CommunityDiscovery;

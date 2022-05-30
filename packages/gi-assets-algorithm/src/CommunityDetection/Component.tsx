import { useContext } from '@alipay/graphinsight';
import { ReloadOutlined } from '@ant-design/icons';
import { iLouvain, kCore, louvain, connectedComponent } from '@antv/algorithm';
import type { GraphinData } from '@antv/graphin';
import Graphin, { Behaviors } from '@antv/graphin';
import { Button, Empty, InputNumber, Radio, Spin, message } from 'antd';
import { cloneDeep } from 'lodash';
import React, { useEffect, useState } from 'react';
import ClusterTable from '../ClusterTable';
import Utils from '../utils/index';
import FormattedMessage, { formatMessage } from './locale';
import './index.less';

const { ClickSelect } = Behaviors;

enum CommunityDetectionAlgorithm {
  KCore = 'k-core',
  louvain = 'louvain',
  iLouvain = 'i-louvain',
  ConnectedComponent = 'connected-component',
}

export interface CommunityDetectionProps {
  serviceId: string;
  style?: React.CSSProperties;
}

const CommunityDetection: React.FunctionComponent<CommunityDetectionProps> = props => {
  const context = useContext();
  const { data, graph } = context;
  const [communityAlgo, setCommunityAlgo] = useState(CommunityDetectionAlgorithm.KCore);
  const [resData, setResData] = useState<any>(null);
  const [initData, setInitData] = useState<GraphinData>({
    nodes: [],
    edges: [],
  });
  const [coreDegreeK, setCoreDegreeK] = useState(2);
  const [hasAnalysis, setHasAnalysis] = useState(false);
  const [hulls, setHulls] = useState(null);
  const [loading, setLoading] = useState(false);
  const [focusNodeId, setFocusNodeId] = useState(null);
  const [allClusters, setAllClusters] = useState<any[]>([]);
  const [nodeProperties, setNodeProperties] = useState([] as string[]);

  const divisionAlgo = [CommunityDetectionAlgorithm.louvain, CommunityDetectionAlgorithm.iLouvain, CommunityDetectionAlgorithm.ConnectedComponent];

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

    const nodePropertyMap = {};
    data.nodes.forEach(node => {
      Object.keys(node.data).forEach(key => (nodePropertyMap[key] = true));
    });
    setNodeProperties(Object.keys(nodePropertyMap));
  }, [data]);

  const communityAlgoSelections = [
    {
      name: CommunityDetectionAlgorithm.KCore,
      content: (
        <div className="community-detection-algo-body">
          <span>
            <FormattedMessage id="community-detection.k-core.set-k" />
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
      name: CommunityDetectionAlgorithm.louvain,
      content: <></>,
    },
    {
      name: CommunityDetectionAlgorithm.iLouvain,
      content: <></>,
    },
    {
      name: CommunityDetectionAlgorithm.ConnectedComponent,
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
          style: {
            keyshape: {
              size: initModel.style?.keyshape?.size,
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
        const keyShapeStyle = initModel?.style?.keyshape;
        // @ts-ignore
        const lineWidth = keyShapeStyle?.lineWidth;
        if (initModel && !mappedEdgeIds?.includes(id)) {
          graph.updateItem(edge, {
            style: {
              keyshape: {
                lineWidth,
                ...(keyShapeStyle || {})
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
        ...(node.data || {}),
        label: node.label || node.data.label || node.data.name,
        id: node.id,
      })),
      edges: edges.map(edge => ({
        ...edge,
        ...(edge.data || {}),
        id: edge.id || edge.data.id,
      })),
    };
  };

  const onCommunityAnalyse = () => {
    setHasAnalysis(true);
    setLoading(true);
    setTimeout(() => {
      const formatData = formatOriginData(data);
      switch (communityAlgo) {
        case CommunityDetectionAlgorithm.KCore:
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
                  size: 50,
                },
              },
            });
          });
          coreData.edges.forEach(edgeData => {
            // 暂时这样处理: 目前GI的导入的数据edge没有id，会自动生成，数据里的edge id和graph中edge id对不上
            const edge = graph
              .getEdges()
              //@ts-ignore
              .find(edge => edge.getModel().data.id === edgeData.data.id);
            if (!edge) return;
            const { style = {} } = edge.getModel();
            //@ts-ignore
            graph.updateItem(edge, {
              style: {
                keyshape: {
                  lineWidth: 2,
                  ...(style.keyshape || {})
                },
              },
            });
          });
          graph.getEdges().forEach(edge => {
            edge.refresh();
          });
          break;
        case CommunityDetectionAlgorithm.louvain:
          const clustersLouvain = louvain(formatData, false, 'weight', 0.01).clusters;
          setResData(formatData);
          setAllClusters(clustersLouvain);
          drawHullsByClusters(clustersLouvain);
          break;
        case CommunityDetectionAlgorithm.iLouvain:
          const clustersILouvain = iLouvain(
            formatData,
            false,
            'weight',
            0.01,
            //@ts-ignore
            'properties',
          ).clusters;
          setResData(formatData);
          setAllClusters(clustersILouvain);
          drawHullsByClusters(clustersILouvain);
          break;
        case CommunityDetectionAlgorithm.ConnectedComponent:
          const components = connectedComponent(formatData);
          if (components.length <= 1) {
            message.info(formatMessage({ id: 'connected-component.all-connected' }));
            setLoading(false);
            return;
          }
          const clustersComponent: { id: string, nodes: any[] }[] = [];
          let existSingleNode = false;
          components.forEach((componentNodes, i) => {
            if (componentNodes.length === 1) {
              existSingleNode = true;
              return;
            }
            componentNodes.forEach(node => node.clusterId = `${i}`);
            clustersComponent.push({
              id: `${i}`,
              nodes: componentNodes
            });
          });
          if (existSingleNode) {
            message.info(formatMessage({ id: 'connected-component.has-single' }));
          }
          setResData(formatData);
          setAllClusters(clustersComponent);
          drawHullsByClusters(clustersComponent);
          break;
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
      return <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={<FormattedMessage id="data.no-data" />} />;
    }

    if (divisionAlgo.includes(communityAlgo)) {
      return (
        <div className="community-detection-result-wrapper">
          <span className="community-detection-title">
            <FormattedMessage id="analysis-result" />
          </span>
          <ClusterTable
            data={resData}
            clusterTitle={formatMessage({ id: 'community-index' })}
            focusNodeAndHighlightHull={focusNodeAndHighlightHull}
            properties={nodeProperties}
          />
        </div>
      );
    }
    if (communityAlgo === CommunityDetectionAlgorithm.KCore) {
      return (
        <div className="community-detection-result-wrapper">
          <p className="community-detection-title">
            <FormattedMessage id="analysis-result" />
          </p>
          <div className="community-detection-graph-container">
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
    setCommunityAlgo(CommunityDetectionAlgorithm.KCore);
    cleatActiveState();
  };

  return (
    <div
      style={{
        background: '#fff',
      }}
    >
      <div className="community-detection-wrapper">
        <div className="top-info">
          <p className="community-detection-title">
            <FormattedMessage id="select-algo" />
          </p>
          <ReloadOutlined onClick={reset} />
        </div>

        <Radio.Group onChange={changeAlgo} value={communityAlgo}>
          {communityAlgoSelections.map(selection => (
            <div key={selection.name}>
              <Radio value={selection.name} className="community-detection-algo-radio">
                <div className="community-detection-algo-title">
                  <span className="community-detection-algo-title-name">
                    <FormattedMessage id={`community-detection.${selection.name}`} />
                  </span>
                  <span className="community-detection-algo-title-tip">
                    <FormattedMessage id={`community-detection.${selection.name}-tip`} />
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
          onClick={onCommunityAnalyse}
        >
          <FormattedMessage id="analyse" />
        </Button>

        {renderResult()}
      </div>
    </div>
  );
};

export default CommunityDetection;

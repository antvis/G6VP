import { ConfigRecommedor } from './index';
const getRecommenderCfg = params => {
  const { config, data } = params;
  const Recommender = new ConfigRecommedor(data);
  const layoutCfg = Recommender.recLayoutCfg();
  const nodeCfg = Recommender.recNodeCfg();
  const edgeCfg = Recommender.recEdgeCfg();
  const newGraphData = Recommender.graphData;
  // console.log('newGraphData', newGraphData)
  const newConfig = {
    ...config,
    node: {
      ...config.node,
      props: {
        ...config.node.props,
        ...nodeCfg,
      },
    },
    edge: {
      ...config.edge,
      props: {
        ...config.edge.props,
        ...edgeCfg,
      },
    },
    layout: {
      ...config.layout,
      props: {
        ...config.layout.props,
        ...layoutCfg,
      },
    },
  };
  return {
    newConfig: newConfig,
    newData: newGraphData,
  };
};

export default getRecommenderCfg;

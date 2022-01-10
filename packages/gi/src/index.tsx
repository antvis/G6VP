import Graphin, { GraphinData, Layout } from '@antv/graphin';
import React from 'react';
import { useImmer } from 'use-immer';
import { GraphInsightContext, useContext } from './context';
import { registerLayouts, registerShapes } from './register';
import SetupUseGraphinHook from './SetupUseGraphinHook';
import { GIComponentConfig, GIConfig, GIService } from './typing';
const version = '0.1.0';
export { useContext, version };
console.log('%c GI_VERSION:0.1.0', 'color:red');
export interface Props {
  /**
   * @description 配置信息
   */
  config: GIConfig;
  /**
   * assets 资产
   */
  assets: {
    /** 从服务端获取的数据服务：Services */
    services: GIService[];
    /** 从服务端获取的组件：Components */
    components: any;
    /** 从服务端获取的元素：Elements */
    elements: any;

    layouts: any;
  };
  services: GIService[];
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

export interface State {
  /**
   * Graphin 中上下文带的数据
   */
  graph: null;
  apis: null;
  theme: null;
  // layoutInstance: null;

  /**
   * Graph Insight SDK 需要的数据
   */

  /** 当前画布渲染的数据 */
  data: GraphinData | null;
  /** 需要画布重置的数据 */
  source: GraphinData | null;
  /** 布局 */
  layout: Layout;
  /** 组件 */
  components: any[];
  /** 画布是否准备ready */
  isReady: boolean;
  /** 画布的配置 */
  config: {};
  /** 图数据转化函数 */
  transform: any;
  /** 画布所有注册的服务 */
  servives: any[];
  [key: string]: any;
}

const GISDK = (props: Props) => {
  const { children, assets } = props;
  let Services = props.services;
  if (assets.services) {
    console.warn(`⚠️：assets.services 即将废弃，请使用 props.services 代替`);
    Services = assets.services;
  }

  const { components: ComponentAssets, elements: ElementAssets, layouts: Layouts } = assets;
  registerShapes(ElementAssets);
  registerLayouts(Layouts);

  // const [state, setState] = React.useState({
  //   data: { nodes: [], edges: [] } as GraphinData,
  //   source: { nodes: [], edges: [] } as GraphinData,
  //   layout: {},
  //   components: [] as GIComponentConfig[],
  //   isReady: false,
  // });

  const [state, updateState] = useImmer({
    data: { nodes: [], edges: [] } as GraphinData,
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
    config: props.config,
    isReady: false,
    pending: false,
    isContextReady: false,
    /** graphin */
    graph: null,
    apis: null,
    theme: {
      mode: 'light',
      primaryColor: '#fb08c6',
    },
    layoutInstance: null,
  });

  React.useEffect(() => {
    console.log('effect config props');
    updateState(draft => {
      draft.config = props.config;
    });
  }, [props.config]);

  const { config, theme } = state;

  const { layout: layoutCfg, components: componentsCfg = [], node: nodeCfg, edge: edgeCfg } = config;
  /** 根据注册的图元素，生成Transform函数 */

  const { id: NodeElementId } = nodeCfg || { id: 'GraphinNode' };
  const { id: EdgeElementId } = edgeCfg || { id: 'GraphinEdge' };
  const NodeElement = ElementAssets[NodeElementId];
  const EdgeElement = ElementAssets[EdgeElementId];
  const transform = (data, config) => {
    const nodes = NodeElement.registerTransform(data, config);
    const edges = EdgeElement.registerTransform(data, config);
    return {
      nodes,
      edges,
    };
  };

  /** 数据发生改变 */
  React.useEffect(() => {
    console.log('effect,service');
    const { service } = Services.find(s => s.id === 'GI_SERVICE_INTIAL_GRAPH') as GIService;

    service().then((res = { nodes: [], edges: [] }) => {
      updateState(draft => {
        const newData = transform(res, config);
        draft.data = newData;
        draft.source = { ...res };
        draft.isReady = true;
      });
    });
  }, []);

  /** 节点和边的配置发生改变 */
  React.useEffect(() => {
    console.log('effect,components');
    const filteredComponents = componentsCfg;
    /** start 针对容器组件特殊处理 */
    const containerComponents = filteredComponents.filter(c => {
      return c.props && c.props.GI_CONTAINER;
    });
    const needContainerComponentIds = containerComponents.reduce((acc: string[], curr) => {
      const { GI_CONTAINER } = curr.props;
      return [...acc, ...GI_CONTAINER];
    }, []);

    const finalComponents = filteredComponents.filter(c => {
      const { id } = c;
      return needContainerComponentIds.indexOf(id) === -1;
    });

    const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr,
      };
    }, {});

    /** end */
    updateState(draft => {
      draft.components = finalComponents;
      draft.config.components = componentsCfg;
    });
  }, [componentsCfg]);
  /** 布局发生改变 */

  React.useEffect(() => {
    console.log('effect,layout');
    const { type, ...options } = layoutCfg?.props || {};

    updateState(draft => {
      draft.layout = {
        type: type,
        ...options,
      };
      draft.config.layout = layoutCfg;
    });
  }, [layoutCfg]);

  React.useEffect(() => {
    console.log('effect,node,edge');
    updateState(draft => {
      if (draft.data.nodes.length !== 0) {
        const newData = transform(draft.data, { node: nodeCfg, edge: edgeCfg });
        draft.data = newData;
      }
      draft.config.node = nodeCfg;
      draft.config.edge = edgeCfg;
    });
  }, [nodeCfg, edgeCfg]);

  const { data, layout, components, isReady } = state;

  // //@ts-ignore 临时方案
  // GraphinContext.services = Services;
  // //@ts-ignore 临时方案
  // GraphinContext.transform = transform;
  // // @ts-ignore
  // GraphinContext.config = config;

  // // @ts-ignore
  // GraphinContext.dispatch = {
  //   changeData: inputData => {
  //     updateState(draft => {
  //       draft.data = transform(inputData, config);
  //     });
  //   },
  // };
  // //@ts-ignore
  // GraphinContext.GiState = state;
  // //@ts-ignore
  // GraphinContext.setGiState = updateState;

  if (!isReady) {
    return <div className="gi-loading">render...</div>;
  }
  console.log('%c gi render...', 'color:red', state);

  const ContextValue = {
    ...state,
    services: Services,
    transform: res => {
      return transform(res, { node: nodeCfg, edge: edgeCfg });
    },
    updateContext: updateState,
    updateData: res => {
      updateState(draft => {
        draft.data = transform(res, { node: nodeCfg, edge: edgeCfg });
        draft.source = transform(res, { node: nodeCfg, edge: edgeCfg });
      });
    },
    updateLayout: res => {
      updateState(draft => {
        draft.layout = res;
      });
    },
    updateDataAndLayout: (res, lay) => {
      updateState(draft => {
        draft.data = transform(res, { node: nodeCfg, edge: edgeCfg });
        draft.source = transform(res, { node: nodeCfg, edge: edgeCfg });
        draft.layout = lay;
      });
    },
  };

  const renderComponents = () => {
    const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
      return {
        ...acc,
        [curr.id]: curr,
      };
    }, {});
    console.log('COMPONENT_ASSETS');
    if (!state.isContextReady) {
      return null;
    }
    return components.map(c => {
      const { id, props: itemProps = {} } = c;

      const matchComponent = ComponentAssets[id];
      if (!matchComponent) {
        return null;
      }
      /** 特殊处理Container组件 */
      const { GI_CONTAINER } = itemProps;

      let GIProps = {};
      if (GI_CONTAINER) {
        GIProps = {
          components: GI_CONTAINER.map(c => {
            return ComponentCfgMap[c];
          }),
          assets: ComponentAssets,
        };
      }

      const {
        component: Component,
        props: defaultProps,
      }: {
        component: typeof React.Component;
        props: any;
      } = matchComponent;
      return <Component key={id} {...defaultProps} {...itemProps} {...GIProps} />;
    });
  };

  return (
    <GraphInsightContext.Provider
      //@ts-ignore
      value={ContextValue}
    >
      <Graphin
        data={data}
        layout={layout}
        enabledStack={true}
        //@ts-ignore
        theme={theme}
      >
        <>
          <SetupUseGraphinHook updateContext={updateState} />
          {renderComponents()}
          {children}
        </>
      </Graphin>
    </GraphInsightContext.Provider>
  );
};

export default GISDK;

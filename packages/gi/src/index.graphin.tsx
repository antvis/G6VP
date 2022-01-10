import Graphin, { GraphinContext, GraphinData, Layout } from '@antv/graphin';
import React from 'react';
import { useImmer } from 'use-immer';
import { useContext } from './context';
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

let registeredShapes = '';
let registeredLayouts = '';

const registerShapes = Elements => {
  if (Elements) {
    const nextShapes = Object.keys(Elements).join('-');
    const prevShapes = registeredShapes;
    if (nextShapes !== prevShapes) {
      console.log('%c register Shape! ', 'color:green');
      Object.keys(Elements).forEach(type => {
        Elements[type].registerShape(Graphin);
      });
      registeredShapes = nextShapes;
    }
  }
};
const registerLayouts = Layouts => {
  if (Layouts) {
    const nextLayout = Object.keys(Layouts).join('-');
    const prevLayout = registeredLayouts;
    if (nextLayout !== prevLayout) {
      console.log('%c register Layout! ', 'color:green');
      Object.keys(Layouts).forEach(type => {
        Layouts[type].registerLayout(Graphin);
      });
      registeredLayouts = nextLayout;
    }
  }
};

const getTransform = () => {};

const GISDK = (props: Props) => {
  const { children, assets } = props;
  const { components: Components, elements: Elements, services: Services, layouts: Layouts } = assets;
  registerShapes(Elements);
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
    isGraphInsightContext: false,
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

  const NodeElement = Elements[NodeElementId];
  const EdgeElement = Elements[EdgeElementId];
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

  //@ts-ignore 临时方案
  GraphinContext.services = Services;
  //@ts-ignore 临时方案
  GraphinContext.transform = transform;
  // @ts-ignore
  GraphinContext.config = config;

  // @ts-ignore
  GraphinContext.dispatch = {
    changeData: inputData => {
      updateState(draft => {
        draft.data = transform(inputData, config);
      });
    },
  };
  //@ts-ignore
  GraphinContext.GiState = state;
  //@ts-ignore
  GraphinContext.setGiState = updateState;

  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});

  console.log('%c gi render...', 'color:red', props, state);
  if (!isReady) {
    return <div className="gi-loading">render...</div>;
  }

  const ContextValue = {
    ...state,
    services: Services,
    updateContext: updateState,
    updateData: res => {
      updateState(draft => {
        draft.data = transform(res, { node: nodeCfg, edge: edgeCfg });
      });
    },
  };

  return (
    <Graphin
      data={data}
      layout={layout}
      enabledStack={true}
      //@ts-ignore
      theme={theme}
    >
      <>
        <SetupUseGraphinHook updateContext={updateState} />
        {state.isGraphInsightContext && (
          <GraphinContext.Provider
            //@ts-ignore
            value={ContextValue}
          >
            {/** 内置的组件 */}

            {/** 用户从组件市场里选择的组件  */}
            {components.map(c => {
              const { id, props: itemProps = {} } = c;

              const matchComponent = Components[id];
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
                  assets: Components,
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
            })}

            {/** 用户二次定制开发的组件  */}
            {children}
          </GraphinContext.Provider>
        )}
      </>
    </Graphin>
  );
};

export default GISDK;

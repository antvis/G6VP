import Graphin, { GraphinData } from '@antv/graphin';
import { original } from 'immer';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';
import CanvasClick from './components/ClickCanvas';
import { GraphInsightContext } from './context';
import './index.less';
import DefaultInitializer, { defaultInitializerCfg } from './Initializer';
import * as utils from './process';
import { registerLayouts, registerShapes } from './register';
import SetupUseGraphinHook from './SetupUseGraphinHook';
import type { Props, State } from './typing';
import { GIComponentConfig } from './typing';

/** export  */
const GISDK = (props: Props) => {
  const { children, assets, id } = props;
  let { services: Services } = props;

  const GISDK_ID = React.useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 GISDK_ID : ${defaultId} 用于多实例管理`);
      return defaultId;
    }
    return id;
  }, []);

  const { components: ComponentAssets, elements: ElementAssets, layouts: Layouts } = assets;

  registerShapes(ElementAssets);
  registerLayouts(Layouts);

  const [state, updateState] = useImmer<State>({
    data: { nodes: [], edges: [] } as GraphinData,
    schemaData: {
      //会在初始化时候更新
      nodes: [],
      edges: [],
    },
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
    config: props.config,
    isLoading: false,
    isContextReady: false,
    initialized: false,
    initializer: defaultInitializerCfg,
    transform: (data, reset?: boolean) => data,
    layoutCache: false,
    largeGraphLimit: 600,
    largeGraphData: undefined,

    /** graphin */
    //@ts-ignore
    graph: null,
    //@ts-ignore
    apis: null,
    //@ts-ignore
    theme: null,
    //@ts-ignore
    layoutInstance: null,
    stopForceSimulation: () => {},
    restartForceSimulation: () => {},
  });

  React.useEffect(() => {
    updateState(draft => {
      draft.config = props.config;
    });
  }, [props.config]);

  const { layout: layoutCfg, components: componentsCfg = [], nodes: nodesCfg, edges: edgesCfg } = state.config;
  /** 根据注册的图元素，生成Transform函数 */

  /** 节点和边的配置发生改变 */
  React.useEffect(() => {
    const filteredComponents = componentsCfg.filter(c => {
      /** 过滤初始化组件 */
      return !(c.props && c.props.GI_INITIALIZER);
    });

    /** 容器组件 */
    const containerComponents = filteredComponents.filter(c => {
      return c.props && c.props.GI_CONTAINER;
    });

    /** 集成到容器组件中的原子组件 */
    const needContainerComponentIds = containerComponents.reduce((acc: string[], curr) => {
      const { GI_CONTAINER } = curr.props;
      return [...acc, ...(GI_CONTAINER as string[])];
    }, []);
    /** 最终需要渲染的组件 */
    const finalComponents = filteredComponents.filter(c => {
      const { id } = c;
      return needContainerComponentIds.indexOf(id) === -1;
    });
    /** 初始化组件 */
    const initializerCfg =
      componentsCfg.find(c => {
        return c.props && c.props.GI_INITIALIZER;
      }) || defaultInitializerCfg;

    updateState(draft => {
      draft.config.components = componentsCfg;
      draft.components = finalComponents;
      //@ts-ignore
      draft.initializer = initializerCfg;
      draft.layoutCache = true;
    });
  }, [componentsCfg]);

  React.useEffect(() => {
    if (!layoutCfg) {
      return;
    }
    // const layout = assets.layouts[layoutCfg.id] || assets.layouts['GraphinForce'];

    // @ts-ignore
    const { type, ...options } = layoutCfg.props || {};

    //@ts-ignore
    let otherOptions = {};
    if (options && options.defSpringLenCfg) {
      //@ts-ignore
      otherOptions = {
        defSpringLen: utils.getDefSpringLenFunction(options.defSpringLenCfg),
      };
    }

    // 资金力导布局定制
    if (layoutCfg.id === 'FundForce') {
      otherOptions = {
        defSideCoe: utils.getDefSideCoeFunction(options.income, options.outcome, options.isLog, options.multiple),
      };
    }

    updateState(draft => {
      draft.layout = {
        type,
        ...options,
        ...otherOptions,
      };
      draft.config.layout = layoutCfg;
      draft.layoutCache = false;
    });
  }, [layoutCfg]);

  /** 增加多元素 */
  React.useEffect(() => {
    if (!nodesCfg || !edgesCfg) {
      return;
    }

    /**
     *
     * @param data 源数据
     * @param reset 是否重置：按照 Node/Edge Schema来视觉映射
     * @returns
     */
    const transform = (data, reset?: boolean) => {
      const nodes = utils.transDataByConfig('nodes', data, { nodes: nodesCfg, edges: edgesCfg }, ElementAssets, reset);
      const edges = utils.transDataByConfig('edges', data, { nodes: nodesCfg, edges: edgesCfg }, ElementAssets, reset);

      return {
        nodes,
        edges,
      };
    };

    updateState(draft => {
      if (draft.data.nodes.length !== 0) {
        const preData = original(draft.data);
        // 当节点和边的Schema配置变化的时候，默认是重置视觉映射;
        const newData = transform(preData, true);
        //@ts-ignore
        draft.data = newData;
      }

      draft.transform = transform;
      draft.config.nodes = nodesCfg;
      draft.config.edges = edgesCfg;
    });
  }, [nodesCfg, edgesCfg]);

  const { data, layout, components, initializer, theme, transform } = state;

  // console.log('%c GraphInsight Render...', 'color:red', state.layout);
  const sourceDataMap = useMemo(() => {
    const nodes = state.source.nodes.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    const edges = state.source.edges.reduce((acc, cur) => {
      acc[cur.id] = cur;
      return acc;
    }, {});

    return {
      nodes,
      edges,
    };
  }, [state.source]);

  const ContextValue = {
    ...state,
    GISDK_ID,
    services: Services,
    assets,
    sourceDataMap,
    updateContext: updateState,
    updateData: res => {
      updateState(draft => {
        draft.data = transform(res);
        draft.source = transform(res);
        draft.layoutCache = false;
      });
    },
    updateLayout: res => {
      updateState(draft => {
        draft.layout = res;
        draft.layoutCache = false;
      });
    },
    updateDataAndLayout: (res, lay) => {
      updateState(draft => {
        draft.data = transform(res);
        draft.source = transform(res);
        draft.layout = lay;
        draft.layoutCache = false;
      });
    },
  };
  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  if (!ComponentAssets) {
    return null;
  }
  const { component: InitializerComponent } = ComponentAssets[initializer.id] || {
    component: DefaultInitializer,
  };
  const { props: InitializerProps } = ComponentCfgMap[initializer.id] || {
    props: defaultInitializerCfg.props,
  };

  const renderComponents = () => {
    if (!state.initialized || !state.isContextReady) {
      return null;
    }

    return components.map(c => {
      const { id, props: itemProps = {} } = c;
      const matchComponent = ComponentAssets[id]; //具体组件的实现
      if (!matchComponent) {
        return null;
      }
      const { component: Component, info } = matchComponent;

      /** 三类原子组件，必须在容器组件中才能渲染，因此不单独渲染 */
      if (itemProps.GIAC_CONTENT || itemProps.GIAC_MENU || itemProps.GIAC) {
        return null;
      }
      if (info.type === 'GIAC_CONTENT' || info.type === 'GIAC' || info.type === 'GIAC_MENU') {
        return null;
      }

      const { GI_CONTAINER } = itemProps;

      let GIProps = {};
      if (GI_CONTAINER) {
        GIProps = {
          components: GI_CONTAINER.map(c => {
            return ComponentCfgMap[c];
          }),
          // assets: ComponentAssets,
        };
      }

      return (
        <Component
          key={id}
          GISDK_ID={GISDK_ID}
          assets={ComponentAssets}
          ComponentCfgMap={ComponentCfgMap}
          {...itemProps}
          {...GIProps}
        />
      );
    });
  };
  const isReady = state.isContextReady && state.initialized;

  const graphData = useMemo(() => {
    const nodeMap = {};
    const edges: any[] = [];
    const nodes: any[] = [];
    data.nodes?.forEach(node => {
      if (!nodeMap[node.id]) {
        nodeMap[node.id] = node;
        nodes.push(node);
      }
    });
    const edgeMap: any[] = [];
    data.edges.forEach(edge => {
      if (nodeMap[edge.source] && nodeMap[edge.target] && !edgeMap[edge.id]) {
        edges?.push(edge);
        edgeMap[edge.id] = edge;
      }
    });
    return {
      nodes,
      edges,
    };
  }, [data]);

  return (
    <GraphInsightContext.Provider value={ContextValue}>
      <div id={`${GISDK_ID}-container`} style={{ width: '100%', height: '100%', ...props.style }}>
        <div id={`${GISDK_ID}-container-extra`}></div>
        <Graphin
          containerId={`${GISDK_ID}-graphin-container`}
          containerStyle={{ transform: 'scale(1)' }}
          data={graphData}
          layout={layout}
          enabledStack={true}
          theme={theme}
          layoutCache={state.layoutCache}
        >
          <>
            {state.isContextReady && <InitializerComponent {...InitializerProps} />}
            <SetupUseGraphinHook updateContext={updateState} />
            {isReady && <CanvasClick />}
            {isReady && renderComponents()}
            {isReady && children}
          </>
        </Graphin>
      </div>
    </GraphInsightContext.Provider>
  );
};
export default React.memo(GISDK);

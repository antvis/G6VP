import Graphin, { GraphinData } from '@antv/graphin';
import React from 'react';
import { useImmer } from 'use-immer';
import { GraphInsightContext, useContext } from './context';
import DefaultInitializer, { defaultInitializerCfg } from './Initializer';
import { registerLayouts, registerShapes } from './register';
import SetupUseGraphinHook from './SetupUseGraphinHook';
import type { Props, State } from './typing';
import { GIComponentConfig } from './typing';
import * as utils from './utils';

const version = '1.0.2';
export { useContext, utils };

console.log(`%c GI_VERSION:${version}`, 'color:red');

const GISDK = (props: Props) => {
  const { children, assets } = props;
  let { services: Services } = props;
  //@ts-ignore
  if (assets.services) {
    console.warn(`⚠️：assets.services 即将废弃，请使用 props.services 代替`);
    //@ts-ignore
    Services = assets.services;
  }

  const { components: ComponentAssets, elements: ElementAssets, layouts: Layouts } = assets;
  registerShapes(ElementAssets);
  registerLayouts(Layouts);

  const [state, updateState] = useImmer<State>({
    data: { nodes: [], edges: [] } as GraphinData,
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
    config: props.config,
    isLoading: false,
    isContextReady: false,
    initialized: false,
    initializer: defaultInitializerCfg,

    /** graphin */
    //@ts-ignore
    graph: null,
    //@ts-ignore
    apis: null,
    //@ts-ignore
    theme: null,
    layoutInstance: null,
  });

  React.useEffect(() => {
    updateState(draft => {
      draft.config = props.config;
    });
  }, [props.config]);

  const { layout: layoutCfg, components: componentsCfg = [], node: nodeCfg, edge: edgeCfg } = state.config;
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
      return [...acc, ...GI_CONTAINER];
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
    });
  }, [componentsCfg]);

  React.useEffect(() => {
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
    updateState(draft => {
      if (draft.data.nodes.length !== 0) {
        const newData = transform(draft.data, { node: nodeCfg, edge: edgeCfg });
        draft.data = newData;
      }
      draft.config.node = nodeCfg;
      draft.config.edge = edgeCfg;
    });
  }, [nodeCfg, edgeCfg]);

  const { data, layout, components, initializer, theme } = state;

  // console.log('%c GraphInsight Render...', 'color:red', state);

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
  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
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
  const isReady = state.isContextReady && state.initialized;

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
          {state.isContextReady && <InitializerComponent {...InitializerProps} />}
          <SetupUseGraphinHook updateContext={updateState} />

          {isReady && renderComponents()}
          {isReady && children}
        </>
      </Graphin>
    </GraphInsightContext.Provider>
  );
};

export default GISDK;

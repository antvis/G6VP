import Graphin, { GraphinContext } from '@antv/graphin';
import { original } from 'immer';
import React, { useEffect, useMemo, useRef } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { useImmer } from 'use-immer';
import { defaultInitializerCfg } from './Initializer';
import getComponents from './hooks/useComponents';
import './index.less';
import * as utils from './process';
import { createUuid } from './process/common';
import type { GIComponentConfig, GIGraphData, Props, State } from './typing';

let updateHistoryTimer: number;

let HAS_INIT = false;

const getComponentsCfg = (componentsCfg, pageLayout) => {
  let GICC_LAYOUT = { id: 'EmptyLayout', props: {} };
  let INITIALIZER;
  if (pageLayout) GICC_LAYOUT = pageLayout;
  componentsCfg.forEach(item => {
    if (pageLayout) {
      if (item.id === pageLayout.id) {
        GICC_LAYOUT = item;
        return;
      }
    } else if (item.type === 'GICC_LAYOUT') {
      GICC_LAYOUT = item;
      return;
    }
    if (item.type === 'INITIALIZER' || item.props.GI_INITIALIZER) {
      INITIALIZER = item;
      return;
    }
  });
  return { componentsCfg, GICC_LAYOUT, INITIALIZER };
};

const getTransformer = (nodesCfg, edgesCfg, ElementAssets) => {
  /**
   *
   * @param data 源数据
   * @param reset 是否重置：按照 Node/Edge Schema来视觉映射
   * @returns
   */
  const transform = (data, reset?: boolean) => {
    const nodes = utils.transDataByConfig('nodes', data, { nodes: nodesCfg, edges: edgesCfg }, ElementAssets, reset);
    const edges = utils.transDataByConfig('edges', data, { nodes: nodesCfg, edges: edgesCfg }, ElementAssets, reset);

    const { combos, tableResult } = data;

    return {
      nodes,
      edges,
      combos,
      tableResult,
    };
  };
  return transform;
};
/** export  */
const GISDK = (props: Props) => {
  const graphRef = useRef(null);
  const { children, assets, id, services, config, locales } = props;
  const { language = 'zh-CN', ...localeMessages } = locales || {};

  const GISDK_ID = React.useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 GISDK_ID : ${defaultId} 用于多实例管理`);
      return defaultId;
    }
    return id;
  }, []);

  const { components: ComponentAssets, elements: ElementAssets, layouts: LayoutAssets } = assets;

  // registerShapes(ElementAssets);
  // registerLayouts(LayoutAssets);

  const [state, updateState] = useImmer<State>({
    data: { nodes: [], edges: [] } as GIGraphData,
    propertyGraphData: undefined,
    schemaData: {
      //会在初始化时候更新
      nodes: [],
      edges: [],
    },
    HAS_GRAPH: false,
    source: { nodes: [], edges: [] } as GIGraphData,
    layout: {},
    components: [] as GIComponentConfig[],
    config: props.config,
    isLoading: false,
    isContextReady: false,
    initialized: false,
    initializer: defaultInitializerCfg,
    transform: (data, reset?: boolean) => data,
    layoutCache: false,
    largeGraphLimit: 2000,
    largeGraphData: undefined,
    GICC_LAYOUT: {
      id: 'EmptyLayout',
      props: {},
    },
    //@ts-ignore
    GISDK_ID,
  });

  const { data, layout, components, initializer, theme, transform, GICC_LAYOUT, HAS_GRAPH, graph } = state;

  // const handleGraphInit = graph => {
  //   updateState(draft => {
  //     draft.graph = graph;
  //     draft.HAS_GRAPH = true;
  //   });
  // };

  useEffect(() => {
    // init...
    if (!HAS_INIT) {
      console.log('%c GISDK INTI ....', 'color:rgba(255,87,34,0.8)', graphRef);
      HAS_INIT = true;
      const { assets, config, services } = props;

      const { GICC_LAYOUT, INITIALIZER, componentsCfg } = getComponentsCfg(config.components, config.pageLayout);
      const transform = getTransformer(config.nodes, config.edges, ElementAssets);

      updateState(draft => {
        /** initializer */
        if (INITIALIZER.id !== draft.initializer?.id) {
          draft.initializer = INITIALIZER;
        }
        /** components */
        draft.config.components = componentsCfg;
        draft.components = componentsCfg;
        /** layout */
        draft.config.layout = config.layout;
        draft.layout = config.layout.props || {};
        draft.layoutCache = false;
        /** styling */
        draft.transform = transform;
        draft.config.nodes = config.nodes;
        draft.config.edges = config.edges;
        if (draft.data.nodes.length !== 0) {
          const preData = original(draft.data);
          // 当节点和边的Schema配置变化的时候，默认是重置视觉映射;
          const newData = transform(preData, true);
          //@ts-ignore
          draft.data = newData;
        }

        draft.GICC_LAYOUT = GICC_LAYOUT;
        /** props */
        draft.config = config;
        draft.servives = services;
        /** flag */
        draft.graph = graphRef.current;
        draft.HAS_GRAPH = true;
      });
    }
  }, []);

  const {
    layout: layoutCfg,
    components: componentsCfg = [],
    nodes: nodesCfg,
    edges: edgesCfg,
    pageLayout,
  } = state.config;
  /** 根据注册的图元素，生成Transform函数 */

  React.useEffect(() => {
    if (!HAS_GRAPH) {
      return;
    }
    console.log('%c GISDK COMPONENTS ....', 'color:rgba(255,87,34,0.8)');
    const { GICC_LAYOUT, INITIALIZER, componentsCfg: ComponentCfg } = getComponentsCfg(componentsCfg, pageLayout);

    updateState(draft => {
      draft.config.components = ComponentCfg;
      draft.components = ComponentCfg;
      if (INITIALIZER.id !== draft.initializer?.id) {
        //@ts-ignore
        draft.initializer = INITIALIZER;
      }
      draft.layoutCache = true;
      //@ts-ignore
      draft.GICC_LAYOUT = GICC_LAYOUT;
    });
  }, [componentsCfg, pageLayout, HAS_GRAPH]);

  React.useEffect(() => {
    if (!layoutCfg || !HAS_GRAPH) {
      return;
    }
    console.log('%c GISDK LAYOUT ....', 'color:rgba(255,87,34,0.8)');
    stopForceSimulation();
    const { type, ...options } = layoutCfg.props || {};
    let otherOptions = {};

    updateState(draft => {
      draft.layout = {
        type,
        ...options,
        ...otherOptions,
        // 保证更新布局，因为有些函数映射的参数在 Graphin 内部被 JSON.stringify 后无法对比出区别
        seed: Math.random(),
      };
      draft.config.layout = layoutCfg;
      draft.layoutCache = false;
    });
  }, [layoutCfg, HAS_GRAPH]);

  /** 增加多元素 */
  React.useEffect(() => {
    if (!nodesCfg || !edgesCfg || nodesCfg.length === 0 || edgesCfg.length === 0 || !HAS_GRAPH) {
      return;
    }
    console.log('%c GISDK STYLE ....', 'color:rgba(255,87,34,0.8)');
    const transform = getTransformer(nodesCfg, edgesCfg, ElementAssets);

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
  }, [nodesCfg, edgesCfg, HAS_GRAPH]);

  // console.log('%c G6VP Render...', 'color:red', state.layout);
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

  const stopForceSimulation = () => {
    // if (graphinRef.current) {
    //   const { layout, graph } = graphinRef.current;
    //   const { instance } = layout;
    //   if (instance) {
    //     const { type, simulation } = instance;
    //     if (type === 'graphin-force') {
    //       simulation.stop();
    //       return;
    //     }
    //   }
    //   const layoutController = graph.get('layoutController');
    //   const layoutMethod = layoutController.layoutMethods?.[0];
    //   if (layoutMethod?.type === 'force2') {
    //     layoutMethod.stop();
    //   }
    // }
  };
  const restartForceSimulation = (nodes = []) => {
    // if (graphinRef.current) {
    //   const { layout: graphLayout, graph } = graphinRef.current;
    //   const { instance } = graphLayout;
    //   if (instance) {
    //     const { type, simulation } = instance;
    //     if (type === 'graphin-force') {
    //       simulation.restart(nodes, graph);
    //       return;
    //     }
    //   }
    //   const layoutController = graph.get('layoutController');
    //   const layoutMethod = layoutController.layoutMethods?.[0];
    //   if (layoutMethod?.type === 'force2') {
    //     graph.updateLayout({ animate: true, disableTriggerLayout: false });
    //     updateState(draft => {
    //       draft.layout.animate = true;
    //     });
    //   }
    // }
  };

  console.log('%c GISDK RENDER....', 'color:rgba(255,87,34,1)', HAS_GRAPH, state.initialized);
  const ContextValue = {
    ...state,
    GISDK_ID,
    services,
    assets,
    sourceDataMap,
    HAS_GRAPH,
    graph: graph,

    updateContext: updateState,
    updateData: res => {
      updateState(draft => {
        const newData = transform(res);
        draft.data = newData;
        draft.source = newData;
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
        const newData = transform(res);
        draft.data = newData;
        draft.source = newData;
        draft.layout = lay;
        draft.layoutCache = false;
      });
    },
    // 更新历史记录
    updateHistory: param => {
      const time = new Date().getTime();

      const fn = () => {
        updateState(draft => {
          // @ts-ignore
          draft.history = (draft.history || []).concat([
            {
              id: createUuid(),
              timestamp: time,
              ...param,
            },
          ]);
        });
      };
      // 防止频繁更新导致的重复 updateHistory
      // 同时，间隔一定时间再更新到历史栈中，保证画布数据已经更新完成
      if (updateHistoryTimer) window.clearTimeout(updateHistoryTimer);
      updateHistoryTimer = window.setTimeout(fn, 500);
    },
    stopForceSimulation: stopForceSimulation,
    restartForceSimulation: restartForceSimulation,
    locales,
    useIntl,
    language,
  };
  if (!ComponentAssets) {
    return null;
  }

  const { renderComponents, InitializerComponent, InitializerProps, GICC_LAYOUT_COMPONENT, GICC_LAYOUT_PROPS } =
    getComponents({ ...state, HAS_GRAPH }, config.components, ComponentAssets);

  return (
    <div id={`${GISDK_ID}-container`} style={{ width: '100%', height: '100%', position: 'relative', ...props.style }}>
      {/* @ts-ignore */}
      <IntlProvider locale={language as string} messages={localeMessages as any}>
        {/* @ts-ignore */}

        <GraphinContext.Provider value={ContextValue}>
          <GICC_LAYOUT_COMPONENT {...GICC_LAYOUT_PROPS}>
            <Graphin
              container={`${GISDK_ID}-graphin-container`}
              style={{ transform: 'scale(1)' }}
              data={data}
              //@ts-ignore
              layout={layout}
              // onInit={handleGraphInit}
              ref={graphRef}
            />
            {HAS_GRAPH && <InitializerComponent {...InitializerProps} />}
            {HAS_GRAPH && state.initialized && renderComponents()}
            {HAS_GRAPH && state.initialized && children}
          </GICC_LAYOUT_COMPONENT>
        </GraphinContext.Provider>
      </IntlProvider>
    </div>
  );
};
export default React.memo(GISDK);

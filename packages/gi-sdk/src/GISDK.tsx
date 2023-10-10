import Graphin, { GraphinContext } from '@antv/graphin';
import React, { useEffect, useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { useImmer } from 'use-immer';
import { deepClone } from './components/const';
import getComponents from './hooks/useComponents';
import './index.less';
import { createUuid } from './process/common';
import { getMapperByCfg } from './process/getMapperByCfg';
import type { GIGraphData, Props, State } from './typing';

let updateHistoryTimer: number;

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

const GISDK = (props: Props) => {
  const { children, assets, id, services, locales } = props;
  const { language = 'zh-CN', ...localeMessages } = locales || {};

  /** get gisdk id */
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
    config: props.config,
    isLoading: false,
    isContextReady: false,
    initialized: false,
    layoutCache: false,
    largeGraphLimit: 2000,
    largeGraphData: undefined,
    //@ts-ignore
    nodeMapper: null,
  });

  const { data, HAS_GRAPH, graph, config } = state;
  /** 计算逻辑 */
  const { layout: layoutCfg, components: componentsCfg = [], nodes: nodesCfg, edges: edgesCfg, pageLayout } = config;

  const handleGraphInit = ins => {
    updateState(draft => {
      draft.graph = ins;
      draft.HAS_GRAPH = true;
    });
  };

  useEffect(() => {
    console.log('gisdk props config change.....');
    updateState(draft => {
      draft.config = props.config;
    });
  }, [props.config]);

  const { GICC_LAYOUT, INITIALIZER, ComponentCfg } = useMemo(() => {
    const { GICC_LAYOUT, INITIALIZER, componentsCfg: ComponentCfg } = getComponentsCfg(componentsCfg, pageLayout);
    return {
      GICC_LAYOUT,
      INITIALIZER,
      ComponentCfg,
    };
  }, [componentsCfg, pageLayout, HAS_GRAPH]);

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

  console.log('%c GISDK RENDER....', 'color:rgba(255,87,34,1)', HAS_GRAPH, state.initialized, state);

  const layout = useMemo(() => {
    return deepClone(layoutCfg.props);
  }, [layoutCfg]);

  const { renderComponents, InitializerComponent, InitializerProps, GICC_LAYOUT_COMPONENT, GICC_LAYOUT_PROPS } =
    getComponents({
      config: { pageLayout, components: ComponentCfg },
      initializer: INITIALIZER,
      GICC_LAYOUT,
      components: ComponentCfg,
      GISDK_ID,
      propsComponentsCfg: ComponentCfg,
      ComponentAssets,
    });

  /** 节点样式映射 */
  const nodeMapper = useMemo(() => getMapperByCfg(nodesCfg, ElementAssets), [nodesCfg]);
  /** 边样式映射 */
  const edgeMapper = useMemo(() => getMapperByCfg(edgesCfg, ElementAssets), [edgesCfg]);

  const ContextValue = {
    ...state,
    layout,
    GISDK_ID,
    services,
    assets,
    sourceDataMap,
    HAS_GRAPH,
    graph,
    updateContext: updateState,
    updateData: res => {
      updateState(draft => {
        const newData = res;
        draft.data = newData;
        draft.source = newData;
        draft.layoutCache = false;
      });
    },
    updateLayout: res => {
      updateState(draft => {
        draft.config.layout = res;
        draft.layoutCache = false;
      });
    },
    updateDataAndLayout: (res, lay) => {
      updateState(draft => {
        const newData = res;
        draft.data = newData;
        draft.source = newData;
        draft.config.layout = lay;
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
              //@ts-ignore
              node={nodeMapper}
              edge={edgeMapper}
              data={data}
              //@ts-ignore
              layout={layout}
              onInit={handleGraphInit}
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

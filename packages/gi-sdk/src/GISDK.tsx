import Graphin, { GraphinData } from '@antv/graphin';
import { original } from 'immer';
import React, { useMemo } from 'react';
import { useImmer } from 'use-immer';
import FitCenterAfterMount from './components/FitCenterAfterMount';
import { GraphInsightContext } from './context';
import getComponents from './hooks/useComponents';
import './index.less';
import { defaultInitializerCfg } from './Initializer';
import * as utils from './process';
import { registerLayouts, registerShapes } from './register';
import SizeSensor from './SizeSensor';
import type { Props, State } from './typing';
import { GIComponentConfig } from './typing';

/** export  */
const GISDK = (props: Props) => {
  const graphinRef = React.useRef<null | Graphin>(null);
  // @ts-ignore
  const { children, assets, id, services, config } = props;

  const GISDK_ID = React.useMemo(() => {
    if (!id) {
      const defaultId = `${Math.random().toString(36).substr(2)}`;
      console.warn(`⚠️: props.id 缺失，默认生成 GISDK_ID : ${defaultId} 用于多实例管理`);
      return defaultId;
    }
    return id;
  }, []);

  const { components: ComponentAssets, elements: ElementAssets, layouts: LayoutAssets } = assets;

  registerShapes(ElementAssets);
  registerLayouts(LayoutAssets);

  const [state, updateState] = useImmer<State>({
    data: { nodes: [], edges: [] } as GraphinData,
    propertyGraphData: undefined,
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
    GICC_LAYOUT: {
      id: 'EmptyLayout',
      props: {},
    },
    //@ts-ignore
    GISDK_ID,
  });

  React.useEffect(() => {
    updateState(draft => {
      draft.config = props.config;
    });
  }, [props.config]);

  const {
    layout: layoutCfg,
    components: componentsCfg = [],
    nodes: nodesCfg,
    edges: edgesCfg,
    pageLayout,
  } = state.config;
  /** 根据注册的图元素，生成Transform函数 */

  React.useEffect(() => {
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

    updateState(draft => {
      draft.config.components = componentsCfg;
      draft.components = componentsCfg;
      if (INITIALIZER.id !== draft.initializer?.id) {
        //@ts-ignore
        draft.initializer = INITIALIZER;
      }
      draft.layoutCache = true;
      //@ts-ignore
      draft.GICC_LAYOUT = GICC_LAYOUT;
    });
  }, [componentsCfg, pageLayout]);

  React.useEffect(() => {
    if (!layoutCfg) {
      return;
    }
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
    if (!nodesCfg || !edgesCfg || nodesCfg.length === 0 || edgesCfg.length === 0) {
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
      const { combos, tableResult } = data;
      return {
        nodes,
        edges,
        combos,
        tableResult,
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

  const { data, layout, components, initializer, theme, transform, GICC_LAYOUT } = state;

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
    if (graphinRef.current) {
      const { layout } = graphinRef.current;
      const { instance } = layout;
      if (instance) {
        const { type, simulation } = instance;
        if (type === 'graphin-force') {
          simulation.stop();
        }
      }
    }
  };
  const restartForceSimulation = (nodes = []) => {
    if (graphinRef.current) {
      const { layout, graph } = graphinRef.current;
      const { instance } = layout;
      if (instance) {
        const { type, simulation } = instance;
        if (type === 'graphin-force') {
          simulation.restart(nodes, graph);
        }
      }
    }
  };
  const ContextValue = {
    ...state,
    GISDK_ID,
    services,
    assets,
    sourceDataMap,
    graph: graphinRef.current?.graph,
    theme: graphinRef.current?.theme,
    apis: graphinRef.current?.apis,
    layoutInstance: graphinRef.current?.layout,
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
    stopForceSimulation: stopForceSimulation,
    restartForceSimulation: restartForceSimulation,
  };
  if (!ComponentAssets) {
    return null;
  }

  const { renderComponents, InitializerComponent, InitializerProps, GICC_LAYOUT_COMPONENT, GICC_LAYOUT_PROPS } =
    getComponents(state, config.components, ComponentAssets);

  const graphData = useMemo(() => {
    const nodeMap = {};
    const edgeMap = {};
    const edges: any[] = [];
    const nodes: any[] = [];
    data.nodes?.forEach(node => {
      if (!nodeMap[node.id]) {
        nodes.push(node);
        nodeMap[node.id] = node;
      }
    });

    data.edges.forEach(edge => {
      if (nodeMap[edge.source] && nodeMap[edge.target] && !edgeMap[edge.id]) {
        edges?.push(edge);
        edgeMap[edge.id] = edge;
      }
    });
    const { combos } = data;
    return {
      nodes,
      edges,
      combos,
    };
  }, [data]);

  const HAS_GRAPH = !(
    graphinRef &&
    graphinRef.current &&
    graphinRef.current.graph &&
    graphinRef.current.graph.destroyed
  );

  return (
    //@ts-ignore
    <GraphInsightContext.Provider value={ContextValue}>
      <GICC_LAYOUT_COMPONENT {...GICC_LAYOUT_PROPS}>
        <div
          id={`${GISDK_ID}-container`}
          style={{ width: '100%', height: '100%', position: 'relative', ...props.style }}
        >
          <Graphin
            ref={graphinRef}
            containerId={`${GISDK_ID}-graphin-container`}
            containerStyle={{ transform: 'scale(1)' }}
            data={graphData}
            layout={layout}
            enabledStack={true}
            theme={theme}
            layoutCache={state.layoutCache}
            style={{ borderRadius: '8px', overflow: 'hidden' }}
            willUnmount={() => {
              console.log('un mount....');
            }}
          >
            <>
              {HAS_GRAPH && <InitializerComponent {...InitializerProps} />}
              {HAS_GRAPH && state.initialized && <SizeSensor />}
              {/* <SetupUseGraphinHook updateContext={updateState} /> */}
              {HAS_GRAPH && state.initialized && renderComponents()}
              {HAS_GRAPH && state.initialized && <FitCenterAfterMount />}
              {HAS_GRAPH && state.initialized && children}
            </>
          </Graphin>
        </div>
      </GICC_LAYOUT_COMPONENT>
    </GraphInsightContext.Provider>
  );
};
export default React.memo(GISDK);

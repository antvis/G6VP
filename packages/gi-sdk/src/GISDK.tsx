import Graphin, { GraphinContext } from '@antv/graphin';
import React, { useEffect, useMemo } from 'react';
import { IntlProvider, useIntl } from 'react-intl';
import { useImmer } from 'use-immer';
import SizeSensor from './SizeSensor';
import { deepClone } from './components/const';
import { getComponents } from './hooks/useComponents';
import useConstant from './hooks/useConstant';
import './index.less';
import { getMapperByCfg } from './process/getMapperByCfg';
import type { GIGraphData, Props, State } from './typing';
const GISDK = (props: Props) => {
  const { children, assets, id, services, locales } = props;
  const { components: ComponentAssets, elements: ElementAssets, layouts: LayoutAssets } = assets;
  const { language = 'zh-CN', ...localeMessages } = locales || {};

  // registerShapes(ElementAssets);
  // registerLayouts(LayoutAssets);

  const [state, updateState] = useImmer<State>({
    config: props.config,
    layout: props.config.layout.props,
    data: { nodes: [], edges: [] } as GIGraphData,
    propertyGraphData: undefined,
    schemaData: {
      //会在初始化时候更新
      nodes: [],
      edges: [],
    },
    HAS_GRAPH: false,
    source: { nodes: [], edges: [] } as GIGraphData,

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
  const constants = useConstant(id, state, updateState);
  const { GISDK_ID } = constants;

  /**
   * 响应 props.config 变化
   */
  useEffect(() => {
    console.log('gisdk props config change.....');
    updateState(draft => {
      draft.config = props.config;
      //@ts-ignore
      draft.layout = props.config.layout.props;
    });
  }, [props.config]);

  /**
   *  响应 graph 的变化
   */
  const handleGraphInit = ({ graph, apis }) => {
    //@ts-ignore
    window.graph = graph;
    updateState(draft => {
      draft.graph = graph;
      draft.apis = apis;
      draft.HAS_GRAPH = true;
    });
  };

  /**
   * 响应 config.components 变化，重新渲染组件
   */
  const { renderComponents, InitializerComponent, InitializerProps, GICC_LAYOUT_COMPONENT, GICC_LAYOUT_PROPS } =
    useMemo(() => {
      const a = getComponents(componentsCfg, pageLayout, ComponentAssets);

      return a;
    }, [componentsCfg, pageLayout, HAS_GRAPH]);

  /**
   * 响应 config.layout 变化，重新布局
   */
  const layout = useMemo(() => {
    return deepClone(layoutCfg.props);
  }, [layoutCfg]);

  /**
   * 响应 config.nodes 变化，重新设置节点样式
   */
  const nodeMapper = useMemo(() => getMapperByCfg(nodesCfg, ElementAssets), [nodesCfg]);
  /**
   * 响应 config.edges 变化，重新设置节点样式
   */
  const edgeMapper = useMemo(() => getMapperByCfg(edgesCfg, ElementAssets), [edgesCfg]);

  /**
   * 组装 context value
   */
  const ContextValue = {
    ...state,
    ...constants,
    layout,
    GISDK_ID,
    HAS_GRAPH,
    graph,
    updateContext: updateState,
    /** props */
    assets,
    services,
    locales,
    useIntl,
    language,
  };
  console.log('%c GISDK RENDER....', 'color:rgba(255,87,34,1)', HAS_GRAPH, state.initialized);
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
            {HAS_GRAPH && state.initialized && renderComponents}
            {HAS_GRAPH && state.initialized && children}
            {HAS_GRAPH && state.initialized && <SizeSensor />}
          </GICC_LAYOUT_COMPONENT>
        </GraphinContext.Provider>
      </IntlProvider>
    </div>
  );
};
export default React.memo(GISDK);

import Graphin, { GraphinContext, GraphinData } from '@antv/graphin';
import React from 'react';
import CanvasClick from './components/CanvasClick';
import getComponentsFromMarket from './components/index';
import meta from './components/meta';
import transform from './transfrom';
import { GIComponentConfig, GIConfig, GIService } from './typing';

export interface Props {
  /**
   * @description 配置信息
   */
  config: GIConfig;
  services: GIService;
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

const GISDK = (props: Props) => {
  const { config, services, children } = props;

  const [state, setState] = React.useState({
    data: { nodes: [], edges: [] } as GraphinData,
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
  });

  const { layout: layoutCfg, components: componentsCfg = [], node: nodeCfg, edge: edgeCfg } = config;

  /** 数据发生改变 */
  React.useEffect(() => {
    services.getGraphData().then((res = { nodes: [], edges: [] }) => {
      setState(preState => {
        return {
          ...preState,
          data: transform(res, config),
          source: { ...res },
        };
      });
    });
  }, []);

  /** 节点和边的配置发生改变 */
  React.useEffect(() => {
    const filteredComponents = componentsCfg.filter(c => c.enable);
    setState(preState => {
      return {
        ...preState,
        components: filteredComponents,
      };
    });
  }, [componentsCfg]);
  /** 布局发生改变 */
  React.useEffect(() => {
    const { type, options } = layoutCfg?.props || {};
    setState(preState => {
      return {
        ...preState,
        layout: {
          type: type,
          ...options,
        },
      };
    });
  }, [layoutCfg]);

  React.useEffect(() => {
    setState(preState => {
      const { source } = preState;
      if (source.nodes.length === 0) {
        return preState;
      }
      return {
        ...preState,
        data: transform(preState.source, { node: nodeCfg, edge: edgeCfg }),
      };
    });
  }, [nodeCfg, edgeCfg]);

  const { data, layout, components } = state;

  /** 计算 用户选择的组件 */
  let componentsMarket = [];
  if (components.length !== 0) {
    componentsMarket = getComponentsFromMarket(config);
  }

  //@ts-ignore 临时方案
  GraphinContext.services = services;
  //@ts-ignore 临时方案
  GraphinContext.dispatch = {
    changeData: inputData => {
      setState(preState => {
        return {
          ...preState,
          data: transform(inputData, config),
        };
      });
    },
  };

  return (
    <Graphin data={data} layout={layout} enabledStack={true}>
      {/** 内置的组件 */}
      <CanvasClick />
      {/** 用户从组件市场里选择的组件  */}
      {components.map(c => {
        const { id, props: itemProps } = c;
        const {
          component: Component,
          props: defaultProps,
        }: {
          component: typeof React.Component;
          props: any;
        } = componentsMarket[id];
        return <Component key={id} {...defaultProps} {...itemProps} />;
      })}

      {/** 用户二次定制开发的组件  */}
      {children}
    </Graphin>
  );
};

export const GIContext = GraphinContext;
export const GIComponents = getComponentsFromMarket;
export const GIComponentsMeta = meta;
export default GISDK;

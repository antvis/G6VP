import Graphin, { GraphinContext, GraphinData } from '@antv/graphin';
import React from 'react';
import * as mock from './mock';
/** 组件 */
// import * as Components from './components';
/** 元素 */
// import * as Elements from './elements';
import { GIComponentConfig, GIConfig, GIService } from './typing';

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
  };
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

let registered = false;
const registerShapes = Elements => {
  if (!registered) {
    console.log('%c register! ', 'color:green');
    Object.keys(Elements).forEach(type => {
      Elements[type].registerShape(Graphin);
    });
    registered = true;
  }
};

const GISDK = (props: Props) => {
  const { config, children, assets } = props;
  const { components: Components, elements: Elements, services: Services } = assets;
  registerShapes(Elements);

  const [state, setState] = React.useState({
    data: { nodes: [], edges: [] } as GraphinData,
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
  });

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
    const { service } = Services.find(s => s.id === 'GI_SERVICE_INTIAL_GRAPH') as GIService;

    service().then((res = { nodes: [], edges: [] }) => {
      setState(preState => {
        const newData = transform(res, config);
        return {
          ...preState,
          data: newData,
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
      if (preState.data.nodes.length === 0) {
        return preState;
      }
      const newData = transform(preState.data, { node: nodeCfg, edge: edgeCfg });
      return {
        ...preState,
        data: newData,
      };
    });
  }, [nodeCfg, edgeCfg]);

  const { data, layout, components } = state;

  //@ts-ignore 临时方案
  GraphinContext.services = Services;
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
  GraphinContext.GiState = state;
  GraphinContext.setGiState = setState;

  return (
    //@ts-ignore
    <Graphin data={data} layout={layout} enabledStack={true} theme={{ mode: 'light', primaryColor: '#fb08c6' }}>
      {/** 内置的组件 */}

      {/** 用户从组件市场里选择的组件  */}
      {components.map(c => {
        const { id, props: itemProps } = c;
        const matchComponent = Components[id];
        if (!matchComponent) {
          return null;
        }

        const {
          component: Component,
          props: defaultProps,
        }: {
          component: typeof React.Component;
          props: any;
        } = matchComponent;
        return <Component key={id} {...defaultProps} {...itemProps} />;
      })}

      {/** 用户二次定制开发的组件  */}
      {children}
    </Graphin>
  );
};

// export const useContext = () => {
//   const context = React.useContext(GraphinContext);
//   //@ts-ignore
//   const { dispatch, services } = GraphinContext;
//   return {
//     ...context,
//     dispatch,
//     services,
//   };
// };

export const Mock = mock;

export default GISDK;

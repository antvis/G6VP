import Graphin, { GraphinContext, GraphinData } from '@antv/graphin';
import React from 'react';
import * as mock from './mock';
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

    layouts: any;
  };
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

let registeredShapes = '';
let registeredLayouts = '';

const registerShapes = Elements => {
  if (Elements) {
    const nextShapes = Object.keys(Elements).join('-');
    const prevShapes = registeredShapes;
    if (nextShapes !== prevShapes) {
      console.log('%c register Layout! ', 'color:green');
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

const GISDK = (props: Props) => {
  const { config, children, assets } = props;
  const { components: Components, elements: Elements, services: Services, layouts: Layouts } = assets;
  registerShapes(Elements);
  registerLayouts(Layouts);

  const [state, setState] = React.useState({
    data: { nodes: [], edges: [] } as GraphinData,
    source: { nodes: [], edges: [] } as GraphinData,
    layout: {},
    components: [] as GIComponentConfig[],
    isReady: false,
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
          isReady: true,
        };
      });
    });
  }, []);

  /** 节点和边的配置发生改变 */
  React.useEffect(() => {
    const filteredComponents = componentsCfg; //.filter(c => c.enable);
    /** start 针对容器组件特殊处理 */
    const containerComponents = filteredComponents.filter(c => {
      return c.props.GI_CONTAINER;
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

    setState(preState => {
      return {
        ...preState,
        components: finalComponents,
      };
    });
  }, [componentsCfg]);
  /** 布局发生改变 */

  React.useEffect(() => {
    const { type, ...options } = layoutCfg?.props || {};

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

  const { data, layout, components, isReady } = state;

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
  //@ts-ignore
  GraphinContext.GiState = state;
  //@ts-ignore
  GraphinContext.setGiState = setState;

  const ComponentCfgMap = componentsCfg.reduce((acc, curr) => {
    return {
      ...acc,
      [curr.id]: curr,
    };
  }, {});
  console.log('%c gi render...', 'color:red', props);
  if (!isReady) {
    return <div>render...</div>;
  }
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

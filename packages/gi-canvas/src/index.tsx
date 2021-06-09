import Graphin, { GraphinContext, GraphinData } from '@antv/graphin';
import React from 'react';
import CanvasClick from './components/CanvasClick';
import getComponentsFromMarket from './components/index';
import transform from './transfrom';

export interface Props {
  /**
   * @description 配置信息
   */
  config: any;
  services: {
    /** 获取初始化接口 */
    getGraphData: () => Promise<any>;
    /** 根据ID集合获取节点或边的详情信息 */
    getSubGraphData?: (ids: string[]) => Promise<any>;
    /** 获取一度下钻数据 */
    getExploreGraphByDegree?: (degree: number, id: string) => Promise<any>;
  };
  children?: React.ReactChildren | JSX.Element | JSX.Element[];
}

const GISDK = (props: Props) => {
  const { config, services, children } = props;

  const [state, setState] = React.useState({
    data: {} as GraphinData,
    layout: {
      type: config.layout.id,
      ...config.layout.options,
    },
    components: [],
  });
  const { data, layout, components } = state;

  React.useEffect(() => {
    console.log('did mount');
    services.getGraphData().then(res => {
      setState(preState => {
        return {
          ...preState,
          data: transform(res, config),
        };
      });
    });
  }, []);

  React.useEffect(() => {
    console.log('config change..');
    const { components } = config;
    const filteredComponents = components.filter(c => c.enable);
    setState(preState => {
      return {
        ...preState,
        components: filteredComponents,
      };
    });
  }, [config]);

  /** 计算 用户选择的组件 */
  const componentsMarket = getComponentsFromMarket(config);

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
    <div>
      <Graphin data={data} layout={layout}>
        {/** 内置组件  */}
        <CanvasClick />

        {/** 用户从组件市场里选择的组件  */}
        {components.map(c => {
          const { id } = c;
          const {
            component: Component,
            props: defaultProps,
          }: {
            component: typeof React.Component;
            props: any;
          } = componentsMarket[id];
          return <Component key={id} {...defaultProps} {...props} />;
        })}

        {/** 用户二次定制开发的组件  */}
        {children}
      </Graphin>
    </div>
  );
};

export const GIContext = GraphinContext;
export default GISDK;

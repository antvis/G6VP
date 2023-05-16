/**
 * 该文件是专门处理用户自定义资产，自定义服务
 */
import { GIAssets, GIConfig } from '@antv/gi-sdk';
/** 自定义数据服务 */
import MyServer from '../services/index';
/** 自定义资产 */
import { Counter, MyLayout } from '../components';

const update = (defaultAssets: GIAssets, defaultConfig: GIConfig, defaultEngine) => {
  /** 更新资产 */
  const assets = {
    ...defaultAssets,
    components: {
      ...defaultAssets.components,
      // 将自定义组件加入到资产包中
      Counter, // 如果资产id和文件名一致，可以这样简写，因为实际是这样的： [Counter.info.id]: Counter,
      MyLayout,
    },
  };

  /** 更新配置：消费上述的资产 */
  const config = {
    ...defaultConfig,
    components: [
      ...defaultConfig.components,
      {
        id: 'Counter',
        type: 'AUTO',
        props: {},
      },
      {
        id: 'MyLayout',
        type: 'GICC_LAYOUT',
        props: {
          containers: [],
        },
      },
    ],
  };

  /** 更新引擎服务 */
  const engine = [...defaultEngine, MyServer];

  /** 更新服务的配置 */
  config.components.forEach(item => {
    if (item.id === 'Initializer') {
      //改写服务的ID
      //@ts-ignore
      item.props.serviceId = `${MyServer.id}/GI_SERVICE_INTIAL_GRAPH`;
      //@ts-ignore
      item.props.schemaServiceId = `${MyServer.id}/GI_SERVICE_SCHEMA`;
    }
  });

  return {
    assets,
    config,
    engine,
  };
};

export default update;

import { utils } from '@antv/gi-sdk';
import info from './info';

export default context => {
  const { services, engineId } = context;
  const { options: initializerServiceOptions, defaultValue: defaultInitializerService } =
    utils.getServiceOptionsByEngineId(services, info.services[0], engineId);
  const { options: schemaServiceOptions, defaultValue: defaultschemaService } = utils.getServiceOptionsByEngineId(
    services,
    info.services[1],
    engineId,
  );
  return {
    serviceId: {
      title: '初始化查询',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: initializerServiceOptions,
      },
      default: defaultInitializerService,
    },
    schemaServiceId: {
      title: '查询图模型',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: schemaServiceOptions,
      },
      default: defaultschemaService,
    },

    // 注意⚠️：GI_INITIALIZER 是必须的属性字段，千万不要漏掉
    GI_INITIALIZER: {
      title: '默认启动',
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        disabled: true,
      },
      default: true,
    },
    aggregate: {
      title: '汇总边',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
  };
};

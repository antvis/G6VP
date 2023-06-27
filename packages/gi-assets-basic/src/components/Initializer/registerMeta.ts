import { utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

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
      title: $i18n.get({ id: 'basic.components.Initializer.registerMeta.InitializeAQuery', dm: '初始化查询' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: initializerServiceOptions,
      },
      default: defaultInitializerService,
    },
    schemaServiceId: {
      title: $i18n.get({ id: 'basic.components.Initializer.registerMeta.QueryGraphModel', dm: '查询图模型' }),
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
      title: $i18n.get({ id: 'basic.components.Initializer.registerMeta.DefaultStartup', dm: '默认启动' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      'x-component-props': {
        disabled: true,
      },
      default: true,
    },
    aggregate: {
      title: $i18n.get({ id: 'basic.components.Initializer.registerMeta.SummaryEdge', dm: '汇总边' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    transByFieldMapping: {
      title: $i18n.get({ id: 'basic.components.Initializer.registerMeta.EnableFieldMapping', dm: '开启字段映射' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
  };
};

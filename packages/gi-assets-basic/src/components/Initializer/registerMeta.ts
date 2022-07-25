import { utils } from '@alipay/graphinsight';
import info from './info';

export default context => {
  const { services, serviceEngine = 'GI' } = context;
  const initializerServiceOptions = utils.getServiceOptions(services, info.services[0]);
  const schemaServiceOptions = utils.getServiceOptions(services, info.services[1]);

  return {
    serviceId: {
      title: '初始化查询',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: initializerServiceOptions,
      },
      default: initializerServiceOptions[0].value,
    },
    schemaServiceId: {
      title: '查询图模型',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: schemaServiceOptions,
      },
      default: schemaServiceOptions[0].value,
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
  };
};

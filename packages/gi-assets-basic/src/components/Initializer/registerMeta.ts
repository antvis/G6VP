import { utils } from '@alipay/graphinsight';
import info from './info';

export default context => {
  const { services, serviceEngine = 'GraphInsight' } = context;
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
    degree: {
      title: '查询度数',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: '1',
            label: '一度查询',
          },
          {
            value: '2',
            label: '二度查询',
          },
          {
            value: '3',
            label: '三度查询',
          },
        ],
      },
      default: '1',
    },
    isFocus: {
      title: '是否聚焦到扩散点',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
  };
};

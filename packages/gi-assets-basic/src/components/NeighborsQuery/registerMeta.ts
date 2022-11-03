import { utils } from '@antv/gi-sdk';
import info from './info';

interface Service {
  id: string;
  service: Promise<any>;
}
export default context => {
  const { services, engineId } = context;
  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);

  return {
    serviceId: {
      title: '数据服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: defaultValue,
      'x-component-props': {
        options: options,
      },
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

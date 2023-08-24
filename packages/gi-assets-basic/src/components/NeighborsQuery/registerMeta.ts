import { utils } from '@antv/gi-sdk';
import $i18n from '../../i18n';
import info from './info';

interface Service {
  id: string;
  service: Promise<any>;
}
export default context => {
  const { services, engineId } = context;
  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);

  const { options: menuOptions, defaultValue: defaultMenuValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[1],
    engineId,
  );

  return {
    serviceId: {
      title: $i18n.get({ id: 'basic.components.NeighborsQuery.registerMeta.DataService', dm: '数据服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: defaultValue,
      'x-component-props': {
        options: options,
      },
    },
    menuServiceId: {
      title: $i18n.get({ id: 'basic.components.NeighborsQuery.registerMeta.ConditionalService', dm: '条件服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      default: defaultMenuValue,
      'x-component-props': {
        options: menuOptions,
      },
    },
    degree: {
      title: $i18n.get({ id: 'basic.components.NeighborsQuery.registerMeta.QueryableDegrees', dm: '限定度数' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 1,
            label: 1,
          },
          {
            value: 2,
            label: 2,
          },
          {
            value: 3,
            label: 3,
          },
        ],
      },
      default: 3,
    },
    isFocus: {
      title: $i18n.get({
        id: 'basic.components.NeighborsQuery.registerMeta.WhetherToFocusOnThe',
        dm: '是否聚焦到扩散点',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: true,
    },
    limit: {
      title: $i18n.get({ id: 'basic.components.NeighborsQuery.registerMeta.LimitedQuantity', dm: '限制数量' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 100,
    },
  };
};

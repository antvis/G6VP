import { utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

const registerMeta = context => {
  const { services, engineId, hasPropertyGraph } = context;

  const { options, defaultValue } = utils.getServiceOptionsByEngineId(services, info.services[0], engineId);

  const schema = {
    serviceId: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.DataService', dm: '数据服务' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: options,
      },
      default: defaultValue,
    },

    enableInfoDetect: hasPropertyGraph
      ? {
          title: $i18n.get({
            id: 'basic.components.PropertiesPanel.registerMeta.AttributeRecommendation',
            dm: '属性推荐',
          }),
          type: 'string',
          'x-decorator': 'FormItem',
          'x-component': 'Switch',
          default: true,
        }
      : undefined,

    defaultiStatistic: {
      title: $i18n.get({
        id: 'basic.components.PropertiesPanel.registerMeta.StatisticsAreDisplayedByDefault',
        dm: '默认展示统计信息',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
    title: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Title', dm: '标题' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.PropertiesPanel', dm: '属性面板' }),
    },
    placement: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.DisplayOrientation', dm: '展示方位' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            label: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Left', dm: '左部' }),
            value: 'LB',
          },
          {
            label: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Right', dm: '右部' }),
            value: 'RT',
          },
          {
            label: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.UpperPart', dm: '上部' }),
            value: 'LT',
          },
          {
            label: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Bottom', dm: '底部' }),
            value: 'RB',
          },
        ],
      },
      default: 'LB',
    },
    width: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Width', dm: '宽度' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: '500px',
    },
    height: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.Height', dm: '高度' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Input',
      default: 'calc(100% - 80px)',
    },
    offset: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.OffsetDistance', dm: '偏移距离' }),
      type: 'array',
      'x-decorator': 'FormItem',
      'x-component': 'Offset',
      default: [10, 10],
    },
    animate: {
      title: $i18n.get({ id: 'basic.components.PropertiesPanel.registerMeta.DrawerAnimation', dm: '抽屉动画' }),
      type: 'boolean',
      'x-decorator': 'FormItem',
      'x-component': 'Switch',
      default: false,
    },
  };

  if (!hasPropertyGraph) delete schema.enableInfoDetect;

  return schema;
};

export default registerMeta;

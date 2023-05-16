import { utils } from '@antv/gi-sdk';
import info from './info';

const registerMeta = context => {
  const { services, engineId } = context;
  const { options: saveOptions, defaultValue: saveDefaultValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[0],
    engineId,
  );
  const { options: listOptions, defaultValue: listDefaultValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[1],
    engineId,
  );
  const { options: removeOptions, defaultValue: removeDefaultValue } = utils.getServiceOptionsByEngineId(
    services,
    info.services[2],
    engineId,
  );

  return {
    saveTemplateServiceId: {
      title: '保存分析历史模版服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: saveOptions,
      },
      default: saveDefaultValue,
    },
    listTemplateServiceId: {
      title: '读取分析历史模版列表服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: listOptions,
      },
      default: listDefaultValue,
    },
    removeTemplateServiceId: {
      title: '删除分析历史模版服务',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: removeOptions,
      },
      default: removeDefaultValue,
    },
    placement: {
      title: '放置方位',
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'top',
            label: '顶部',
          },
          {
            value: 'bottom',
            label: '底部',
          },
        ],
      },
      default: 'bottom',
    },
    height: {
      title: '历史栏高度',
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 40,
    },
  };
};

export default registerMeta;

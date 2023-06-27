import { utils } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../../i18n';

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
      title: $i18n.get({
        id: 'advance.components.AnalysisHistory.registerMeta.SaveAnalysisHistoryTemplateService',
        dm: '保存分析历史模版服务',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: saveOptions,
      },
      default: saveDefaultValue,
    },
    listTemplateServiceId: {
      title: $i18n.get({
        id: 'advance.components.AnalysisHistory.registerMeta.ReadAnalysisHistoryTemplateList',
        dm: '读取分析历史模版列表服务',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: listOptions,
      },
      default: listDefaultValue,
    },
    removeTemplateServiceId: {
      title: $i18n.get({
        id: 'advance.components.AnalysisHistory.registerMeta.DeleteAnalysisHistoryTemplateService',
        dm: '删除分析历史模版服务',
      }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: removeOptions,
      },
      default: removeDefaultValue,
    },
    placement: {
      title: $i18n.get({ id: 'advance.components.AnalysisHistory.registerMeta.PlacementOrientation', dm: '放置方位' }),
      type: 'string',
      'x-decorator': 'FormItem',
      'x-component': 'Select',
      'x-component-props': {
        options: [
          {
            value: 'top',
            label: $i18n.get({ id: 'advance.components.AnalysisHistory.registerMeta.Top', dm: '顶部' }),
          },
          {
            value: 'bottom',
            label: $i18n.get({ id: 'advance.components.AnalysisHistory.registerMeta.Bottom', dm: '底部' }),
          },
        ],
      },
      default: 'bottom',
    },
    height: {
      title: $i18n.get({ id: 'advance.components.AnalysisHistory.registerMeta.HistoryBarHeight', dm: '历史栏高度' }),
      type: 'number',
      'x-decorator': 'FormItem',
      'x-component': 'NumberPicker',
      default: 40,
    },
  };
};

export default registerMeta;

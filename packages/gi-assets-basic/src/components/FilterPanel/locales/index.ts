import { LANGUAGE_KEY_NAME } from '@antv/gi-sdk';

const enUS = {
  'FilterPanel.addfilter': 'Add filter',
  'FilterPanel.selectElementAttr': 'Select element attributes',
  'FilterPanel.selectFilterValue': 'Select filter value',
  'FilterPanel.selectValidField': 'Please select a valid field',
  'FilterPanel.node': 'node',
  'FilterPanel.edge': 'edge',
  'FilterPanel.recommend': 'Recommend',
  'FilterPanel.info.name': 'Filter Panel',
  'FilterPanel.meta.filterKeys': 'Default filter keys',
};

const zhCN = {
  'FilterPanel.addfilter': '增加筛选器',
  'FilterPanel.selectElementAttr': '选择元素属性',
  'FilterPanel.selectFilterValue': '选择筛选值',
  'FilterPanel.selectValidField': '请选择合法字段',
  'FilterPanel.node': '节点',
  'FilterPanel.edge': '边',
  'FilterPanel.recommend': '智能推荐',
  'FilterPanel.info.name': '筛选面板',
  'FilterPanel.meta.filterKeys': '默认筛选字段',
};

export default {
  [LANGUAGE_KEY_NAME.EnUs]: enUS,
  [LANGUAGE_KEY_NAME.ZhCN]: zhCN,
} as Record<LANGUAGE_KEY_NAME, any>;

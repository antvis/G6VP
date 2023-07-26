import { extra } from '@antv/gi-sdk';
import info from './info';
import $i18n from '../i18n';

export const locale = {
  degree: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.DegreeCentrality', dm: '度中心性' }),
  'degree-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.CalculatedBasedOnTheEntity',
    dm: '根据实体的出入度大小计算',
  }),
  'page-rank': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.PagerankWebPageSorting',
    dm: 'PageRank网页排序',
  }),
  'page-rank-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.UsePagerankWebPageSorting',
    dm: '使用PageRank网页排序算法计算',
  }),
  'node-property': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.NodeAttributeImportance',
    dm: '节点属性重要性',
  }),
  'node-property-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.CalculateBasedOnNodeAttribute',
    dm: '根据节点属性值计算',
  }),
  'edge-property': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.ImportanceOfRelationshipAttributes',
    dm: '关系属性重要性',
  }),
  'edge-property-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.CalculatedBasedOnTheAttributes',
    dm: '根据节点相关关系的属性计算',
  }),
  'in-degree': $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Penetration', dm: '入度' }),
  'out-degree': $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Outdegree', dm: '出度' }),
  ave: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Average', dm: '平均数' }),
  min: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.MinimumValue', dm: '最小值' }),
  max: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Maximum', dm: '最大值' }),
  median: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Median', dm: '中位数' }),
  sort: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Sort', dm: '排序' }),
  'sort-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.ApplicableToNumericalType',
    dm: '适用于数值型',
  }),
  count: $i18n.get({ id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.Count', dm: '计数' }),
  'count-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.ApplicableToEnumeratedTypes',
    dm: '适用于枚举型',
  }),
  'positive-correlation': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.PositiveCorrelation',
    dm: '正相关',
  }),
  'positive-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.TheLargerTheValueThe',
    dm: '值越大，点或边越大',
  }),
  'negative-correlation': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.PositiveCorrelation',
    dm: '正相关',
  }),
  'negative-tip': $i18n.get({
    id: 'gi-assets-algorithm.src.NodeImportance.registerMeta.TheSmallerTheValueThe',
    dm: '值越小，点或边越大',
  }),
};
export enum MappingWay {
  Positive = 'positive',
  Negative = 'negative',
}
export enum ITEM_STATE {
  Active = 'active',
  Default = 'default',
  Selected = 'selected',
  Disable = 'disable',
  Highlight = 'highlight',
  Inactive = 'inactive',
}
export interface PropertyContentProps {
  type: 'node' | 'edge';
  visible: boolean;
  form;
  properties: string[];
}

export interface NodeImportanceProps {
  visible?: boolean;
  onVisibleChange?: (visible: boolean) => void;
  hasDivider: boolean;
  color: string;
  controlledValues?: {
    algorithm: string;
    degreeIn: string;
    degreeOut: string;
    [formField: string]: unknown;
  };
  onOpen?: () => void;
}

const { GIAC_CONTENT_METAS, deepClone } = extra;
const metas = deepClone(GIAC_CONTENT_METAS);
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.title.default = info.name;
metas.GIAC_CONTENT.properties.GIAC_CONTENT.properties.icon.default = info.icon;

export default () => {
  return {
    ...metas,
  };
};

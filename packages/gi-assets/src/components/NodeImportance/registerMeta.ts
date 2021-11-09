import { extractDefault } from '@ali/react-datav-gui-utils';

export const locale = {
  degree: '度中心性',
  'degree-tip': '根据实体的出入度大小计算',
  'page-rank': 'PageRank网页排序',
  'page-rank-tip': '使用PageRank网页排序算法计算',
  'node-property': '节点属性重要性',
  'node-property-tip': '根据节点属性值计算',
  'edge-property': '关系属性重要性',
  'edge-property-tip': '根据节点相关关系的属性计算',
  'in-degree': '入度',
  'out-degree': '出度',
  ave: '平均数',
  min: '最小值',
  max: '最大值',
  median: '中位数',
  sort: '排序',
  'sort-tip': '适用于数值型',
  count: '计数',
  'count-tip': '适用于枚举型',
  'positive-correlation': '正相关',
  'positive-tip': '值越大，点或边越大',
  'negative-correlation': '正相关',
  'negative-tip': '值越小，点或边越大',
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
}

const registerMeta = context => {
  return {
    GI_CONTAINER_INDEX: {
      name: '容器中位置',
      type: 'stepper',
      step: 1,
      min: 0,
      max: 15,
      default: 0,
    },
    hasDivider: {
      name: '分隔符',
      type: 'switch',
      default: false,
    },
    color: {
      name: '提示颜色',
      type: 'fill',
      default: '#87d068',
    },
  };
};

/** 默认的配置值 */
const configObj = registerMeta({ data: {} });
export const defaultProps = extractDefault({ config: configObj, value: {} }) as NodeImportanceProps;
/** 导出GI的Meta配置面板，基于datav.GUI */
export default registerMeta;

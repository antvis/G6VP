/* eslint-disable no-param-reassign  */
import { ITreeData } from './interface';
import { tree_dfs } from './util';
import BizIdentifiedMapping from './bizQuotasMapping';
import RoseChangeMapping  from './roseChangeMapping';

export type IStatisticsCount = {
  canBeInterupt: number;
  notBeInterupt: number;
  running: number;
  finished: number;
  quotas_boolean: number;
  quotas_number: number;
  quotas_string: number;
  variabilityRange: ILimit;
  contributionRange: ILimit;
};

type ILimit = { min: number; max: number };

import { isBoolean, isNumber, cloneDeep } from 'lodash';

/**
 * 数据预处理
 */
export function preprocess_data(originData: ITreeData) {
  // 遍历下增加自定义节点的 type
  tree_dfs<ITreeData>(originData, item => {
    // (item as ITreeData).type = 'reason_analysis_node';
    item.type = 'reason_text_node';
  });
}

export const INIT_COUNT: IStatisticsCount = {
  canBeInterupt: 0,
  notBeInterupt: 0,
  running: 0,
  finished: 0,
  quotas_boolean: 0,
  quotas_number: 0,
  quotas_string: 0,
  contributionRange: { min: 0, max: 0 },
  variabilityRange: { min: 0, max: 0 },
};
/**
 * 统计数据
 */
export function statistics_data(originData: ITreeData): IStatisticsCount {
  if (!originData) return INIT_COUNT;
  const count: IStatisticsCount = cloneDeep(INIT_COUNT);
  const { contributionRange, variabilityRange, bizIdentifieBucket } = originData;

  count.contributionRange = contributionRange;
  count.variabilityRange = variabilityRange;

  // 设置指标预设
  BizIdentifiedMapping.getInstance().setMappingData(bizIdentifieBucket);

  RoseChangeMapping.getInstance().resetMap();

  // 遍历下增加自定义节点的 type
  tree_dfs<ITreeData>(originData, item => {
    const { property } = item;
    const { canBeInterupt, runningState, quotas, changes } = property;
    // 找出changes的最值
    RoseChangeMapping.getInstance().setMappingData(changes);

    const isBranch = (obj: any) => {
      if (
        obj &&
        item?.bizIdentifieBucket &&
        Object.keys(item?.bizIdentifieBucket).includes(obj.name) &&
        Array.isArray(item?.bizIdentifieBucket[obj.name]) &&
        item?.bizIdentifieBucket[obj.name].includes(obj.value)
      ) {
        obj.isBranchData = true; // 设置一个标记位
        return true;
      }
      return false;
    };

    if (isBoolean(canBeInterupt) && canBeInterupt) {
      count.canBeInterupt += 1;
    } else {
      count.notBeInterupt += 1;
    }
    if (runningState === 'running') {
      count.running += 1;
    } else {
      count.finished += 1;
    }
    quotas.forEach(quota => {
      if (isBoolean(quota.value) || quota.value === '是' || quota.value === '否') {
        // 布尔
        count.quotas_boolean += 1;
      } else if (isBranch(quota)) {
        // 分桶
        count.quotas_number += 1;
      } else {
        // 其它
        count.quotas_string += 1;
      }
    });
  });

  return count;
}

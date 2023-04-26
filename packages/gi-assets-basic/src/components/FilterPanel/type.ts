export interface HistogramOpt {
  /** 是否自定义分箱 */
  isCustom: boolean;
  min: number;
  max: number;
  binWidth: number;
}

export interface IFilterCriteria {
  id: string;
  // 是否是智能推荐的
  isRecommend?: boolean;
  // 是否带有异常值，与智能推荐相关
  hasOutlier?: boolean;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  range?: number[][];
  selectValue?: (string | boolean)[];
  selectOptions?: IOption[];
  analyzerType?: 'HISTOGRAM' | 'SELECT' | 'PIE' | 'WORDCLOUD' | 'NONE' | 'DATE' | 'COLUMN';
  chartData?: Map<string | number, number>;
  // 直方图的数据是一维的，单独列出
  histogramData?: IHistogramValue[];
  isFilterReady?: boolean;
  /**  直方图的分箱配置 */
  histogramOptions?: HistogramOpt;
  // 默认分析字段
  defaultKey?: string;
}

interface IOption {
  value: string | boolean;
  label: string;
  rank?: number;
  isOutlier?: boolean;
}

export interface IChartData {
  x: string;
  value: number;
}

export interface IHistogramValue {
  value: number;
}

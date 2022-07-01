export interface IFilterCriteria {
  id?: string;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  range?: number[];
  selectValue?: (string | boolean)[];
  selectOptions?: IOption[];
  analyzerType?: 'HISTOGRAM' | 'SELECT' | 'PIE' | 'WORDCLOUD' | 'NONE' | 'DATE';
  chartData?: Map<string | number, number>;
  // 直方图的数据是一维的，单独列出
  histogramData?: IHistogramValue[] 
  isFilterReady?: boolean;
}

interface IOption {
  value: string | boolean;
  label: string;
}

export interface IChartData {
  x: string;
  value: number;
}

export interface IHistogramValue {
  value: number;
}

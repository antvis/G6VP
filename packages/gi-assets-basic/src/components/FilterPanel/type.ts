export interface IFilterCriteria {
  id?: string;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  range?: number[];
  selectValue?: (string | boolean)[];
  selectOptions?: IOption[];
  analyzerType?: 'BRUSH' | 'SELECT' | 'PIE' | 'WORDCLOUD' | 'NONE';
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
  value: number
}
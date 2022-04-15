export interface IFilterCriteria{
  id?: string;
  // 筛选属性值
  prop?: string;
  elementType?: 'node' | 'edge';
  range?: number[];
  histogram?: IHistogramProp;
  selectValue?: (string | boolean)[];
  selectOptions?: IOption[];
  analyzerType?: 'BRUSH' | 'SELECT' | 'NONE';
  isFilterReady?: boolean;
};

interface IOption {
  value: string | boolean;
  label: string;
}

export interface IHistogramBin {
  x0: number | undefined;
  x1: number | undefined;
  count: number;
};

export interface IHistogramProp  {
  domain: number[];
  data: IHistogramBin[];
  step: number;
  dataType: string;
  format: string;
};

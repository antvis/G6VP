import * as Initializer from './Initializer';
import * as NeighborsQueryServices from './NeighborsQuery';
import * as Save from './Save';

export interface QueryPropertiesParams {
  data: any;
}

export const PropertiesPanel = {
  name: '查询属性详情',
  service: (params: QueryPropertiesParams) => {
    const { data } = params;
    console.log('custom...', params);
    return new Promise(resolve => {
      return resolve(data);
    });
  },
};

export default {
  id: 'GI',
  name: 'GraphInsight 官方数据服务',
  PropertiesPanel,
  ...NeighborsQueryServices,
  ...Initializer,
  ...Save,
};

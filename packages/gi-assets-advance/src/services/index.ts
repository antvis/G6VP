import * as GremlinQueryServices from './GremlinQuery';
import * as ThemeSetting from './ThemeSetting';
export default {
  id: 'GI',
  name: 'GraphInsight 官方数据服务',
  ...GremlinQueryServices,
  ...ThemeSetting,
};

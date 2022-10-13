import * as GremlinQueryServices from './GremlinQuery';
import * as ThemeSetting from './ThemeSetting';
import * as StyleSetting from './StyleSetting';
import * as PublishTemplate from './PublishTemplate';
export default {
  id: 'GI',
  name: 'GraphInsight 官方数据服务',
  services: {
    ...GremlinQueryServices,
    ...ThemeSetting,
    ...StyleSetting,
    ...PublishTemplate,
  },
};

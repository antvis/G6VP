import * as GremlinQueryServices from './GremlinQuery';
import * as ThemeSetting from './ThemeSetting';
import * as StyleSetting from './StyleSetting';
import * as TemplateService from './TemplateService';
import * as LanguageQueryService from './LanguageQueryService';
export default {
  id: 'GI',
  name: 'G6VP 官方数据服务',
  services: {
    ...GremlinQueryServices,
    ...ThemeSetting,
    ...StyleSetting,
    ...TemplateService,
    ...LanguageQueryService,
  },
};

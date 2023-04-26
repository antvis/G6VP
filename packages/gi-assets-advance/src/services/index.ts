import * as GremlinQueryServices from './GremlinQuery';
import * as LanguageQueryService from './LanguageQueryService';
import * as StyleSetting from './StyleSetting';
import * as TemplateService from './TemplateService';
import * as ThemeSetting from './ThemeSetting';
export default {
  id: 'GI',
  services: {
    ...GremlinQueryServices,
    ...ThemeSetting,
    ...StyleSetting,
    ...TemplateService,
    ...LanguageQueryService,
  },
};

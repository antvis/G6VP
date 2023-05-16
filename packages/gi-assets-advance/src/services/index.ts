import * as GremlinQueryServices from './GremlinQuery';
import * as LanguageQueryService from './LanguageQueryService';
import * as StyleSetting from './StyleSetting';
import * as TemplateService from './TemplateService';
import * as ThemeSetting from './ThemeSetting';
import * as HistoryAnalyseService from './HistoryAnalyseService';
export default {
  id: 'GI',
  services: {
    ...GremlinQueryServices,
    ...ThemeSetting,
    ...StyleSetting,
    ...TemplateService,
    ...LanguageQueryService,
    ...HistoryAnalyseService,
  },
};

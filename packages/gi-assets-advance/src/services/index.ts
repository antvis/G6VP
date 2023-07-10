import * as CypherQuery from './CypherQuery';
import * as GremlinQueryServices from './GremlinQuery';
import * as HistoryAnalyseService from './HistoryAnalyseService';
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
    ...CypherQuery,
    ...HistoryAnalyseService,
  },
};

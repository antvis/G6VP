import { GraphinData } from '@antv/graphin';
import $i18n from '../i18n';

export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<GraphinData | boolean | {}>;
}

export interface NeighborsQueryParams {
  ids: string[];
  data: any;
}

export const LanguageQueryService: ServiceObject = {
  name: $i18n.get({ id: 'advance.src.services.LanguageQueryService.StatementQuery', dm: '语句查询' }),
  service: params => {
    console.log($i18n.get({ id: 'advance.src.services.LanguageQueryService.QueryParameters', dm: '查询参数' }), params);
    const id = 'mock_language_query';
    const data = {
      nodes: [
        {
          id,
          type: 'user',
        },

        {
          id: `${id}-family`,
          type: 'user',
        },
        {
          id: `${id}-card`,
          type: 'card',
        },
      ],

      edges: [
        {
          source: id,
          target: `${id}-family`,
          type: 'family',
        },
        {
          source: id,
          target: `${id}-card`,
          type: 'own',
        },
      ],
    };
    return new Promise(resolve => {
      return resolve({
        success: true,
        data,
      });
    });
  },
};

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

export const GremlinQuery: ServiceObject = {
  name: $i18n.get({ id: 'advance.src.services.GremlinQuery.GremlinQuery', dm: 'Gremlin 查询' }),
  service: localData => {
    const id = 'mock_gremlin_query';
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

import { GraphinData, Utils } from '@antv/graphin';
import { notification } from 'antd';
import $i18n from '../i18n';

export interface ServiceObject {
  name: string;
  service: (params: any) => Promise<GraphinData | boolean | {}>;
}

export interface NeighborsQueryParams {
  ids: string[];
  data: any;
}

export const CypherQuery: ServiceObject = {
  name: $i18n.get({ id: 'advance.src.services.CypherQuery.StatementQuery', dm: '语句查询' }),
  service: params => {
    console.log($i18n.get({ id: 'advance.src.services.CypherQuery.QueryParameters', dm: '查询参数' }), params);
    const id = 'mock_language_query';
    const data = Utils.mock(Math.round(Math.random() * 100))
      .tree()
      .graphin();

    notification.info({
      message: $i18n.get({ id: 'advance.src.services.CypherQuery.QuerySucceeded', dm: '查询成功' }),
      description: $i18n.get({
        id: 'advance.src.services.CypherQuery.TheCurrentQueryRequestIs',
        dm: '当前的查询请求是 MOCK 的，请搭配图数据库使用。',
      }),
    });
    return new Promise(resolve => {
      return resolve(data);
    });
  },
};

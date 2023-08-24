import { ServiceObject } from '@antv/gi-sdk';
import $i18n from '../i18n';

export interface ReqNeighborsQuery {
  //扩散的节点，是个节点ID数组
  ids: string[];
  //扩散的节点的全部信息
  nodes: any[];
  //扩散的度数
  sep: number;
}

export const NeighborsQueryMenu: ServiceObject = {
  name: $i18n.get({ id: 'basic.src.services.NeighborsQueryMenu.NeighborQuery', dm: '邻居查询' }),
  method: 'POST',
  req: $i18n.get({
    id: 'basic.src.services.NeighborsQueryMenu.ExportInterfaceReqneighborsqueryTheDiffused',
    dm: '\n  export interface ReqNeighborsQuery {\n    //扩散的节点，是个节点ID数组\n    ids: string[];\n    //扩散的节点的全部信息\n    nodes: any[];\n    //扩散的度数\n    sep: number;\n  }  \n  ',
  }),

  res: $i18n.get({
    id: 'basic.src.services.NeighborsQueryMenu.ExportInterfaceGigraphdataNodesNode',
    dm: '\n  export interface GIGraphData {\n    nodes: {\n      // 节点ID\n      id: string;\n      // 节点类型的枚举值。Property Graph 也称之为 node.label\n      nodeType: string;\n      // 业务数据,注意需要打平,暂不支持嵌套\n      data: {};\n      // 业务数据（data）中的哪个字段，用来映射节点类型\n      nodeTypeKeyFromProperties?: string;\n    }[];\n    edges: {\n      // 边ID\n      id: string;\n      // 边关联的 source 节点ID\n      source: string;\n      // 边关联的 target 节点ID\n      target: string;\n      // 边类型的枚举值。Property Graph 也称之为 edge.label\n      edgeType: string;\n      // 业务数据,注意需要打平,暂不支持嵌套\n      data: {};\n      // 业务数据（data）中的哪个字段，用来映射边类型\n      edgeTypeKeyFromProperties?: string;\n    }[];\n  }\n  ',
  }),

  service: (params: ReqNeighborsQuery): Promise<any> => {
    const { ids, nodes: NODES } = params;

    const result = [
      {
        label: $i18n.get({ id: 'basic.src.services.NeighborsQueryMenu.OnceQuery', dm: '一度查询' }),
        code: 1,
      },
      {
        label: $i18n.get({ id: 'basic.src.services.NeighborsQueryMenu.SecondDegreeQuery', dm: '二度查询' }),
        code: 2,
      },
      {
        label: $i18n.get({ id: 'basic.src.services.NeighborsQueryMenu.ThreeDegreeQuery', dm: '三度查询' }),
        code: 3,
      },
    ];

    return new Promise(resolve => {
      return resolve(result);
    });
  },
};

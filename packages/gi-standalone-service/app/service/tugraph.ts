import { Service } from 'egg';
import { TUGRAPH_SERVICE_URL } from '../util';
import { ILanguageQueryParams, INeighborsParams } from './serviceInterface';

export const getNodeIds = (params: any): Array<number> => {
  let vidIndex: Array<number> = [];
  let nodeIds: Array<number> = [];
  let headers = params.data.header;
  let result = params.data.result;

  headers.forEach((item: any, index: number) => {
    if (item.type === 1) {
      vidIndex.push(index);
    }
  });
  result.forEach((item: any) => {
    vidIndex.forEach(c => {
      if (item && item[c]) {
        let vid = item[c].replace(/(V\[)([0-9]*)(])/g, ($1: string, $2: string, $3: string) => {
          console.log($1, $2);
          return $3;
        });
        nodeIds.push(parseInt(vid));
      }
    });
  });

  return nodeIds;
};

export const getNodeIdsByEids = (params: any): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  let nodeIds: Array<number> = [];
  let edgeIds: Array<string> = [];
  let result = params.data.result;
  result.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(item_c => {
        if (typeof item_c === 'string' && item_c.startsWith('E[')) {
          let eid: any = item_c.replace(
            /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
            ($1: string, $2: string, $3: string) => {
              console.log($1, $2);
              return $3;
            },
          );
          if (eid) {
            edgeIds.push(eid);
            let n = eid.split('_');
            nodeIds.push(parseInt(n[0]), parseInt(n[1]));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('[V')) {
          if (item_c.includes('E[')) {
            let Ids = item_c.split(',');
            Ids.forEach(itemId => {
              if (itemId.startsWith('E[')) {
                let eid: any = itemId.replace(
                  /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
                  ($1: string, $2: string, $3: string) => {
                    console.log($1, $2);
                    return $3;
                  },
                );
                if (eid) {
                  edgeIds.push(eid);
                  let n = eid.split('_');
                  nodeIds.push(parseInt(n[0]), parseInt(n[1]));
                }
              }
            });
          } else {
            let vid = item_c.replace(/(\[V\[)([0-9]*)(\]\])/g, ($1: string, $2: string, $3: string) => {
              console.log($1, $2);
              return $3;
            });
            nodeIds.push(parseInt(vid));
          }
        }
      });
    }
  });

  // 需要去重
  return {
    nodeIds,
    edgeIds,
  };
};

class TuGraphService extends Service {
  async connect(username, password) {
    const result = await this.ctx.curl(`${TUGRAPH_SERVICE_URL}/login`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        user: username,
        password,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });
    console.log('结果', result);

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    return {
      data: result.data,
      code: 200,
      success: true,
    };
  }

  async queryByGraphLanguage(params: ILanguageQueryParams) {
    const { graphName, value, authorization } = params;
    const result = await this.ctx.curl(`${TUGRAPH_SERVICE_URL}/cypher`, {
      headers: {
        'content-type': 'application/json',
        Authorization: authorization,
      },
      method: 'POST',
      data: {
        graph: graphName,
        script: value,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    if (result.status !== 200) {
      return {
        success: false,
        code: result.status,
        data: result.data,
      };
    }

    console.log('返回结果', result);
    return {
      data: result.data,
      code: 200,
      success: true,
    };
  }

  /**
   *
   * @param params
   */
  async queryNeighbors(params: INeighborsParams) {
    const { ids, graphName, sep = 1 } = params;
    if (sep > 1 && ids.length === 1) {
      // 查询两度关系，需要先查询节点，再查询子图
      const cypher = `match(n)-[*..${sep}]-(m) WHERE id(n)=${ids[0]} return n, m`;
      console.log('cypher', cypher);
    }

    const result = await this.ctx.curl(`${TUGRAPH_SERVICE_URL}/db/${graphName}/misc/sub_graph`, {
      headers: {
        'content-type': 'application/json',
      },
      method: 'POST',
      data: {
        vertex_ids: ids,
      },
      timeout: [30000, 50000],
      dataType: 'json',
    });

    console.log('queryNeighbors 返回结果', result);
    return result.data;
  }
}

export default TuGraphService;

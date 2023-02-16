import fs from 'fs';

export const responseData = (ctx, resp) => {
  if (!resp) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 200,
    };
  }
  ctx.status = parseInt(resp.code, 10);
  ctx.body = resp;
};

interface ICypherResponse {
  elapsed?: number;
  header: {
    [key: string]: string | number;
  }[];
  result: any[];
  size: number;
}

export const getNodeIdsByResponseBak = (
  params: ICypherResponse,
): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];

  const { result } = params;

  result.forEach(item => {
    if (Array.isArray(item)) {
      item.forEach(item_c => {
        if (typeof item_c === 'string' && item_c.startsWith('E[')) {
          const eid: any = item_c.replace(
            /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
            // @ts-ignore
            ($1: string, $2: string, $3: string) => {
              return $3;
            },
          );
          if (eid) {
            edgeIds.push(eid);
            const n = eid.split('_');
            nodeIds.push(parseInt(n[0]), parseInt(n[1]));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('[V')) {
          if (item_c.includes('E[')) {
            const Ids = item_c.split(',');
            Ids.forEach(itemId => {
              if (itemId.startsWith('E[')) {
                const eid: any = itemId.replace(
                  /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
                  // @ts-ignore
                  ($1: string, $2: string, $3: string) => {
                    return $3;
                  },
                );
                if (eid) {
                  edgeIds.push(eid);
                  const n = eid.split('_');
                  nodeIds.push(parseInt(n[0]), parseInt(n[1]));
                }
              }
            });
          } else {
            const vid = item_c.replace(
              /(\[V\[)([0-9]*)(\]\])/g,
              // @ts-ignore
              ($1: string, $2: string, $3: string) => {
                return $3;
              },
            );
            nodeIds.push(parseInt(vid));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('V[')) {
          const vid = item_c.replace(
            /(V\[)([0-9]*)(])/g,
            // @ts-ignore
            ($1: string, $2: string, $3: string) => {
              return $3;
            },
          );
          nodeIds.push(parseInt(vid));
        }
      });
    }
  });

  return {
    // @ts-ignore
    nodeIds: [...new Set(nodeIds)],
    // @ts-ignore
    edgeIds: [...new Set(edgeIds)],
  };
};

export const getNodeIdsByResponse = (params: any): { nodeIds: Array<number>; edgeIds: Array<string> } => {
  const nodeIds: Array<number> = [];
  const edgeIds: Array<string> = [];
  console.log('getNodeIdsByResponse', params.data);
  const result = params.data.result;
  const headers = params.data.header;
  const edgeIndexList: Array<number> = [];
  const pathIndexList: Array<number> = [];
  headers.forEach((item: any, index: number) => {
    if (item.type === 4) {
      pathIndexList.push(index);
    } else if (item.type === 2) {
      edgeIndexList.push(index);
    }
  });
  result.forEach(item => {
    pathIndexList.forEach(c => {
      if (item && item[c]) {
        const data = JSON.parse(item[c]);
        data.forEach((el: any, index: number) => {
          if (index % 2 === 1) {
            const eid = `${el.src}_${el.dst}_${el.label_id}_${el.temporal_id}_${el.identity}`;
            edgeIds.push(eid);
            nodeIds.push(parseInt(el.src), parseInt(el.dst));
          }
        });
      }
    });
    edgeIndexList.forEach(c => {
      if (item && item[c]) {
        const data = JSON.parse(item[c]);
        const eid = `${data.src}_${data.dst}_${data.label_id}_${data.temporal_id}_${data.identity}`;
        edgeIds.push(eid);
        nodeIds.push(parseInt(data.src), parseInt(data.dst));
      }
    });
  });

  return {
    nodeIds: [...new Set(nodeIds)],
    edgeIds: [...new Set(edgeIds)],
  };
};

/**
 * 读取 GraphScope 配置文件
 */
export const readGraphScopeConfig = () => {
  const data = fs.readFileSync(`${__dirname}/service/GRAPHSCOPE_CONFIG.json`);
  return JSON.parse(data.toString());
};

/**
 * 读取 TuGraph 配置文件
 */
export const readTuGraphConfig = () => {
  const data = fs.readFileSync(`${__dirname}/service/TUGRAPH_CONFIG.json`);
  return JSON.parse(data.toString());
};

/**
 * 读取 Neo4j 配置文件
 */
export const readNeo4jConfig = () => {
  const data = fs.readFileSync(`${__dirname}/service/Neo4j_CONFIG.json`);
  return JSON.parse(data.toString());
};

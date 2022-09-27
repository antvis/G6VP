import fs from 'fs';

export const responseData = (ctx, resp) => {
  if (!resp) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 500,
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
          let eid: any = item_c.replace(
            /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
            // @ts-ignore
            ($1: string, $2: string, $3: string) => {
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
                  // @ts-ignore
                  ($1: string, $2: string, $3: string) => {
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
            let vid = item_c.replace(
              /(\[V\[)([0-9]*)(\]\])/g,
              // @ts-ignore
              ($1: string, $2: string, $3: string) => {
                return $3;
              },
            );
            nodeIds.push(parseInt(vid));
          }
        } else if (typeof item_c === 'string' && item_c.startsWith('V[')) {
          let vid = item_c.replace(
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
  let nodeIds: Array<number> = [];
  let edgeIds: Array<string> = [];

  console.log('返回的结果');
  let result = params.result;
  let headers = params.header;

  // 节点索引
  let vidIndex: Array<number> = [];
  let edgeIndexList: Array<number> = [];
  let pathIndexList: Array<number> = [];

  headers.forEach((item: any, index: number) => {
    if (item.type === 1) {
      vidIndex.push(index);
    } else if (item.type === 4) {
      pathIndexList.push(index);
    } else if (item.type === 2) {
      edgeIndexList.push(index);
    }
  });

  result.forEach(item => {
    pathIndexList.forEach(c => {
      if (item && item[c]) {
        // @ts-ignore
        let data = JSON.parse(item[c]);
        Object.keys(data).forEach(id => {
          if (id.startsWith('E[')) {
            let eid: any = id.replace(
              /(E\[)([0-9]*_[0-9]*_[0-9]*_[0-9]*)(])/g,
              // @ts-ignore
              ($1: string, $2: string, $3: string) => {
                return $3;
              },
            );
            if (eid) {
              edgeIds.push(eid + '_0'); //应急5元组
              let n = eid.split('_');
              nodeIds.push(parseInt(n[0]), parseInt(n[1]));
            }
          }
        });
      }
    });

    edgeIndexList.forEach(c => {
      if (item && item[c]) {
        // @ts-ignore
        let data = JSON.parse(item[c]);
        let eid = `${data.start}_${data.end}_${data.label_id}_0_${data.identity}`; //应急5元组
        edgeIds.push(eid);
        nodeIds.push(parseInt(data.start), parseInt(data.end));
      }
    });

    vidIndex.forEach(c => {
      if (item && item[c]) {
        const vid = JSON.parse(item[c]).identity;
        nodeIds.push(parseInt(vid));
      }
    });
  });
  return {
    // @ts-ignore
    nodeIds: [...new Set(nodeIds)],
    // @ts-ignore
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

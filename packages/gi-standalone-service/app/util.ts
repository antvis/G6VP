// 如果是要部署到外网，请使用 http://47.242.172.5:9527
export const GRAPHSCOPE_SERVICE_URL = 'http://11.166.85.48:9527';
export const TUGRAPH_SERVICE_URL = 'http://30.230.65.41:7090';
export const TUGRAPH_DEFAULT_GRAPHNAME = 'MovieDemo1';

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

export const getNodeIdsByResponse = (params: ICypherResponse): { nodeIds: Array<number>; edgeIds: Array<string> } => {
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

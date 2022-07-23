export const GRAPHSCOPE_SERVICE_URL = 'http://11.166.85.48:9527'; //'http://47.242.172.5:9527';

export const responseData = (ctx, resp) => {
  console.log('格式化结果', resp);
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

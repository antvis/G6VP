export const GRAPHSCOPE_SERVICE_URL = 'http://11.166.85.48:9527'; //'http://47.242.172.5:9527';

export const GRAPHSCOPE_SERVICE_INTERNET_URL = 'http://grape.alibaba-inc.com';

export const responseData = (ctx, resp) => {
  if (!resp) {
    ctx.status = 500;
    ctx.body = {
      success: false,
      code: 500,
    };
  }
  ctx.status = resp.code;
  ctx.body = resp;
};

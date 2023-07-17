const contextKey = 'GI_SITE_CONTEXT';

export type SiteContext = {
  GI_SITE_ID: string;
  [k: string]: any;
}

/**
 * 获取站点信息上下文
 * @returns
 */
export const getSiteContext = (defaltContext = {
  GI_SITE_ID: 'DEFAULT'
}): SiteContext => {
  return window[contextKey] || defaltContext;
};
/**
 * 设置站点信息上下文
 * @returns
 */
export const setSiteContext = (context: SiteContext) => {
  const preContext = window[contextKey] || {};
  window[contextKey] = { ...preContext, ...context};
};

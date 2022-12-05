/**
 * 获取服务引擎的上下文
 * @returns
 */
export const getServerEngineContext = (defaltContext = {}) => {
  try {
    const context = JSON.parse(localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}');
    return { ...defaltContext, ...context };
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 * 设置服务引擎的上下文
 * @returns
 */
export const setServerEngineContext = context => {
  try {
    const preContext = JSON.parse(localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}');
    localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify({ ...preContext, ...context }));
  } catch (error) {
    console.error(error);
  }
};

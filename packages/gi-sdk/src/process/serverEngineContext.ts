/**
 * 获取服务引擎的上下文
 * @returns
 */
export const getServerEngineContext = () => {
  try {
    const ContextString = localStorage.getItem('SERVER_ENGINE_CONTEXT') || '{}';
    return JSON.parse(ContextString);
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
    localStorage.setItem('SERVER_ENGINE_CONTEXT', JSON.stringify(context));
  } catch (error) {
    console.error(error);
  }
};

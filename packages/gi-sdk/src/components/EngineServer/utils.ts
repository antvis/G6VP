const DEFAULT_CONNECT_INFO = {
  username: '',
  password: '',
  serverUrl: '',
};
export const getConnectInfo = () => {
  try {
    const TUGRAPH_CONNECT_INFO_STRING = localStorage.getItem('TUGRAPH_CONNECT_INFO') || '{}';
    const {
      username = DEFAULT_CONNECT_INFO.username,
      password = DEFAULT_CONNECT_INFO.password,
      serverUrl = DEFAULT_CONNECT_INFO.serverUrl,
    } = JSON.parse(TUGRAPH_CONNECT_INFO_STRING);
    return {
      username,
      password,
      serverUrl,
    };
  } catch (error) {
    return DEFAULT_CONNECT_INFO;
  }
};

export const setConnectInfo = (params: typeof DEFAULT_CONNECT_INFO) => {
  localStorage.setItem('TUGRAPH_CONNECT_INFO', JSON.stringify(params));
};

/**
 * 获取服务引擎的上下文
 * @returns
 */
export const getEngineForm = (engineId, defaltContext = {}) => {
  try {
    const context = JSON.parse(localStorage.getItem('ENGINE_FORM') || '{}');
    return { ...defaltContext, ...(context[engineId] || {}) };
  } catch (error) {
    console.error(error);
    return {};
  }
};
/**
 * 设置服务引擎的上下文
 * @returns
 */
export const setEngineForm = (engineId, context) => {
  try {
    const preContext = JSON.parse(localStorage.getItem('ENGINE_FORM') || '{}');

    localStorage.setItem(
      'ENGINE_FORM',
      JSON.stringify({
        ...preContext,
        [engineId]: {
          ...preContext[engineId],
          ...context,
        },
      }),
    );
  } catch (error) {
    console.error(error);
  }
};

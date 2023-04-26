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

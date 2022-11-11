export const setConnectInfo = params => {
  localStorage.setItem('Neo4j_CONNECT_INFO', JSON.stringify(params));
};

export const getConnectInfo = () => {
  try {
    const TUGRAPH_CONNECT_INFO_STRING = localStorage.getItem('Neo4j_CONNECT_INFO') || '{}';
    const { uri, username, password, httpServerURL } = JSON.parse(TUGRAPH_CONNECT_INFO_STRING);
    return {
      uri,
      username,
      password,
      httpServerURL,
    };
  } catch (error) {
    return {};
  }
};

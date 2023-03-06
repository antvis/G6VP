import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export interface ConnectProps {
  httpServerURL: string;
  uri: string;
  username: string;
  password: boolean;
}

export const connectHugeGraphService = async () => {
  const { uri, username, password, httpServerURL } = utils.getServerEngineContext();

  try {
    const result = await request(`${httpServerURL}/api/neo4j/connect`, {
      method: 'POST',
      data: {
        uri,
        username,
        password,
        httpServerURL,
      },
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (result.success) {
      utils.setServerEngineContext({
        HAS_CONNECT_SUCCESS: true,
      });
    }

    return result;
  } catch (error) {
    return null;
  }
};

export const queryGraphSchema = async () => {
  const { httpServerURL } = utils.getServerEngineContext();
  const result = await request(`${httpServerURL}/api/neo4j/schema`, {
    method: 'GET',
  });

  return result.data;
};

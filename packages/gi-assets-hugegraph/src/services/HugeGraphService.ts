import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
export interface ConnectProps {
  httpServerURL: string;
  uri: string;
  username: string;
  password: boolean;
}

export const queryGraphSchema = async () => {
  const { httpServerURL, uri, graphId } = utils.getServerEngineContext();
  const result = await request(`${httpServerURL}/api/hugegraph/schema`, {
    method: 'POST',
    data: {
      uri,
      graphId,
    },
  });

  return result.data;
};

export const listGraphs = async () => {
  const { uri, httpServerURL, username, password } = utils.getServerEngineContext();
  const result = await request(`${httpServerURL}/api/hugegraph/graphs`, {
    method: 'POST',
    data: {
      uri,
      httpServerURL,
      username,
      password,
    },
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
  });

  return result.data;
};

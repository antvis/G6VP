import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
import hugegraphRequest from './util';
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
  // let result;
  // try {
  //   const result = await hugegraphRequest(`${uri}/graphs`, {
  //     method: 'GET',
  //     data: {},
  //     dataType: 'json',
  //   });
  //   console.log('lisggraphresult', result);
  //   // if (result.status !== 200 || !result.data?.graphs) {
  //   //   return {
  //   //     success: false,
  //   //     code: result.status,
  //   //     message: result.message,
  //   //   };
  //   // }
  // } catch (error) {
  //   console.log('errorerror', error);
  // }
  // return {};

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

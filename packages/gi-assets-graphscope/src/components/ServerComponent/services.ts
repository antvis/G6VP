import { utils } from '@antv/gi-sdk';
import request from 'umi-request';
const { getServerEngineContext } = utils;
export interface ConnectProps {
  engineServerURL: string;
  httpServerURL: string;
  isStringType: boolean;
}

export const connectGraphScopeService = async () => {
  const { httpServerURL, engineServerURL, isStringType } = getServerEngineContext();

  const result = await request(`${httpServerURL[0]}/graphcompute/connect`, {
    method: 'POST',
    data: {
      httpServerURL: httpServerURL[0],
      engineServerURL: engineServerURL[0],
      isStringType,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  if (result.success) {
    const { httpServerURL } = result.data;
    localStorage.setItem('GRAPHSCOPE_HTTP_SERVER', httpServerURL);
  }

  return result;
};

export const querySubGraphList = () => {};

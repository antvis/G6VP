import { utils } from '@antv/gi-sdk';
import request from 'umi-request';

const { getServerEngineContext } = utils;
export interface ConnectProps {
  engineServerURL: string;
  httpServerURL: string;
  isStringType: boolean;
}

export const connectGraphScopeService = async () => {
  const { HTTP_SERVICE_URL, engineServerURL, isStringType } = getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/graphscope/connect`, {
    method: 'POST',
    data: {
      httpServerURL: HTTP_SERVICE_URL,
      engineServerURL: engineServerURL,
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

export const querySubGraphList = async () => {
  const { HTTP_SERVICE_URL, engineServerURL } = getServerEngineContext();
  const result = await request(`${HTTP_SERVICE_URL}/graphscope/listSubgraph`, {
    method: 'GET',
    data: {
      httpServerURL: HTTP_SERVICE_URL,
      engineServerURL: engineServerURL,
    },
    headers: {
      'Content-Type': 'application/json',
    },
  });

  return result;
};

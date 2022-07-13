import request from 'umi-request';
import { SERVICE_URL_PREFIX } from './const';

export const querySharedAnalysisById = async (shareId: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/share/list/${shareId}`, {
    method: 'get',
  });

  console.log('查询', response);

  if (response.success && response.data) {
    return response.data;
  }
};

export const queryShareList = async () => {
  const response = await request(`${SERVICE_URL_PREFIX}/share/list`, {
    method: 'get',
  });

  if (response.success && response.data) {
    return response.data;
  }
};

export const deleteShareById = async (shareId: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/share/list/${shareId}`, {
    method: 'delete',
  });
  if (response.success && response.data) {
    return response.data;
  }
};

import request from 'umi-request';
import { GI_SITE } from './const';

export const querySharedAnalysisById = async (shareId: string) => {
  const response = await request(`${GI_SITE.SERVICE_URL}/share/list/${shareId}`, {
    method: 'get',
  });

  console.log('查询', response);

  if (response.success && response.data) {
    return response.data;
  }
};

export const queryShareList = async () => {
  const response = await request(`${GI_SITE.SERVICE_URL}/share/list`, {
    method: 'get',
  });

  if (response.success && response.data) {
    return response.data;
  }
};

export const deleteShareById = async (shareId: string) => {
  const response = await request(`${GI_SITE.SERVICE_URL}/share/list/${shareId}`, {
    method: 'delete',
  });
  if (response.success && response.data) {
    return response.data;
  }
};

import request from 'umi-request';
import { GI_SITE } from './const';
import $i18n from '../i18n';

export const querySharedAnalysisById = async (shareId: string) => {
  const response = await request(`${GI_SITE.SERVICE_URL}/share/list/${shareId}`, {
    method: 'get',
  });

  console.log($i18n.get({ id: 'gi-site.src.services.share.Query', dm: '查询' }), response);

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

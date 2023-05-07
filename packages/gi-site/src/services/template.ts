import { GI_TEMPLATE_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { queryAssets } from './assets';
import { GI_SITE } from './const';
import { ITemplate } from './typing';
import { request } from './utils';

/**
 * 获取内置模版
 * @returns
 */
export const listInner = async () => {
  const { templates } = await queryAssets();
  return Object.values(templates || {});
};

/**
 * 获取用户自己创建的模版
 * @returns
 */
export const list = async (): Promise<ITemplate[]> => {
  if (GI_SITE.IS_OFFLINE) {
    const res: ITemplate[] = [];
    await GI_TEMPLATE_DB.iterate((item: ITemplate) => {
      res.push(item);
    });
    return res;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/template/list`, {
    method: 'get',
  }).catch(res => {
    console.log('res', res);
    return [];
  });

  if (response.success) {
    return response.data;
  }
  return [];
};

/**
 * 创建模版
 * @param param
 * @returns
 */
export const create = async (param: any): Promise<string | undefined> => {
  const templateId = `tp_${getUid()}`;
  const { ...otherParams } = param;
  const payload = {
    ...otherParams,
    id: templateId,
  };
  if (GI_SITE.IS_OFFLINE) {
    GI_TEMPLATE_DB.setItem(templateId, payload);
    return new Promise(resolve => {
      resolve(templateId);
    });
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/template/create`, {
    method: 'post',
    data: payload,
  }).catch(error => {
    return false;
  });

  if (response && response.success) {
    return response.data;
  }
};

/**
 * 根据模版ID获取详情
 * @param id 模版ID
 * @returns
 */
export const getById = async (id: string): Promise<ITemplate | undefined> => {
  if (GI_SITE.IS_OFFLINE) {
    const template: any = await GI_TEMPLATE_DB.getItem(id);
    return template;
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/template/${id}`, {
    method: 'get',
  });
  if (response.success) {
    return response.data;
  }
};

/**
 * 更新模版
 * @param id
 * @param params
 * @returns
 */
export const updateById = async (id: string, params: { data?: string; [key: string]: any }) => {
  params.id = id;

  if (GI_SITE.IS_OFFLINE) {
    const origin: any = await GI_TEMPLATE_DB.getItem(id);
    GI_TEMPLATE_DB.setItem(id, { ...origin, ...params });
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/template/update`, {
    method: 'post',
    data: params,
  });
  return response.success;
};

/**
 * 删除模版
 * @param id
 * @returns
 */
export const removeById = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    GI_TEMPLATE_DB.removeItem(id);
    return true;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/template/delete`, {
    method: 'post',
    data: {
      id,
    },
  });
  return response.success;
};

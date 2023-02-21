import { message } from 'antd';

import { GI_TEMPLATE_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { GI_SITE } from './const';
import {
  TEMPALTE_GEAFLOW,
  TEMPALTE_GI,
  TEMPALTE_GRAPHSCOPE,
  TEMPALTE_NEO4J,
  TEMPALTE_TUGRAPH,
} from './initial.data/default.template';
import { ITemplate } from './typing';
import { request } from './utils';

/**
 * 获取所有项目
 * @returns
 */
export const list = async (): Promise<ITemplate[]> => {
  if (GI_SITE.IS_OFFLINE) {
    const tempaltes = [TEMPALTE_GEAFLOW, TEMPALTE_NEO4J, TEMPALTE_TUGRAPH, TEMPALTE_GRAPHSCOPE, TEMPALTE_GI];
    for (const item of tempaltes) {
      await GI_TEMPLATE_DB.setItem(item.id, item);
    }
    const res: ITemplate[] = [];
    await GI_TEMPLATE_DB.iterate((item: ITemplate) => {
      res.push(item);
    });
    console.log('RES', res);
    return res;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/template/list`, {
    method: 'post',
  });

  if (response.success) {
    return response.data;
  }
  return [];
};

/**
 * 增加项目
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
  const response = await request(`${GI_SITE.SERVICE_URL}/tempalte/create`, {
    method: 'post',
    data: payload,
  }).catch(error => {
    message.error(error);
  });

  if (response.success) {
    return response.data;
  }
};

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const getById = async (id: string): Promise<ITemplate | undefined> => {
  if (GI_SITE.IS_OFFLINE) {
    const tempalte: any = await GI_TEMPLATE_DB.getItem(id);
    return tempalte;
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/tempalte/${id}`, {
    method: 'get',
  });
  if (response.success) {
    return response.data;
  }
};

/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const updateById = async (id: string, params: { data?: string; [key: string]: any }) => {
  params.id = id;

  if (GI_SITE.IS_OFFLINE) {
    const origin: any = await GI_TEMPLATE_DB.getItem(id);
    GI_TEMPLATE_DB.setItem(id, { ...origin, ...params });
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/tempalte/update`, {
    method: 'post',
    data: params,
  });
  return response.success;
};

// 软删除项目
export const removeById = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    GI_TEMPLATE_DB.removeItem(id);
    return true;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/tempalte/delete`, {
    method: 'post',
    data: {
      id,
    },
  });
  return response.success;
};

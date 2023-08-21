import { message } from 'antd';

import { GI_PROJECT_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { GI_SITE } from './const';
import { IProject } from './typing';
import { request } from './utils';
import $i18n from '../i18n';
import { utils } from '@antv/gi-sdk';

const { getSiteContext } = utils;
/**
 * 获取所有项目
 * @returns
 */
export const list = async (type: 'project' | 'case' | 'save'): Promise<IProject[]> => {
  if (GI_SITE.IS_OFFLINE) {
    const projects: IProject[] = [];
    await GI_PROJECT_DB.iterate((value: IProject) => {
      const { recycleTime, type, id } = value;
      if (type === 'project') {
        let isExpired = false;
        if (recycleTime) isExpired = new Date(recycleTime + 604800000).getTime() < new Date().getTime();
        if (isExpired) removeById(String(id));
        else projects.push(value);
      }
    });
    projects.sort((a, b) => {
      return a.gmtCreate - b.gmtCreate;
    });
    return projects;
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/project/list`, {
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
  const projectId = getUid();
  const { config, projectConfig, ...otherParams } = param;
  const payload = {
    ...otherParams,
    id: projectId,
    projectConfig: projectConfig || config, //别名
    isProject: true,
    gmtCreate: new Date(),
  };
  if (GI_SITE.IS_OFFLINE) {
    await GI_PROJECT_DB.setItem(projectId, payload);
    return new Promise(resolve => {
      resolve(projectId);
    });
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/project/create`, {
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
export const getById = async (id: string): Promise<IProject | undefined> => {
  const { GI_SITE_ID = 'DEFAULT' } = getSiteContext();
  if (GI_SITE.IS_OFFLINE) {
    const project: any = await GI_PROJECT_DB.getItem(id);
    if (!project) {
      message.info(
        $i18n.get({ id: 'gi-site.src.services.project.TheCanvasDoesNotExist', dm: '该画布不存在，请重新创建...' }),
      );
      //可能是用户第一进来的时候，没有选择环境
      window.location.href = window.location.origin;
      return;
    }
    const { config, projectConfig, engineId, ...others } = project;

    return {
      ...others,
      config: projectConfig || config,
      engineId: engineId || 'GI',
    };
  }
  const requestParams: Record<string, any> = {
    url: `${GI_SITE.SERVICE_URL}/project/${id}`,
    params: {
      method: 'get',
    }
  }
  if (GI_SITE_ID == 'DEFAULT') {
    requestParams.url = `${GI_SITE.SERVICE_URL}/project/id`;
    requestParams.params = {
      method: 'post',
      data: {
        id: id
      }
    }
  }
  const response = await request(requestParams.url, requestParams.params);

  if (response.success) {
    const { projectConfig, engineId, ...others } = response.data;
    return {
      ...others,
      config: projectConfig,
      engineId: engineId || 'GI',
    };
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
    const origin: any = await GI_PROJECT_DB.getItem(id);
    GI_PROJECT_DB.setItem(id, { ...origin, ...params });
    return true;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/project/update`, {
    method: 'post',
    data: params,
  });
  return response.success;
};

// 软删除项目
export const removeById = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    GI_PROJECT_DB.removeItem(id);
    return true;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/project/delete`, {
    method: 'post',
    data: {
      id,
    },
  });
  return response.success;
};

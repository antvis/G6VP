import { message } from 'antd';

import { GI_PROJECT_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { GI_SITE } from './const';
import { IProject } from './typing';
import { request } from './utils';

/**
 * 获取所有项目
 * @returns
 */
export const list = async (type: 'project' | 'case' | 'save'): Promise<IProject[]> => {
  if (GI_SITE.IS_OFFLINE) {
    const projects: IProject[] = [];
    await GI_PROJECT_DB.iterate((value: IProject) => {
      if (value.type === 'project') {
        projects.push(value);
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
  const { ...otherParams } = param;
  const payload = {
    ...otherParams,
    id: projectId,
    isProject: true,
    gmtCreate: new Date(),
  };
  if (GI_SITE.IS_OFFLINE) {
    GI_PROJECT_DB.setItem(projectId, payload);
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
  if (GI_SITE.IS_OFFLINE) {
    const project: any = await GI_PROJECT_DB.getItem(id);
    const { projectConfig, engineId, ...others } = project;
    if (!project) {
      message.info('请先在「工作台」页面选择环境...');
      //可能是用户第一进来的时候，没有选择环境
      window.location.href = window.location.origin;
    }
    return {
      ...others,
      config: projectConfig,
      engineId: engineId || 'GI',
    };
  }
  const response = await request(`${GI_SITE.SERVICE_URL}/project/${id}`, {
    method: 'get',
  });
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

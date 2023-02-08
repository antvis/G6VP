import { message } from 'antd';

import { GI_PROJECT_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { ASSET_TYPE, GI_SITE } from './const';
import { IProject } from './typing';
import { request } from './utils';

export function getEdgesByNodes(nodes, edges) {
  const ids = nodes.map(node => node.id);
  return edges.filter(edge => {
    const { source, target } = edge;
    if (ids.indexOf(source) !== -1 && ids.indexOf(target) !== -1) {
      return true;
    }
    return false;
  });
}

/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const getProjectById = async (id: string): Promise<IProject | undefined> => {
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
    // 如果是在线模式，在本地备份一份，用于后续的初始化查询和scehma查询
    // localforage.setItem(id, response.data);
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
export const updateProjectById = async (id: string, params: { data?: string; [key: string]: any }) => {
  params.id = id;
  const origin: any = await GI_PROJECT_DB.getItem(id);
  GI_PROJECT_DB.setItem(id, { ...origin, ...params });

  /** 如果是在线模式，则备份一份 **/
  if (!GI_SITE.IS_OFFLINE) {
    const response = await request(`${GI_SITE.SERVICE_URL}/project/update`, {
      method: 'post',
      data: params,
    });
    return response.success;
  }
};

// 软删除项目
export const removeProjectById = async (id: string) => {
  GI_PROJECT_DB.removeItem(id);
  /** 如果是在线模式，则备份一份 **/
  if (!GI_SITE.IS_OFFLINE) {
    const response = await request(`${GI_SITE.SERVICE_URL}/project/delete`, {
      method: 'post',
      data: {
        id,
      },
    });
    return response.success;
  }
};

/**
 * 获取所有项目
 * @returns
 */
export const getProjectList = async (type: 'project' | 'case' | 'save'): Promise<IProject[]> => {
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
  console.log(GI_SITE, GI_SITE.IS_OFFLINE, GI_SITE.SERVICE_URL);
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
export const addProject = async (param: any): Promise<string | undefined> => {
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
 * 收藏项目
 * @returns
 */
export const starProject = async (param: any) => {
  const response = await request(`${GI_SITE.SERVICE_URL}/favorite/add`, {
    method: 'post',
    data: param,
  });

  if (response.success) {
    return response.data;
  }
  return [];
};

/**
 * 收藏项目列表
 * @returns
 */
export const getFavoriteList = async () => {
  const response = await request(`${GI_SITE.SERVICE_URL}/favorite/get`, {
    method: 'post',
    data: { assetType: ASSET_TYPE.PROJECT },
  });

  if (response.success) {
    return response.data;
  }
  return [];
};

import request from 'umi-request';
import { IS_LOCAL_ENV, SERVICE_URL_PREFIX } from './const';

export interface CreateEngineInstanceParams {
  projectId: string;
  members?: string;
  engineId?: string;
  // 1：Local，2：ODPS
  mode: number;
  instanceId: string;
  gremlinServerUrl?: string;
  graphNames?: string;
  activeGraphName?: string;
}

export interface UpdateEngineInstanceParams {
  gremlinServerUrl: string;
  activeGraphName: string;
}

/**
 * 创建新的图实例记录
 * @param params
 */
export const createEngineInstance = async (params: CreateEngineInstanceParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/create`, {
    method: 'post',
    data: params,
  });

  return response;
};

/**
 * 更新图实例记录，只支持修改 gremlinServerUrl 和图名称
 * @param instanceId
 * @param params
 */
export const updateEngineInstace = async (instanceId: string, params: UpdateEngineInstanceParams) => {
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/update`, {
    method: 'post',
    data: {
      instanceId,
      ...params,
    },
  });
  return response;
};

/**
 * 通过项目ID查询
 * @param projectId 项目ID
 */
export const findEngineInstanceByProjectID = async (projectId: string, mode: number = 1) => {
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/findByProjectId`, {
    method: 'get',
    params: {
      projectId,
      mode,
    },
  });
  return response;
};

/**
 * 通过实例ID查询
 * @param instanceId 实例ID
 */
export const findEngineInstanceByInstanceId = async (instanceId: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/findByInstanceId`, {
    method: 'get',
    params: {
      instanceId,
    },
  });
  return response;
};

/**
 * 删除实例记录
 * @param instanceId 实例ID
 */
export const deleteInstance = async (instanceId: string) => {
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/delete`, {
    method: 'delete',
    params: {
      instanceId,
    },
  });
  return response;
};

export const findEngineInstanceList = async (projectId: string) => {
  if (IS_LOCAL_ENV) {
    return new Promise(resolve => {
      resolve({
        data: [],
        sucess: true,
      });
    });
  }
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/list`, {
    method: 'get',
    params: {
      projectId,
    },
  });
  return response;
};

export const findAllEngineInstances = async (projectId: string) => {
  if (IS_LOCAL_ENV) {
    return new Promise(resolve => {
      resolve({
        data: [],
        sucess: true,
      });
    });
  }
  const response = await request(`${SERVICE_URL_PREFIX}/engineinstance/all`, {
    method: 'get',
    params: {
      projectId,
    },
  });
  return response;
};

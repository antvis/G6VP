import localforage from 'localforage';
import request from 'umi-request';

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

export const isMock = false;
const SERVICE_URL_PREFIX = 'http://dev.alipay.net:7001';
/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const getProjectById = async (id: string) => {
  if (isMock) {
    return await localforage.getItem(id);
  }
  
  const response = await request(`${SERVICE_URL_PREFIX}/project/get/${id}`, {
    method: 'get',
  });

  return response;
};

/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const updateProjectById = async (id: string, p: any) => {
  if (isMock) {
    const origin: any = await localforage.getItem(id);
    return await localforage.setItem(id, { ...origin, ...p });
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/update/${id}`, {
    method: 'post',
    data: p,
  });

  return response;
};

// 软删除项目
export const removeProjectById = async (id: string) => {
  if (isMock) {
    return await localforage.removeItem(id);
  }

  console.log('removeProjectById', id);
  const response = await request(`${SERVICE_URL_PREFIX}/project/delete/${id}`, {
    method: 'get',
  });

  return response;
};

/**
 * 获取所有项目
 * @returns
 */
export const getProjectList = async () => {
  if (isMock) {
    const list = [];
    const iter = await localforage.iterate(value => {
      //@ts-ignore
      if (value.isProject) {
        list.push(value);
      }
    });
    return list || [];
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/getall`, {
    method: 'get',
  });

  return response;
};

/**
 * 增加项目
 */
export const addProject = async (param: any) => {
  if (isMock) {
    const all = (await getProjectList()) as any[];
    return await localforage.setItem('projects', [...all, p]);
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/create`, {
    method: 'post',
    data: param,
  });

  console.log('addProject', response);

  return response;
};

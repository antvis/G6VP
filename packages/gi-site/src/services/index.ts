import localforage from 'localforage';

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
/**
 * 获取指定项目
 * @param id 项目id
 * @returns
 */
export const getProjectById = async (id: string) => {
  if (isMock) {
    return await localforage.getItem(id);
  }
  return await fetch('api:getProject');
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
  return await fetch('api:updateProject');
};

export const removeProjectById = async (id: string) => {
  if (isMock) {
    return await localforage.removeItem(id);
  }
  return await fetch('api:removeProjectById');
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
  return await fetch('api:getAllProjectList');
};

/**
 * 增加项目
 */
export const addProject = async (p: any) => {
  if (isMock) {
    const all = (await getProjectList()) as any[];
    return await localforage.setItem('projects', [...all, p]);
  }
  return await fetch('http://127.0.0.1:7001/create');
};

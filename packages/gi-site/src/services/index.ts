import localforage from 'localforage';
import request from 'umi-request';
import { getUid } from '../pages/Workspace/utils';
import { ASSET_TYPE, isMock, SERVICE_URL_PREFIX } from './const';

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
export const getProjectById = async (id: string) => {
  if (isMock) {
    const project: any = await localforage.getItem(id);
    return {
      schemaData: project.schemaData,
      config: project.projectConfig,
      data: project.data,
      activeAssetsKeys: project.activeAssetsKeys,
      name: project.name,
      serviceConfig: project.serviceConfig,
    };
  }

  const getResult = project => {
    const config = JSON.parse(project.projectConfig);

    const data = JSON.parse(project.data);
    const serviceConfig = JSON.parse(project.serviceConfig);
    let activeAssetsKeys;
    if (project.activeAssetsKeys) {
      activeAssetsKeys = JSON.parse(project.activeAssetsKeys);
    } else {
      activeAssetsKeys = {
        elements: [...config.nodes.map(node => node.id), ...config.edges.map(edge => edge.id)],
        components: [...config.components.map(c => c.id)],
        layouts: ['Grid', 'GraphinForce', 'D3Force', 'Concentric', 'Dagre', 'Radial', 'Circular'], // [config.layout.id],
      };
    }
    let currentSchema = {
      nodes: [],
      edges: [],
    };
    if (project.schemaData) {
      currentSchema = JSON.parse(project.schemaData);
    }

    return {
      config,
      data,
      activeAssetsKeys,
      name: project.name,
      serviceConfig,
      schemaData: currentSchema,
    };
  };

  // TODO response 返回为数组，应该返回为对象
  const response = await request(`${SERVICE_URL_PREFIX}/project/id`, {
    method: 'post',
    data: {
      id,
    },
  });
  if (response.success && response.data?.length > 0) {
    const res = response.data[0];
    return getResult(res);
  }
};

/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const updateProjectById = async (id: string, params: { data?: string; [key: string]: any }) => {
  if (isMock) {
    const origin: any = await localforage.getItem(id);
    const { data, serviceConfig, projectConfig, name, activeAssetsKeys, schemaData } = params;
    // 为了兼容OB的存储，仅为string，因此所有传入的数据格式都是string，但是本地IndexDB存储的是object
    // 未来也可以改造为出入params为对象，给到OB的借口全部JSON.stringify
    if (data) {
      origin.data = JSON.parse(data);
    }
    if (serviceConfig) {
      origin.serviceConfig = JSON.parse(serviceConfig);
    }
    if (projectConfig) {
      origin.projectConfig = JSON.parse(projectConfig);
    }
    if (schemaData) {
      origin.schemaData = JSON.parse(schemaData);
    }

    if (activeAssetsKeys) {
      origin.activeAssetsKeys = JSON.parse(activeAssetsKeys);
    }
    if (name) {
      origin.name = name;
    }
    return await localforage.setItem(id, origin);
  }

  params.id = id;

  const response = await request(`${SERVICE_URL_PREFIX}/project/update`, {
    method: 'post',
    data: params,
  });

  return response.success;
};

// 软删除项目
export const removeProjectById = async (id: string) => {
  if (isMock) {
    return await localforage.removeItem(id);
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/delete`, {
    method: 'post',
    data: {
      id,
    },
  });

  return response.success;
};

export interface Project {
  activeAssetsKeys: {
    components: string[];
    elements: string[];
    layouts: string[];
  };
  data: {
    transFunc?: string;
    transData: {
      nodes: any[];
      edges: any[];
    };
  };
  type: 'case' | 'project';
  id: string;
  members: { name: string; id: string; state: 'master' | 'user' }[];
  projectConfig: {};
  serviceConfig: {
    content: string;
    id: string;
    mode: 'MOCK' | 'API';
    name: string;
  }[];
  status?: number;
  tag?: string;
}
/**
 * 获取所有项目
 * @returns
 */
export const getProjectList = async (type: 'project' | 'case') => {
  if (isMock) {
    const projects = [];
    const cases = [];

    const iter = await localforage.iterate((value: Project) => {
      if (value.type === 'case') {
        cases.push(value);
      } else {
        projects.push(value);
      }
      // if (value.type === 'project') {
      //   projects.push(value);
      // }
    });
    console.log('case', cases, projects, iter);
    if (type === 'project') {
      return projects;
    }
    if (type == 'case') {
      return cases;
    }
    return projects;
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/list`, {
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
export const addProject = async (param: any) => {
  if (isMock) {
    const projectId = getUid();
    const { projectConfig, activeAssetsKeys, data, serviceConfig, schemaData, ...otherParams } = param;
    const p = {
      ...otherParams,
      schemaData: JSON.parse(schemaData),
      projectConfig: JSON.parse(projectConfig),
      activeAssetsKeys: JSON.parse(activeAssetsKeys),
      data: JSON.parse(data),
      serviceConfig: JSON.parse(serviceConfig),
      id: projectId,
      isProject: true,
      gmtCreate: new Date(),
    };
    localforage.setItem(projectId, p);
    return new Promise(resolve => {
      resolve(projectId);
    });
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/create`, {
    method: 'post',
    data: param,
  });

  if (response.success && response.data?.insertId) {
    return response.data?.insertId;
  }
};

/**
 * 收藏项目
 * @returns
 */
export const starProject = async (param: any) => {
  const response = await request(`${SERVICE_URL_PREFIX}/favorite/add`, {
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
  const response = await request(`${SERVICE_URL_PREFIX}/favorite/get`, {
    method: 'post',
    data: { assetType: ASSET_TYPE.PROJECT },
  });

  if (response.success) {
    return response.data;
  }
  return [];
};

import localforage from 'localforage';

export class GraphDataBase {
  source: any;
  constructor() { }
  graph() {
    return this.source;
  }
}

/** 未来 GraphDataBase 可以换成 neo4j 或者 geabase 等数据库服务 */
// const db = new GraphDataBase();

function looseJsonParse(obj) {
  return Function('"use strict";return (' + obj + ')')();
}

export const getGraphData = () => {
  return new Promise(async resolve => {
    const id = await localforage.getItem('projectId') as string;
    console.log(id);
    const project = await localforage.getItem(id);
    let { data, services } = project // db.graph();
    let transFn = data => {
      return data;
    };
    try {
      transFn = looseJsonParse(services.getGraphDataTransform);
    } catch (error) { }

    if (transFn) {
      data = transFn(data);
    }
    return resolve(data); //这里需要一个规范的图结构
    // 这里需要用户从组件市场里定义初始化逻辑
  });
};

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

/** 根据节点获取其一度关系 */
export const getSubGraphData = (ids: string[]) => {
  return new Promise(async resolve => {
    const id = await localforage.getItem('projectId') as string;
    let { data, services } = await localforage.getItem(id); // db.graph();
    let transFn = (data, ids) => {
      return data;
    };
    try {
      transFn = looseJsonParse(services.getSubGraphDataTransform);
      // 这里需要用户从组件市场里定义初始化逻辑
    } catch (error) { }

    if (transFn) {
      data = transFn(data, ids);
    }
    return resolve(data); //这里需要一个规范的图结构
  });
};

/** 企业图谱获取数据 */
export const getProfileData = () => {
  return new Promise(resolve => {
    const { nodes, edges } = enterprise.graphData;

    const renderNodes = nodes.map(n => {
      return { data: n, id: n.id }; // 这里需要在数据处理层，让用户自己指定ID
    });
    return resolve({
      nodes: renderNodes,
      edges,
    });
  });
};

/**
 * 获取指定项目
 * @param id 项目id
 * @returns 
 */
export const getProjectById = async (id: string) => {
  const p = await localforage.getItem(id);
  return p;
}

/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns 
 */
export const updateProjectById = async (id: string, p: any) => {
  return await localforage.setItem(id, p);
}

export const removeProjectById = async (id: string) => {
  return await localforage.removeItem(id);
}

/**
 * 获取所有项目
 * @returns 
 */
export const getProjectList = async () => {
  const list = [];
  const iter = await localforage.iterate((value) => {
    //@ts-ignore
    if (value.isProject) {
      list.push(value);
    }
  })
  return list || [];
}

/**
 * 增加项目
 */
export const addProject = async (p: any) => {
  const all = await getProjectList() as any[];
  return await localforage.setItem('projects', [...all, p]);
}
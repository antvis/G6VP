import localforage from 'localforage';
import { message } from 'antd';
export const getProjectById = async (id: string) => {
  const project: any = await localforage.getItem(id);
  if (!project) {
    message.info('请先在「工作台」页面选择环境...');
    //可能是用户第一进来的时候，没有选择环境
    window.location.href = window.location.origin;
  }

  return {
    schemaData: project.schemaData,
    config: project.projectConfig,
    data: project.data,
    activeAssetsKeys: project.activeAssetsKeys,
    name: project.name,
    serviceConfig: project.serviceConfig,
    type: project.type,
  };
};

/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const updateProjectById = async (id: string, params: { data?: string; [key: string]: any }) => {
  const origin: any = await localforage.getItem(id);
  const { data, serviceConfig, projectConfig, name, activeAssetsKeys, schemaData, expandInfo, type } = params;
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

  if (expandInfo) {
    origin.expandInfo = JSON.parse(expandInfo);
  }

  /* if (type) {
        origin.type = type;
      } */
  return await localforage.setItem(id, origin);
};

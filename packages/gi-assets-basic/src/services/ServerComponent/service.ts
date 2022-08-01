import localforage from 'localforage';
import { message } from 'antd';
import { utils } from '@alipay/graphinsight';
import { GraphinData } from '@antv/graphin';
import { notification } from 'antd';
import { IInputData } from './type';

const { generatorSchemaByGraphData, generatorStyleConfigBySchema } = utils;

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

  return await localforage.setItem(id, origin);
};

export const updateData = async (transData: GraphinData, inputData: IInputData[], transfunc: string) => {
  try {
    if (transData.nodes?.find(d => d.id === undefined || d.data === undefined)) {
      throw 'nodes缺少对应字段';
    }
    if (transData.edges?.find(d => d.source === undefined || d.target === undefined || d.data === undefined)) {
      throw 'edges缺少对应字段';
    }

    // 对于GI平台，是这样取得projectId的
    const hash = window.location.hash;
    const id = hash.split('/')[2].split('?')[0];

    const result = await getProjectById(id);

    const beforData = result.data.transData;
    const mergeData = {
      nodes: [...beforData.nodes, ...transData.nodes],
      edges: [...beforData.edges, ...transData.edges],
    };

    // 进入分析之前，根据数据，生成 schema

    const schemaData = generatorSchemaByGraphData(mergeData);
    const newConfig = generatorStyleConfigBySchema(schemaData, result.config);

    // 更新inputdata里面的 trans function
    const renderData = inputData.map(d => {
      return {
        ...d,
        transfunc,
      };
    });

    console.log('renderData:', renderData);

    updateProjectById(id, {
      data: JSON.stringify({
        transData: mergeData,
        inputData: [...result.data.inputData, ...renderData],
      }),
      // schemaData: schemaData,
      projectConfig: JSON.stringify(newConfig),
      schemaData: JSON.stringify(schemaData),
    }).then(res => {
      location.reload();
    });

    notification.success({
      message: `解析成功`,
      description: `数据格式正确`,
      placement: 'topLeft',
    });
  } catch (error) {
    notification.error({
      message: `解析出错`,
      description: `请检查数据是否为严格JSON格式且存在对应字段:${error}`,
      placement: 'topLeft',
    });
  }
};

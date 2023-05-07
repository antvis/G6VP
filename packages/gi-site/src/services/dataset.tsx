import { GI_DATASET_DB, GI_PROJECT_DB } from '../hooks/useUpdate';
import { GI_SITE } from './const';
import DATASET_CASE from './initial.data/default.case';
import { IDataset } from './typing';
import { request } from './utils';
/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const queryDatasetInfo = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    return await GI_DATASET_DB.getItem(id);
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/${id}`, {
      method: 'get',
    });
    return response.data;
  }
};

export const createDataset = async (params: IDataset) => {
  if (GI_SITE.IS_OFFLINE) {
    return await GI_DATASET_DB.setItem(params.id, params);
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/create`, {
      method: 'post',
      data: params,
    });
    return response.success;
  }
};
/**
 * 请求不在回收站中的可用数据集
 * @returns
 */
export const allLists = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      if (!item.recycleTime) {
        res.push(item);
      }
    });
    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/list`, {
      method: 'get',
    });

    return response.data.filter(item => !item.recycleTime);
  }
};

/**
 * 请求不在回收站中的可用数据集
 * @returns
 */
export const queryDatasetList = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      if (item.type === 'user' && !item.recycleTime) {
        res.push(item);
      }
    });
    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/list`, {
      method: 'get',
    });

    return response.data.filter(item => item.type === 'user');
  }
};
/**
 * 请求在回收站中的、未过期的数据集
 * 该函数在寻找回收站数据集的同时，删除已过期的数据集及其相关项目
 * @returns
 */
export const queryRecycleDatasetList = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      const { id, type, recycleTime } = item;
      if (type === 'user' && recycleTime) {
        // delete the data set with over 7 days item.recycleTime
        const expired = new Date().getTime() - recycleTime > 604800000;
        if (expired) {
          deleteDataset(id);
        } else {
          res.push(item);
        }
      }
    });
    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/listRecycles`, {
      method: 'get',
    });
    return response.data.filter(item => item.type === 'user');
  }
};

/**
 * 将数据集从回收站移除，即将 recycleTime 标记删除
 * 同时，相关项目的标记也被删除
 * @param record
 */
export const recoverDataset = async record => {
  const { id } = record;
  if (GI_SITE.IS_OFFLINE) {
    const item = await GI_DATASET_DB.getItem(id);

    if (item) GI_DATASET_DB.setItem(id, { ...item, recycleTime: undefined });
    await GI_PROJECT_DB.iterate(project => {
      //@ts-ignore
      const { datasetId, id: PROJECT_ID } = project;
      if (datasetId === id) {
        //@ts-ignore
        GI_PROJECT_DB.setItem(PROJECT_ID, { ...project, recycleTime: undefined });
      }
    });
    return item;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/recover`, {
      method: 'post',
      data: { id },
    });
    return response.data;
  }
};

export const systemDirectConnectList = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      if (item.type == 'system') {
        res.push(item);
      }
    });
    return res;
  }

  const response = await request(`${GI_SITE.SERVICE_URL}/dataset/list`, {
    method: 'get',
  });
  const systemDatasets = response.data.filter(item => {
    return item.type === 'system';
  });

  return systemDatasets;
};

/**
 * 正式删除数据集，及其相关工作簿
 * @param id
 * @returns
 */
export const deleteDataset = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    const res = await GI_DATASET_DB.getItem(id);
    GI_DATASET_DB.removeItem(id);
    /** 删除数据集的同时，删除对应的工作薄 */
    GI_PROJECT_DB.iterate(item => {
      //@ts-ignore
      const { datasetId, id: PROJECT_ID } = item;
      if (datasetId === id) {
        GI_PROJECT_DB.removeItem(PROJECT_ID);
      }
    });
    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/delete`, {
      method: 'post',
      data: { id },
    });
    return response.data;
  }
};

/**
 * 将数据集放入回收站（即打 recycleTime 标记记录回收时间），
 * 同时，相关项目也将打上该标记，未过期时，项目仍可用
 * @param id
 */
export const recycleDataset = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    const recycleTime = new Date().getTime();
    const dataset = await GI_DATASET_DB.getItem(id);
    if (dataset) GI_DATASET_DB.setItem(id, { ...dataset, recycleTime });
    /** 数据集进入回收站的同时，对应的工作薄打标 */
    await GI_PROJECT_DB.iterate((item: IDataset) => {
      //@ts-ignore
      const { datasetId, id: PROJECT_ID, type } = item;
      if (datasetId === id) {
        GI_PROJECT_DB.setItem(PROJECT_ID, { ...item, recycleTime });
      }
    });
    return dataset;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/recycle`, {
      method: 'post',
      data: { id },
    });
    return response.success;
  }
};

export const findCase = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      if (item.type === 'case') {
        res.push(item);
      }
    });
    if (res.length !== DATASET_CASE.length) {
      //@ts-ignore
      res.push(...DATASET_CASE);
      for (const item of DATASET_CASE) {
        await GI_DATASET_DB.setItem(item.id, item);
      }
    }

    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/case`, {
      method: 'get',
    });
    return response.data;
  }
};

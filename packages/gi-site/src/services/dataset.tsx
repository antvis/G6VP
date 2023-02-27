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

export const queryDatasetList = async () => {
  if (GI_SITE.IS_OFFLINE) {
    const res: IDataset[] = [];
    await GI_DATASET_DB.iterate((item: IDataset) => {
      if (item.type === 'user') {
        res.push(item);
      }
    });
    return res;
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/list`, {
      method: 'get',
    });

    return response.data.filter(item => {
      return item.type === 'user';
    });
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

export const deleteDataset = async (id: string) => {
  if (GI_SITE.IS_OFFLINE) {
    GI_DATASET_DB.removeItem(id);
    /** 删除数据集的同时，删除对应的工作薄 */
    GI_PROJECT_DB.iterate(item => {
      //@ts-ignore
      const { datasetId, id: PROJECT_ID } = item;
      if (datasetId === id) {
        GI_PROJECT_DB.removeItem(PROJECT_ID);
      }
    });
  } else {
    const response = await request(`${GI_SITE.SERVICE_URL}/dataset/delete`, {
      method: 'post',
      data: { id },
    });
    return response.data;
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

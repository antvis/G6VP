import { GI_DATASET_DB } from '../hooks/useUpdate';
import { getUid } from '../pages/Workspace/utils';
import { IS_INDEXEDDB_MODE, SERVICE_URL_PREFIX } from './const';
import { IDataset } from './typing';
import { request } from './utils';
/**
 * 更新或保存指定项目
 * @param id 项目id
 * @param p 项目配置
 * @returns
 */
export const queryDatasetInfo = async (id: string) => {
  /** 如果是在线模式，则备份一份 **/
  if (!IS_INDEXEDDB_MODE) {
    const response = await request(`${SERVICE_URL_PREFIX}/dataset/${id}`, {
      method: 'get',
    });
    return response.success;
  } else {
    return await GI_DATASET_DB.getItem(id);
  }
};

export const createDataset = async (params: IDataset) => {
  /** 如果是在线模式，则备份一份 **/
  if (IS_INDEXEDDB_MODE) {
    const dsId = `ds_${getUid()}`;
    return await GI_DATASET_DB.setItem(dsId, {
      id: dsId,
      ...params,
    });
  } else {
    const response = await request(`${SERVICE_URL_PREFIX}/dataset/${id}`, {
      method: 'get',
    });
    return response.success;
  }
};

export const queryDatasetList = async () => {
  /** 如果是在线模式，则备份一份 **/
  if (IS_INDEXEDDB_MODE) {
    const res = [];
    await GI_DATASET_DB.iterate(item => {
      //@ts-ignore
      res.push(item);
    });
    return res;
  } else {
    const response = await request(`${SERVICE_URL_PREFIX}/dataset/list`, {
      method: 'get',
    });
    return response.success;
  }
};

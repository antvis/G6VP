import localforage from 'localforage';

/** 当前是否是Mock模式 */
export const isMock = true;

/** 获取项目详情 */
export const getProjectById = (projectId: string) => {
  if (isMock) {
    return localforage.getItem(projectId);
  }
  // oneApi 接口
};

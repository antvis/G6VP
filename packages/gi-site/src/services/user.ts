import { request } from './utils';

export const getUser = async () => {
  /**  仅针对内网用户，进行用户访问记录 */
  const SERVICE_URL_PREFIX = 'https://graphinsight.antgroup-inc.cn';
  const response = await request(`${SERVICE_URL_PREFIX}/user/info`, {
    method: 'get',
  });
  if (response.success && response.data) {
    return response.data;
  }
};

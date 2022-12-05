import { SERVICE_URL_PREFIX } from './const';
import { request } from './utils';

export const getUser = async () => {
  const response = await request(`${SERVICE_URL_PREFIX}/user/info`, {
    method: 'get',
  });

  if (response.success && response.data) {
    return response.data;
  }
};

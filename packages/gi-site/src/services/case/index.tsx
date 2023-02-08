import { IS_INDEXEDDB_MODE, SERVICE_URL_PREFIX } from '../const';
import { ICase } from '../typing';
import { request } from '../utils';
import BANK_CASE from './bank';
import SECURITY_NETWORK from './security-network';

export const queryCaseList = async (): Promise<ICase[]> => {
  if (IS_INDEXEDDB_MODE) {
    const cases = [BANK_CASE, SECURITY_NETWORK];
    cases.forEach(item => {
      //@ts-ignore
      GI_PROJECT_DB.setItem(item.id, item);
    });
    return new Promise(resolve => {
      resolve(cases);
    });
  }

  const response = await request(`${SERVICE_URL_PREFIX}/project/case`, {
    method: 'get',
  });

  if (response && response.success) {
    return response.data;
  }

  return [BANK_CASE, SECURITY_NETWORK];
};

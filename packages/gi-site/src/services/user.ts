// import { request } from './utils';
import { message } from 'antd';
import request from 'umi-request';
import { GI_SITE } from './const';

export const getUser = async () => {
  /**  仅针对内网用户，进行用户访问记录 */
  const response = await request(`${GI_SITE.SERVICE_URL}/user/info`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    credentials: 'include',
    withCredentials: true, // 携带cookie
    timeout: 8000,
  }).catch(error => {
    const errorMessage = String(error);
    const timeoutMessage = 'RequestError: timeout of 8000ms exceeded';
    if (timeoutMessage === errorMessage) {
      console.log('登陆超时：网络问题，无法下发私域的 VIP 资产');
    } else {
      console.log('正在尝试访问 VIP 资产服务');
      message.info('正在尝试访问 VIP 资产服务');
      window.open(`${GI_SITE.SERVICE_URL}/user/info`, '_target');
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
    return {};
  });
  if (response.success && response.data) {
    // return response.data;
    const { data } = response;
    return data;
  }
};

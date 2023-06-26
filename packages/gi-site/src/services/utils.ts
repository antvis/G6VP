import { notification } from 'antd';
import { extend } from 'umi-request';
import $i18n from '../i18n';
const errorHandler = error => {
  console.log('error', JSON.stringify(error));
  if (error.type === 'TypeError') {
    console.log($i18n.get({ id: 'gi-site.src.services.utils.NetworkProblems', dm: '网路问题' }));
    notification.error({
      message: $i18n.get({ id: 'gi-site.src.services.utils.NetworkProblems.1', dm: '网络问题' }),
      description: 'TypeError',
    });
  }
  throw error;
};
export const request = extend({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  credentials: 'include',
  withCredentials: true, // 携带cookie
  errorHandler,
});

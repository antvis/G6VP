import { notification } from 'antd';
import { extend } from 'umi-request';
const errorHandler = error => {
  console.log('error', JSON.stringify(error));
  if (error.type === 'TypeError') {
    console.log('网路问题');
    notification.error({
      message: '网络问题',
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

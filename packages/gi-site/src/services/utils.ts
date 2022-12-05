import { extend } from 'umi-request';

export const request = extend({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  credentials: 'include',
  withCredentials: true, // 携带cookie
});

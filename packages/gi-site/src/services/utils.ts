import { extend } from 'umi-request';

// const errorHandler = error => {
//   console.log('errorHandler', error);
// };
export const request = extend({
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
  credentials: 'include',
  withCredentials: true, // 携带cookie
  // errorHandler,
});

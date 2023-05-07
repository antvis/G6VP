// import { request } from './utils';
import { Button, notification, Space } from 'antd';
import React from 'react';
import request from 'umi-request';
import { GI_SITE } from './const';

const key = `open${Date.now()}`;
const btn = (
  <Space>
    <Button
      type="primary"
      size="small"
      onClick={() => {
        window.location.reload();
      }}
    >
      确认
    </Button>

    <Button size="small" onClick={() => notification.close(key)}>
      取消
    </Button>
  </Space>
);

const createSuperLabel = (url, id) => {
  let a = document.createElement('a');
  a.setAttribute('href', url);
  a.setAttribute('target', '_blank');
  a.setAttribute('id', id);
  // 防止反复添加
  if (!document.getElementById(id)) {
    document.body.appendChild(a);
  }
  a.click();
};

export const getUser = async () => {
  /**  仅针对内网用户，进行用户访问记录 */
  const response = await request(`${GI_SITE.SERVICE_URL}/user/info`, {
    method: 'get',
    headers: {
      'Content-Type': 'application/json;charset=utf-8',
    },
    credentials: 'include',
    withCredentials: true, // 携带cookie
    timeout: 4000,
  }).catch(error => {
    const errorMessage = String(error);
    if (errorMessage === 'RequestError: timeout of 4000ms exceeded') {
      // 互联网公网环境
      console.log('登陆超时：RequestError: timeout of 4000ms exceeded');
      return {};
    }
    if (errorMessage === 'ResponseError: http error') {
      // 独立部署，或者云端模式
      console.log('请求出错：ResponseError: http error');
      return {};
    }
    if (errorMessage === 'TypeError: Failed to fetch') {
      console.log('尝试访问 VIP 资产服务 TypeError: Failed to fetch');
      createSuperLabel(`${GI_SITE.SERVICE_URL}/user/info`, 'gi-login');
      notification.info({
        placement: 'top',
        message: '刷新页面',
        duration: null,
        description: '系统已自动跳转到登录链接，请登录完成后，刷新页面，从而下发 VIP 资产',
        btn,
        key,
      });
      return {};
    }
    return {};
  });
  if (response.success && response.data) {
    // return response.data;
    const { data } = response;
    return data;
  }
};

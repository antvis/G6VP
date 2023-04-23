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
    timeout: 8000,
  }).catch(error => {
    const errorMessage = String(error);
    const timeoutMessage = 'RequestError: timeout of 8000ms exceeded';
    if (timeoutMessage === errorMessage) {
      console.log('登陆超时：网络问题，无法下发私域的 VIP 资产');
    } else {
      console.log('正在尝试访问 VIP 资产服务');
      createSuperLabel(`${GI_SITE.SERVICE_URL}/user/info`, 'gi-login');
      notification.info({
        placement: 'top',
        message: '刷新页面',
        duration: null,
        description: '系统已自动跳转到登录链接，请登录完成后，刷新页面，从而下发 VIP 资产',
        btn,
        key,
      });
    }
    return {};
  });
  if (response.success && response.data) {
    // return response.data;
    const { data } = response;
    return data;
  }
};

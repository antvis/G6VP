import { CrownTwoTone } from '@ant-design/icons';
import { Button, Space, notification, Modal } from 'antd';
import { getSearchParams } from '../components/utils';
import React from 'react';
import { request } from './utils';
import $i18n from '../i18n';
import { GI_SITE } from './const';

const key = `open${Date.now()}`;
const Btn = () => {
  const [clicked, setClicked] = React.useState(false);

  return (
    <Space>
      <Button
        type="primary"
        size="small"
        onClick={() => {
          if (!clicked) {
            createSuperLabel(`${GI_SITE.SERVICE_URL}/user/info`, 'gi-login');
            setClicked(true);
          } else window.location.reload();
        }}
      >
        {!clicked
          ? $i18n.get({ id: 'gi-site.src.services.user.Get', dm: '获取' })
          : $i18n.get({ id: 'gi-site.src.services.user.Confirm', dm: '刷新' })}
      </Button>

      {!clicked && (
        <Button size="small" onClick={() => notification.close(key)}>
          {$i18n.get({ id: 'gi-site.src.services.user.Cancel', dm: '取消' })}
        </Button>
      )}
    </Space>
  );
};

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
      console.log(
        $i18n.get({
          id: 'gi-site.src.services.user.LogonTimeoutRequesterrorTimeoutOf',
          dm: '登陆超时：RequestError: timeout of 4000ms exceeded',
        }),
      );
      return {};
    }
    if (errorMessage === 'ResponseError: http error') {
      // 独立部署，或者云端模式
      console.log(
        $i18n.get({
          id: 'gi-site.src.services.user.RequestErrorResponseerrorHttpError',
          dm: '请求出错：ResponseError: http error',
        }),
      );
      return {};
    }
    if (errorMessage === 'TypeError: Failed to fetch') {
      notification.info({
        icon: <CrownTwoTone twoToneColor="#f1d247" />,
        placement: 'top',
        message: $i18n.get({ id: 'gi-site.src.services.user.AvailableVipAssets', dm: '可用的 VIP 资产' }),
        description: $i18n.get({
          id: 'gi-site.src.services.user.DetectedAvailableVipAssetsWhether',
          dm: '检测到可用的 VIP 资产，是否前往登陆获取',
        }),
        duration: null,

        btn: <Btn />,
        key,
      });
      return {};
    }
    return {};
  });
  if (response.success && response.data) {
    // return response.data;
    // 根据参数 切换存储环境
    const { searchParams } = getSearchParams(window.location);
    const GI_SITE_ENV = searchParams.get('GI_SITE_ENV');
    if (GI_SITE_ENV && localStorage.getItem('GI_SITE_ENV') !== GI_SITE_ENV) {
      localStorage.setItem('GI_SITE_ENV', GI_SITE_ENV === 'ONLINE' ? 'ONLINE' : 'OFFLINE');
      return window.location.reload();
    }
    const { data } = response;
    return data;
  }
};

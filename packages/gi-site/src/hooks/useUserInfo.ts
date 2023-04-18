import { useEffect, useState } from 'react';
import { getUser } from '../services/user';

export const setAssetPackages = newAssets => {
  const prevAssets = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  newAssets.forEach(pkg => {
    const { global } = pkg;
    const prev = prevAssets[global];
    if (prev) {
      prevAssets[global] = pkg.version < prev.version ? prev : pkg;
    } else {
      prevAssets[global] = pkg;
    }
  });
  localStorage.setItem('GI_ASSETS_PACKAGES', JSON.stringify(prevAssets));
};

export const getLoginUserInfo = async () => {
  // 仅针对内网用户进行用户访问记录
  try {
    const result = await getUser();
    const VIP_ASSETS = await fetch('https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/json/assets.json').then(res =>
      res.json(),
    );
    if (result) {
      setAssetPackages(VIP_ASSETS); //暂时移除从user中获取资产信息
      //@ts-ignore
      window.GI_USER_INFO = result;
      return result;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};

export default () => {
  const [GI_USER_INFO, setUserInfo] = useState(null);

  useEffect(() => {
    try {
      getLoginUserInfo().then(res => {
        if (res) {
          const { assets, outUserNo } = res;
          //@ts-ignore
          window.Tracert.call('set', { roleId: outUserNo });
          //@ts-ignore
          if (Tracert.ready) {
            //@ts-ignore
            window.Tracert.call('logPv');
            //@ts-ignore
            window.Tracert.call('expoCheck');
          }
          setUserInfo(res);
        }
      });
    } catch (error) {}
  }, []);

  return GI_USER_INFO;
};

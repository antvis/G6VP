import { useEffect, useState } from 'react';
import { getUser } from '../services/user';

const ASSETS_PACKAGES_KEY = 'GI_ASSETS_PACKAGES';
const VIP_ASSETS_RETRIEVED_KEY = 'GI_VIP_ASSETS_RETRIEVED';

export const setAssetPackages = newAssets => {
  const prevAssets = JSON.parse(localStorage.getItem(ASSETS_PACKAGES_KEY) || '{}');
  newAssets.forEach(pkg => {
    const { global } = pkg;
    const prev = prevAssets[global];
    if (prev) {
      prevAssets[global] = pkg.version < prev.version ? prev : pkg;
    } else {
      prevAssets[global] = pkg;
    }
  });
  localStorage.setItem(ASSETS_PACKAGES_KEY, JSON.stringify(prevAssets));
};

export const getLoginUserInfo = async () => {
  // 仅针对内网用户进行用户访问记录
  try {
    const result = await getUser();
    if (result) {
      if (!localStorage.getItem(VIP_ASSETS_RETRIEVED_KEY)) {
        const VIP_ASSETS = await fetch('https://unpkg.alipay.com/@alipay/gi-assets-vip@latest/json/assets.json').then(
          res => res.json(),
        );
        setAssetPackages(VIP_ASSETS);
        localStorage.setItem(VIP_ASSETS_RETRIEVED_KEY, new Date().toLocaleString());
      }

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

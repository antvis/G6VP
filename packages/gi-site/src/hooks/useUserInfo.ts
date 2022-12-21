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

export default () => {
  const [GI_USER_INFO, setUserInfo] = useState(null);

  const getLoginUserInfo = async () => {
    // 仅针对内网用户进行用户访问记录
    try {
      const result = await getUser();
      if (result) {
        const { assets, outUserNo } = result;
        //@ts-ignore
        window.Tracert.call('set', { roleId: outUserNo });
        //@ts-ignore
        if (Tracert.ready) {
          //@ts-ignore
          window.Tracert.call('logPv');
          //@ts-ignore
          window.Tracert.call('expoCheck');
        }
        setAssetPackages(assets);
        setUserInfo(result);
        //@ts-ignore
        window.GI_USER_INFO = result;
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    try {
      getLoginUserInfo();
    } catch (error) {}
  }, []);

  return GI_USER_INFO;
};

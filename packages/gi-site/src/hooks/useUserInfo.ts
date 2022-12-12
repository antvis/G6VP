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
  const [userInfo, setUserInfo] = useState(null);

  const getLoginUserInfo = async () => {
    // 仅针对内网用户进行用户访问记录
    try {
      const result = await getUser();
      if (result) {
        const { assets, nickName, outUserNo } = result;
        //@ts-ignore
        window.Tracert.start({ roleId: outUserNo });
        setAssetPackages(assets);
        setUserInfo(result);
        window.localStorage.setItem('userInfo', nickName);
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

  return userInfo;
};

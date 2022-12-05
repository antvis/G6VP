import { useEffect, useState } from 'react';
import { IS_INDEXEDDB_MODE } from '../services/const';
import { getUser } from '../services/user';

export const setAssetPackages = newAssets => {
  const prevAssets = JSON.parse(localStorage.getItem('GI_ASSETS_PACKAGES') || '{}');
  console.log('prevAssets', prevAssets);
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
    try {
      const result = await getUser();
      if (result) {
        const { assets, nickName } = result;
        setAssetPackages(assets);
        setUserInfo(result);
        window.localStorage.setItem('userInfo', nickName);
      }
    } catch (error) {}
  };

  useEffect(() => {
    if (!IS_INDEXEDDB_MODE) {
      getLoginUserInfo();
    }
  }, []);

  return userInfo;
};

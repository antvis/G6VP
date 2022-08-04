import { useEffect, useState } from 'react';
import { getUser } from '../services/user';
import { IS_LOCAL_ENV } from '../services/const';

export default () => {
  const [userInfo, setUserInfo] = useState(null);

  const getLoginUserInfo = async () => {
    const result = await getUser();
    if (result) {
      setUserInfo(result);
      window.localStorage.setItem('userInfo', result.nickName);
    }
  };

  useEffect(() => {
    if (!IS_LOCAL_ENV) {
      getLoginUserInfo();
    }
  }, []);

  return userInfo;
};

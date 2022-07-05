import { useEffect, useState } from 'react';
import { getUser } from '../services/user';

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
    getLoginUserInfo();
  }, []);

  return userInfo;
};

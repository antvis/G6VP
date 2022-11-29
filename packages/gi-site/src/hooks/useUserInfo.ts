import { useEffect, useState } from 'react';
import { IS_INDEXEDDB_MODE } from '../services/const';
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
    if (!IS_INDEXEDDB_MODE) {
      getLoginUserInfo();
    }
  }, []);

  return userInfo;
};

import { Avatar } from 'antd';
import * as React from 'react';
import useUserInfo from '../../hooks/useUserInfo';
interface UserInfoProps {}

const UserInfo: React.FunctionComponent<UserInfoProps> = props => {
  const GI_USER_INFO = useUserInfo() as any;
  return (
    <>
      {GI_USER_INFO && (
        <Avatar
          style={{ width: '24px', height: '24px', marginLeft: 8 }}
          src={`https://work.alibaba-inc.com/photo/${GI_USER_INFO && GI_USER_INFO.outUserNo}.220x220.jpg`}
        />
      )}
    </>
  );
};

export default UserInfo;

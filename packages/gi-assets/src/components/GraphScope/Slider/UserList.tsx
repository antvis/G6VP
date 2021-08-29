import React from 'react';
import './style.less';

export default ({ userList = [] }: { userList: { id: string; avatar_url: string }[] }) => {
  return (
    <ul className="graphinSight_sider_user_list">
      {userList.map(item => (
        <li className="single_user" key={item.id}>
          <div className="user_avatar_box">
            <img className="user_avatar" src={item.avatar_url} />
          </div>
          <span className="user_id">{item.id}</span>
        </li>
      ))}
    </ul>
  );
};

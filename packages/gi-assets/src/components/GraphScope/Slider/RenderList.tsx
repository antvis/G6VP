import { Spin } from 'antd';
import React from 'react';
import { getSpliceUrl } from './const';
import './style.less';

export default ({
  userList = [],
  isRepository,
  loading,
}: {
  userList: string[];
  isRepository?: boolean;
  loading?: boolean;
}) => {
  return (
    <Spin spinning={loading}>
      <ul
        style={{ minHeight: loading ? '48px' : 0 }} // 没有数据时，留出一些loading高度
        className="graphinSight_sider_user_list"
      >
        {!loading &&
          userList.map((item: any) => (
            <li className="single_user" key={isRepository ? item : item.id}>
              {!isRepository && (
                <div className="user_avatar_box">
                  <img className="user_avatar" src={getSpliceUrl(item.avatar_url)} />
                </div>
              )}
              <span className="user_id">{isRepository ? item : item.id}</span>
            </li>
          ))}
      </ul>
    </Spin>
  );
};

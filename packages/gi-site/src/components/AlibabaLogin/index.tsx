import { AlibabaOutlined } from '@ant-design/icons';
import { Button, Popover } from 'antd';
import React from 'react';
const Notification = () => {
  const content = (
    <div>
      <p>蚂蚁集团，阿里集团的同学，可以访问 GraphInsight 域内站点啦 🎉</p>
      <p>✅ 支持域内用户，数据存放在云端，可根据权限进行查看与分享</p>
      <p>✅ 支持域内用户，根据权限，新增/查看/使用 业务沉淀的图分析资产</p>
      <p>✅ 支持集团用户，使用 ODPS 数据源，GraphScope 图计算。蚂蚁暂不支持</p>
    </div>
  );

  const handleClick = () => {
    window.location.href = 'https://graphinsight.antgroup-inc.cn/#/workspace';
  };

  return (
    <>
      <Popover title="阿里域登陆" content={content} placement="bottom" trigger="hover">
        <Button icon={<AlibabaOutlined style={{ color: '#ff6a01' }} />} onClick={handleClick}>
          阿里域登陆
        </Button>
      </Popover>
    </>
  );
};

export default Notification;

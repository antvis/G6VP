import { BugOutlined } from '@ant-design/icons';
import { Button, Popover, Menu } from 'antd';
import React from 'react';
import { QR_URL } from '../../services/const';
import './index.less';

const QRcode = () => {
  const menu = (
    <div>
      <img style={{ width: '200px' }} alt="QRcode" src={QR_URL} />
      <Menu>
        <Menu.Item
          style={{ textAlign: 'center' }}
          onClick={() => {
            window.open('https://github.com/antvis/G6VP/issues', '_blank');
          }}
        >
          提需求/Bug
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <Popover overlayClassName="feedback-popover" placement="bottom" content={menu} trigger="hover">
      <Button icon={<BugOutlined />}>反馈</Button>
    </Popover>
  );
};

export default QRcode;

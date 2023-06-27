import { BugOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import React from 'react';
import { QR_URL } from '../../services/const';
import $i18n from '../../i18n';
import './index.less';

const QRcode = () => {
  const menu = (
    <div
      style={{
        boxShadow: ' -6px 0 16px -8px #00000014, -9px 0 28px #0000000d, -12px 0 48px 16px #00000008',
      }}
    >
      <img style={{ width: '200px' }} alt="QRcode" src={QR_URL} />
      <Menu>
        <Menu.Item
          style={{ textAlign: 'center' }}
          onClick={() => {
            window.open('https://github.com/antvis/G6VP/issues', '_blank');
          }}
        >
          {$i18n.get({ id: 'gi-site.components.QRcode.RequestBug', dm: '提需求/Bug' })}
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <Dropdown placement="bottom" overlay={menu}>
      <Button icon={<BugOutlined />}>{$i18n.get({ id: 'gi-site.components.QRcode.Feedback', dm: '反馈' })}</Button>
    </Dropdown>
  );
};

export default QRcode;

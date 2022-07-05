import { BugOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import './index.less';
const QRcode = () => {
  const menu = (
    <div
      style={{
        boxShadow: ' -6px 0 16px -8px #00000014, -9px 0 28px #0000000d, -12px 0 48px 16px #00000008',
      }}
    >
      <img
        style={{ width: '200px' }}
        alt="QRcode"
        src="https://gw.alipayobjects.com/mdn/rms_0d75e8/afts/img/A*-UliQ4r_UnkAAAAAAAAAAAAAARQnAQ"
      />
      <Menu>
        <Menu.Item
          style={{ textAlign: 'center' }}
          onClick={() => {
            window.open('https://github.com/antvis/GraphInsight/issues', '_blank');
          }}
        >
          提需求/Bug
        </Menu.Item>
      </Menu>
    </div>
  );

  return (
    <Dropdown placement="bottom" overlay={menu}>
      <Button icon={<BugOutlined />}>社区反馈</Button>
    </Dropdown>
  );
};

export default QRcode;

import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu } from 'antd';
import * as React from 'react';

const MAP = {
  card: <AppstoreOutlined />,
  table: <BarsOutlined />,
};
interface ViewModeProps {
  value: 'table' | 'card';
  onChange: (val: 'table' | 'card') => void;
}

const ViewMode: React.FunctionComponent<ViewModeProps> = props => {
  const { value, onChange } = props;
  const menu = (
    <Menu
      items={[
        {
          key: 'table',
          label: (
            <span
              onClick={() => {
                onChange('table');
              }}
            >
              表格模式
            </span>
          ),
        },
        {
          key: 'card',
          label: (
            <span
              onClick={() => {
                onChange('card');
              }}
            >
              卡片模式
            </span>
          ),
        },
      ]}
    />
  );
  return (
    <div>
      <Dropdown overlay={menu} placement="bottomLeft">
        <Button>{MAP[value]}</Button>
      </Dropdown>
    </div>
  );
};

export default ViewMode;

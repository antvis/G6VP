import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import * as React from 'react';

interface ViewModeProps {
  value: 'table' | 'card';
  onChange: (val: 'table' | 'card') => void;
}

const ViewMode: React.FunctionComponent<ViewModeProps> = props => {
  const { value, onChange } = props;

  return (
    <div>
      <Segmented
        onChange={val => {
          //@ts-ignore
          onChange(val);
        }}
        options={[
          {
            value: 'card',
            icon: <AppstoreOutlined />,
          },
          {
            value: 'table',
            icon: <BarsOutlined />,
          },
        ]}
      />
    </div>
  );
};

export default ViewMode;

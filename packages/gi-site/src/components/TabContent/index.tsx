import { Menu, Typography } from 'antd';
import React from 'react';
import './index.less';

const { Title } = Typography;

const TabContent = props => {
  const { list, children, onChange } = props;

  const [current, setCurrent] = React.useState(list.children[0]?.label);

  const handleClick = e => {
    setCurrent(e.item.props.title);
    onChange(e.key);
  };

  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Menu style={{ width: 256 }} onClick={handleClick} defaultSelectedKeys={[list.children[0]?.id]} mode="inline">
        {/* <Menu.ItemGroup key={list.title} title={list.title}></Menu.ItemGroup> */}
        {list.children?.map(item => (
          <Menu.Item key={item.id} title={item.label}>
            {item.label}
          </Menu.Item>
        ))}
      </Menu>
      <div style={{ padding: 15, width: '100%' }}>
        <Title level={2}>{current}</Title>
        {children}
      </div>
    </div>
  );
};

export default TabContent;

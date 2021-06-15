import { Menu, Typography } from 'antd';
import React from 'react';

const { Title, Paragraph } = Typography;

const TabContent = props => {
  const { list } = props;

  const [current, setCurrent] = React.useState(list.title);

  const handleClick = e => {
    setCurrent(e.key);
  };

  return (
    <div style={{ display: 'flex' }}>
      <Menu style={{ width: 256 }} onClick={handleClick} defaultSelectedKeys={[list.title]} mode="inline">
        <Menu.Item key={list.title}>{list.title}</Menu.Item>
        {list.children?.map(item => (
          <Menu.Item key={item.label}>{item.label}</Menu.Item>
        ))}
      </Menu>
      <div style={{ padding: 15 }}>
        <Title level={2}>{current}</Title>
        <div>
          <div className="view"></div>
          <div className="config"></div>
          <div className="code-view"></div>
        </div>
      </div>
    </div>
  );
};

export default TabContent;

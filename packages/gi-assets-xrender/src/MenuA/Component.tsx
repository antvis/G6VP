import { Menu } from 'antd';
import * as React from 'react';

export interface MenuA {
  contextmenu: any;
}

const MenuA: React.FunctionComponent<MenuA> = props => {
  const { contextmenu } = props;
  const { onClose } = contextmenu || {};
  console.log('render....');
  return (
    <Menu.Item key="menu-a" onClick={onClose}>
      Test Menu A
    </Menu.Item>
  );
};

export default MenuA;

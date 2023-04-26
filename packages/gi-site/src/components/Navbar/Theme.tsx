import ThemeSwitch from '@antv/gi-theme-antd';
import { Button } from 'antd';
import React from 'react';
import ThemeVars from '../ThemeVars';
import './index.less';
interface ThemeProps {}
const options = [
  {
    value: 'light',
    icon: (
      <div
        className="theme-color-dot"
        style={{
          backgroundColor: 'rgba(48, 86, 227, 0.5)',
        }}
      />
    ),
    name: '清新蓝',
  },
  {
    value: 'ali',
    icon: (
      <div
        className="theme-color-dot"
        style={{
          backgroundColor: 'rgba(255, 106, 0, 0.5)',
        }}
      />
    ),
    name: '暖阳橙',
  },
  {
    value: 'dark',
    icon: (
      <div
        className="theme-color-dot"
        style={{
          backgroundColor: 'rgba(31, 31, 31, 0.5)',
        }}
      />
    ),
    name: '暗夜黑',
  },
];
const Theme: React.FunctionComponent<ThemeProps> = props => {
  return (
    <Button type="text" style={{ padding: '0px' }}>
      <ThemeSwitch
        //@ts-ignore
        themeVars={ThemeVars}
        antdCssLinks={{
          dark: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.dark.css`,
          light: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.light.css`,
          ali: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.ali.css`,
        }}
        // onChange={val => changeTheme(val)}
        // options={[
        //   {
        //     value: 'light',
        //     icon: (
        //       <div
        //         className="theme-color-dot"
        //         style={{
        //           backgroundColor: 'rgba(48, 86, 227, 0.5)',
        //         }}
        //       />
        //     ),
        //     name: '科技蓝',
        //   },
        //   {
        //     value: 'ali',
        //     icon: (
        //       <div
        //         className="theme-color-dot"
        //         style={{
        //           backgroundColor: 'rgba(255, 106, 0, 0.5)',
        //         }}
        //       />
        //     ),
        //     name: '阿里橙',
        //   },
        //   {
        //     value: 'dark',
        //     icon: (
        //       <div
        //         className="theme-color-dot"
        //         style={{
        //           backgroundColor: 'rgba(31, 31, 31, 0.5)',
        //         }}
        //       />
        //     ),
        //     name: '暗夜黑',
        //   },
        // ]}
        options={options}
      />
    </Button>
  );
};

export default Theme;

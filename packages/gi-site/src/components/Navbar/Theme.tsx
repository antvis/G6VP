import ThemeSwitch from '@antv/gi-theme-antd';
import { Button } from 'antd';
import React from 'react';
import ThemeVars from '../ThemeVars';
import $i18n from '../../i18n';
import './index.less';

interface ThemeProps {
  changeTheme: (val: string) => void;
}
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

    name: $i18n.get({ id: 'gi-site.components.Navbar.Theme.FreshBlue', dm: '清新蓝' }),
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

    name: $i18n.get({ id: 'gi-site.components.Navbar.Theme.WarmSunOrange', dm: '暖阳橙' }),
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

    name: $i18n.get({ id: 'gi-site.components.Navbar.Theme.DarkNightBlack', dm: '暗夜黑' }),
  },
  {
    value: 'green',
    icon: (
      <div
        className="theme-color-dot"
        style={{
          backgroundColor: 'rgb(39,118,88)',
        }}
      />
    ),

    name: $i18n.get({ id: 'gi-site.components.Navbar.Theme.MangoGreen', dm: '芒种绿' }),
  },
];
const Theme: React.FunctionComponent<ThemeProps> = props => {
  const { changeTheme } = props;
  return (
    <Button type="text" style={{ padding: '0px' }}>
      <ThemeSwitch
        //@ts-ignore
        themeVars={ThemeVars}
        antdCssLinks={{
          dark: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.dark.css`,
          light: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.light.css`,
          ali: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.ali.css`,
          green: `${window['GI_PUBLIC_PATH']}css/gi-theme-antd.green.css`,
        }}
        onChange={val => changeTheme && changeTheme(val)}
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

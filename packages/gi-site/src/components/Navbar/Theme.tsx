import ThemeSwitch from '@antv/gi-theme-antd';
import { Tooltip } from 'antd';
import React from 'react';
import ThemeVars from '../ThemeVars';
import './index.less';
interface ThemeProps {}

const Theme: React.FunctionComponent<ThemeProps> = props => {
  return (
    <Tooltip title="切换主题">
      <ThemeSwitch
        //@ts-ignore
        themeVars={ThemeVars}
        antdCssLinks={{
          dark: 'public/css/gi-theme-antd.dark.css',
          light: 'public/css/gi-theme-antd.light.css',
          ali: 'public/css/gi-theme-antd.ali.css',
        }}
        // onChange={val => changeTheme(val)}
        options={[
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
            name: '科技蓝',
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
            name: '阿里橙',
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
        ]}
      />
    </Tooltip>
  );
};

export default Theme;

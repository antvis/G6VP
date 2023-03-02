import ThemeSwitch from '@antv/gi-theme-antd';
import { Tooltip } from 'antd';
import React from 'react';
import ThemeVars from '../ThemeVars';
import './index.less';
interface ThemeProps {}

const Theme: React.FunctionComponent<ThemeProps> = props => {
  // const { context, updateContext } = useContext();
  // const { changeTheme } = useTheme(context, updateContext);

  return (
    <Tooltip title="切换主题">
      <ThemeSwitch
        //@ts-ignore
        themeVars={ThemeVars}
        antdCssLinks={{
          // dark: 'https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/dark.css', //本地调试的时候：'http://127.0.0.1:5500/dark.css',
          // light: 'https://gw.alipayobjects.com/os/lib/antv/gi-theme-antd/0.1.0/dist/light.css', //</Tooltip> 'http://127.0.0.1:5500/light.css',
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

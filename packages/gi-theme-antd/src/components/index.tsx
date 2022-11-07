import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented } from 'antd';
import React from 'react';
import pkg from '../../package.json';
const { version, name } = pkg;

export interface ThemeSwitchProps {
  themeVars: {
    dark: any;
    light: any;
  };
  antdCssLinks?: {
    dark: string;
    light: string;
  };
  localStorageKey?: string;
  onChange?: (value: 'dark' | 'light') => void;
}

const DEFAULT_ANTD_CSS_LINKS = {
  dark: `https://cdn.jsdelivr.net/npm/${name}@${version}/dist/dark.css`,
  light: `https://cdn.jsdelivr.net/npm/${name}@${version}/dist/light.css`,
};
const ThemeSwitch: React.FunctionComponent<ThemeSwitchProps> = props => {
  const { themeVars, antdCssLinks, localStorageKey = '@theme' } = props;
  const { dark: darkVars, light: lightVars } = themeVars;
  const { dark: darkLink, light: lightLink } = antdCssLinks || DEFAULT_ANTD_CSS_LINKS;
  if (localStorage.getItem(localStorageKey)) {
  }
  const [state, updateState] = React.useState({
    theme: localStorage.getItem(localStorageKey) || 'light',
  });
  const { theme } = state;
  React.useEffect(() => {
    console.log('effect...', theme);
    /** var css */
    let themeObj: any = {};
    if (theme === 'light') {
      themeObj = lightVars;
    } else {
      themeObj = darkVars;
    }
    /** antd theme */

    const dom = window.document.getElementById('theme-style') as HTMLLinkElement;

    const isLightTheme = theme === 'light';
    const cssUrl = isLightTheme
      ? lightLink // "https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.1.2/dist/light.css " // 'https://gw.alipayobjects.com/os/lib/antd/4.16.12/dist/antd.css'
      : darkLink; //  "https://gw.alipayobjects.com/os/lib/alipay/theme-tools/0.1.2/dist/dark.css"; // 'https://gw.alipayobjects.com/os/lib/antd/4.16.12/dist/antd.dark.css';

    if (dom) {
      dom.href = cssUrl;
    } else {
      // 创建一个 stylesheet 文件链接，动态 append 到 body 中
      // eslint-disable-next-line no-undef
      const style = document.createElement('link');
      style.type = 'text/css';
      style.rel = 'stylesheet';
      style.id = 'theme-style';
      style.href = cssUrl;
      if (document.body.append) {
        document.body.append(style);
      } else {
        document.body.appendChild(style);
      }
    }
    Object.keys(themeObj).forEach(key => {
      document.documentElement.style.setProperty(key, themeObj[key]);
    });
    localStorage.setItem(localStorageKey, theme);
  }, [theme]);

  const handleChange = value => {
    updateState(preState => {
      return {
        ...preState,
        theme: value,
      };
    });
  };
  return (
    <div className="theme-switch">
      <Segmented
        onChange={handleChange}
        value={theme}
        options={[
          {
            value: 'light',
            icon: <BarsOutlined />,
          },
          {
            value: 'dark',
            icon: <AppstoreOutlined />,
          },
        ]}
      />
    </div>
  );
};

export default ThemeSwitch;

import { BgColorsOutlined, DownOutlined } from '@ant-design/icons';
import { Segmented, Dropdown, Button, MenuProps } from 'antd';
import React from 'react';
import { DEFAULT_ANTD_CSS_LINKS, DEFAULT_THEME_VARS } from './const';

export interface ThemeSwitchProps {
  style?: React.CSSProperties;
  themeVars?: {
    dark: any;
    light: any;
    ali: any;
  };
  antdCssLinks?: {
    dark: string;
    light: string;
    ali: string;
  };
  localStorageKey?: string;
  onChange?: (value: 'dark' | 'light') => void;
  options?: {
    value: string;
    icon: React.ReactNode;
    name?: string;
  }[];
}

const ThemeSwitch: React.FunctionComponent<ThemeSwitchProps> = props => {
  const { themeVars, antdCssLinks, localStorageKey = '@theme', onChange, options, style } = props;
  const { dark: darkVars, light: lightVars, ali: aliVars } = themeVars || DEFAULT_THEME_VARS;
  const { dark: darkLink, light: lightLink, ali: aliLink } = antdCssLinks || DEFAULT_ANTD_CSS_LINKS;
  if (localStorage.getItem(localStorageKey)) {
  }
  const [state, updateState] = React.useState({
    theme: localStorage.getItem(localStorageKey) || 'light',
  });
  const { theme } = state;
  React.useEffect(() => {
    /** data-theme */
    document.documentElement.setAttribute('data-theme', theme);

    /** var css */
    let themeObj: any = lightVars;
    let cssUrl = lightLink;
    if (theme === 'dark') {
      themeObj = darkVars;
      cssUrl = darkLink;
    } else if (theme === 'ali') {
      themeObj = aliVars;
      cssUrl = aliLink;
    }
    /** antd theme */
    const dom = window.document.getElementById('theme-style') as HTMLLinkElement;

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
    onChange && onChange(value);
  };
  const handleDropDownChange = event => {
    const value = event.key;
    updateState(preState => {
      return {
        ...preState,
        theme: value,
      };
    });
    onChange && onChange(value);
  };
  const themeOptions = options || ['light', 'dark'];
  const useDropDown = themeOptions.length > 2;
  return (
    <div className="theme-switch" style={style}>
      {useDropDown ? (
        <Dropdown
          menu={{
            activeKey: theme,
            items: themeOptions.map((theme, i) => ({
              key: theme.value || theme,
              label: (
                <a>
                  {theme.icon}
                  &nbsp; &nbsp;
                  {theme.name || theme.value || theme}
                </a>
              ),
            })) as MenuProps['items'],
            onClick: handleDropDownChange,
          }}
          placement="bottomLeft"
        >
          <a style={{ margin: '0 8px 0 8px' }}>
            <BgColorsOutlined />
          </a>
        </Dropdown>
      ) : (
        /** @ts-ignore */
        <Segmented onChange={handleChange} value={theme} options={themeOptions} />
      )}
    </div>
  );
};

export default ThemeSwitch;

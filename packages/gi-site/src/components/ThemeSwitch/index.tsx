import { AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { Segmented, version } from 'antd';
import * as React from 'react';

interface ThemeSwitchProps {}
const DEFAULT_THEME_VARS = {
  light: {
    black: '#000',
    white: '#fff',
    'primary-color': '#3056E3', // 全局主色
    'link-color': '#3056E3', // 链接色
    'success-color': '#52c41a', // 成功色
    'warning-color': '#faad14', // 警告色
    'error-color': '#f5222d', // 错误色
    'font-size-base': ' 14px', // 主字号
    'heading-color': ' rgba(0, 0, 0, 0.85)', // 标题色
    'text-color': ' rgba(0, 0, 0, 0.65)', // 主文本色
    'text-color-secondary': ' rgba(0, 0, 0, 0.45)', // 次文本色
    'disabled-color': ' rgba(0, 0, 0, 0.25)', // 失效色
    'border-radius-base': ' 2px', // 组件/浮层圆角
    'border-color-base': '#d9d9d9', // 边框色
    'box-shadow-base':
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),0 9px 28px 8px rgba(0, 0, 0, 0.05)', // 浮层阴影
  },
  dark: {
    black: '#000',
    white: '#fff',
    'body-background': '@black',
    'component-background': '#141414',
    'primary-color': '#3056E3', // 全局主色
    'link-color': '#3056E3', // 链接色
    'success-color': '#52c41a', // 成功色
    'warning-color': '#faad14', // 警告色
    'error-color': '#f5222d', // 错误色
    'font-size-base': ' 14px', // 主字号
    'heading-color': ' rgba(0, 0, 0, 0.85)', // 标题色
    'text-color': '#fff', // 主文本色
  },
};

const getLocalTheme = () => {
  const vars = JSON.parse(localStorage.getItem('GI_THEME_VARS') || '{}');
  return vars;
};

const setLocalTheme = vars => {
  const preVars = JSON.parse(localStorage.getItem('GI_THEME_VARS') || '{}');
  localStorage.setItem('GI_THEME_VARS', {
    ...preVars,
    ...vars,
  });
};

const ThemeSwitch: React.FunctionComponent<ThemeSwitchProps> = props => {
  const [state, setState] = React.useState({
    theme: 'light',
  });
  const { theme } = state;
  const handleChange = value => {
    console.log('value', value);

    const html = document.querySelector('html');
    if (!html) {
      return;
    }
    if (html.hasAttribute('data-theme')) {
      html.removeAttribute('data-theme');
    }
    if (value === 'light') {
      html.removeAttribute('data-theme');
    } else {
      html.setAttribute('data-theme', 'dark');
    }

    setState(preState => {
      return {
        ...preState,
        theme: value,
      };
    });
  };
  React.useEffect(() => {
    const dom = window.document.getElementById('theme-style') as HTMLLinkElement;
    const cssUrl =
      theme === 'light'
        ? `https://gw.alipayobjects.com/os/lib/antd/${version}/dist/antd.css`
        : `https://gw.alipayobjects.com/os/lib/antd/${version}/dist/antd.dark.css`;
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
  }, [theme]);
  return (
    <div>
      <Segmented
        onChange={handleChange}
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

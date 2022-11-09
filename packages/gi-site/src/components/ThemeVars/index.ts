export default {
  light: {
    // 主题色
    '--primary-color': '#3056e3', //'rgba(48,86,227,1)',
    '--primary-color-opacity-1': 'rgba(48,86,227,0.1)',

    // 背景色
    '--background-color': 'rgba(255,255,255,1)',
    '--background-color-2': 'rgba(245,245,245,1)',
    '--background-color-3': 'rgba(235,235,235,1)',

    // 主文本色
    '--text-color': 'rgba(0, 0, 0, 0.85)',
    // 阴影

    '--box-shadow-base':
      '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08),0 9px 28px 8px rgba(0, 0, 0, 0.05)',
    '--box-shadow-light': '0 0 4px #ddd',

    // 边框颜色
    '--border-color': '#ddd',
    '--primary-border': '1px solid #ddd',

    //主要文本颜色
    '--hr-color': '#ddd',
    '--primary-text-color': 'rgba(0, 0, 0, 0.85)',

    '--header-bg-color': 'rgb(255,255,255)',

    '--background-color-card': '#fff',
    '--text-color-2': 'rgba(0, 0, 0, 0.65)', // 主文本色

    // "--box-shadow-pannel":"-1px -1px 4px 0 rgb(223 223 223 / 50%), -2px 2px 4px 0 rgb(244 244 244 / 50%),
    //   2px 3px 8px 2px rgb(151 151 151 / 5%)",

    '--box-shadow-pannel':
      '-1px -1px 4px 0 hsla(0, 0%, 87.5%, 0.5), -2px 2px 4px 0 hsla(0, 0%, 95.7%, 0.5), 2px 3px 8px 2px hsla(0, 0%, 59.2%, 0.05)',

    '--box-shadow-right': '1px 0px 8px 0px #ddd',
    '--box-shadow-left': '-1px 0px 8px 0px #ddd',
    '--box-shadow-top': '-1px 0px 8px 0px #ddd',
    '--box-shadow-bottom': '1px 0px 8px 0px #ddd',
  },
  dark: {
    // 主题色
    '--primary-color': '#3056e3',
    '--primary-color-opacity-1': 'rgba(48,86,227,0.1)',
    // 背景色
    '--background-color': 'rgba(31, 31, 31, 1)',
    '--background-color-2': 'rgba(41, 41, 41, 1)',
    '--background-color-3': 'rgba(51, 51, 51, 1)',
    // 主文本色
    '--text-color': '#e2e2e2', // 主文本色
    // 阴影
    '--box-shadow-base':
      '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32),0 9px 28px 8px rgba(0, 0, 0, 0.2)',

    '--box-shadow-pannel':
      '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32),0 9px 28px 8px rgba(0, 0, 0, 0.2)',

    '--box-shadow-light': '0 0 6px rgba(0, 0, 0, 1)',
    // 边框颜色
    '--border-color': '#434343',
    '--border-color-base': '#434343', // 边框色
    '--primary-border': '1px solid #434343',

    '--hr-color': '#303030',
    // 主要文本颜色
    '--primary-text-color': 'rgba(255, 255, 255, 0.85)',
    '--header-bg-color': 'rgba(255, 255, 255 0.65)',

    '--background-color-card': 'rgb(45, 45, 45)',

    '--link-color': '#3056e3', // 链接色
    '--success-color': '#52c41a', // 成功色
    '--warning-color': '#faad14', // 警告色
    '--error-color': '#f5222d', // 错误色
    '--font-size-base': '14px', // 主字号
    '--heading-color': '#fff', // 标题色
    '--text-color-secondary': 'rgba(0, 0, 0, 0.45)', // 次文本色
    '--disabled-color': 'rgba(0, 0, 0, 0.25)', // 失效色
    '--border-radius-base': '2px', // 组件/浮层圆角

    '--box-shadow-1': '1px 0px 8px 1px rgba(30, 30, 30, 1)',
    // '--box-shadow-pannel':
    //   '-1px -1px 4px 0 rgba(10, 10, 10, 1), -2px 2px 4px 0 rgba(10, 10, 10, 1),2px 3px 8px 2px rgba(10, 10, 10, 1)',
    // // '--box-shadow-pannel':
    //   '0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32),0 9px 28px 8px rgba(0, 0, 0, 0.2);',

    '--box-shadow-right': '1px 0px 8px 0px rgba(0, 0, 0, 1)',
    '--box-shadow-left': '-1px 0px 8px 0px rgba(0, 0, 0, 1)',
    '--box-shadow-top': '-1px 0px 8px 0px rgba(0, 0, 0, 1)',
    '--box-shadow-bottom': '1px 0px 8px 0px rgba(0, 0, 0, 1)',
  },
};

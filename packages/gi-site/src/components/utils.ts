/**
 * 复制功能
 * @param {String} value
 */

export function copyText(value: string) {
  const input = document.createElement('input');
  document.body.appendChild(input);
  // “啦啦啦”是要copy的内容，自己可以去设置
  input.setAttribute('value', value);
  input.select();
  let flag = false;
  if (document.execCommand('copy')) {
    document.execCommand('copy');
    flag = true;
  }
  document.body.removeChild(input);
  return flag;
}

/** 格式化代码   配置项：https://beautifier.io/
 * @param {String} code
 */

/**
 * 获取 search 参数对象
 * @param location
 * @returns
 */
export const getSearchParams = () => {
  return new URLSearchParams(window.location.search);
};

/**
 * 判断浏览器系统语言是否为中文
 * @returns
 */
export const isNavigatorLanguageZh = () => {
  const type = navigator.appName;
  let lang = navigator.language;
  if (type !== 'Netscape') {
    // @ts-ignore
    lang = navigator.userLanguage;
  }
  lang = lang.substr(0, 2);
  return lang === 'zh';
};

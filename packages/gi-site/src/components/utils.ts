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

/**
 * 下载功能
 * @param {String} content
 * @param {String} filename
 */
export function saveAs(content: string, filename: string) {
  // 创建隐藏的可下载链接
  const eleLink = document.createElement('a');
  eleLink.download = filename;
  eleLink.style.display = 'none';
  // 字符内容转变成blob地址
  const blob = new Blob([content]);
  eleLink.href = URL.createObjectURL(blob);
  // 触发点击
  document.body.appendChild(eleLink);
  eleLink.click();
  // 然后移除
  document.body.removeChild(eleLink);
}

/** 格式化代码   配置项：https://beautifier.io/
 * @param {String} code
 */

/**
 * 获取hash上的search对象
 * @param location
 * @returns
 */
export const getSearchParams = (location: Location) => {
  const { hash } = location;
  const [path, search] = hash.split('?');
  const searchParams = new URLSearchParams(search);
  return {
    path,
    searchParams,
  };
};

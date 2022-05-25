/**
 * 计算字符串的长度
 * @param {string} str 指定的字符串
 * 判断是否为汉字，汉字长度为2
 */
/* eslint-disable no-plusplus */
function calcStrLen(str: string) {
  let len = 0;
  const lenList = [];
  for (let i = 0; i < str?.length; i++) {
    if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
      len++;
    } else {
      len += 2;
    }
    //@ts-ignore
    lenList.push(len);
  }

  return { len, lenList };
}
export const fittingString = (str: string, maxWidth: number, fontSize: number) => {
  // 英文宽度平均为 .5 fontsize + 0.5的边距
  // extraWidth 保证箭头出现。同时为字体宽度增加容错
  const fontWidth = fontSize / 2 + 0.5; // 字号+边距
  const extraWidth = 75;
  const contentWidth = maxWidth - extraWidth;
  const { len, lenList } = calcStrLen(str);
  const width = len * fontWidth;
  const ellipsis = '…';
  // ellipsis 字体宽度
  const ellipsisWidth = 10;
  if (width > contentWidth) {
    const actualLen = Math.floor((contentWidth - ellipsisWidth) / fontWidth);
    const index = lenList.findIndex(strLen => strLen > actualLen) - 1;
    const result = str.substring(0, index) + ellipsis;
    // 有时候会计算错误，所以当返回的字符串已经所有原始字符串，则直接返回原始字符串
    if (result === `${str}${ellipsis}`) {
      return str;
    }
    return result;
  }
  return str;
};

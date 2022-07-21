export const getFuncArgs = func => {
  // 首先匹配函数括弧里的参数
  const args = func.toString().match(/function\s.*?\(([^)]*)\)/)[1];

  // 分解参数成数组
  return args
    .split(',')
    .map(arg => {
      // 去空格和内联注释
      return arg.replace(/\/\*.*\*\//, '').trim();
    })
    .filter(arg => {
      // 确保没有undefineds
      return arg;
    });
};

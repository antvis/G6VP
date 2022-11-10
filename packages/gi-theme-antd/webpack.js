const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const path = require('path');
const themeConfig = require('./src/theme/config');
//@TODO:如果用 css variable 替代，需要编写解析器
// class FunctionOverridePlugin {
//   install(less) {
//     const functions = {
//       fade: color => color,
//       darken: color => color,
//       lighten: color => color,
//       tint: color => color,
//       shade: color => color,
//       color: color => color,
//       fadein: color => color,
//       // mix: color => color,
//     };
//     less.functions.functionRegistry.addMultiple(functions);
//   }
// }

module.exports = env => {
  console.log('env', env);
  const { theme } = env;
  return {
    mode: 'development',
    entry: `/src/theme/${theme}.js`,
    module: {
      rules: [
        {
          test: /\.less$/,
          use: [
            {
              loader: MiniCssExtractPlugin.loader,
            },
            {
              loader: 'css-loader', // translates CSS into CommonJS
            },
            {
              loader: 'less-loader', // compiles Less to CSS
              options: {
                lessOptions: {
                  // 如果使用less-loader@5，请移除 lessOptions 这一级直接配置选项。
                  modifyVars: themeConfig[theme],
                  javascriptEnabled: true,
                  // plugins: [new FunctionOverridePlugin()],
                },
              },
            },
          ],
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: `${theme}.css`,
      }),
    ],
    output: {
      filename: `${theme}.js`,
      path: path.resolve(__dirname, 'dist'),
    },
  };
};

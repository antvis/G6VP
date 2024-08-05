/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { name } = require('./package.json');
module.exports = (env, argv) => {
  const ENTRY_PATH = path.join(__dirname, 'src/index.tsx');
  const DIST_PATH = path.join(__dirname, 'dist/');
  let ASSETS_UMD = name.split('-').join('_').toUpperCase();

  console.log(`UMD Package name: \x1b[32m${ASSETS_UMD}\x1b[0m`);

  const plugins = env.analysis
    ? [
        new MiniCssExtractPlugin(),
        new BundleAnalyzerPlugin({
          analyzerPort: Math.round(Math.random() * 100 + 8000),
        }),
      ]
    : [new MiniCssExtractPlugin()];
  return {
    entry: {
      index: ENTRY_PATH,
    },
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
          exclude: /node_modules/, //不包含 node_modules 中的JS文件
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-react'],
            plugins: [
              ['@babel/plugin-transform-class-properties', { loose: true }],
              ['@babel/plugin-transform-private-methods', { loose: true }],
              ['@babel/plugin-transform-private-property-in-object', { loose: true }],
              ['react-hot-loader/babel'],
            ],
          },
        },
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          exclude: /node_modules/,
          options: {
            compilerOptions: {
              declaration: false,
            },
          },
        },
        {
          test: /\.css$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|svg)$/i,
          use: [
            {
              loader: 'file-loader',
            },
          ],
        },
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
                  javascriptEnabled: true,
                },
              },
            },
          ],
          sideEffects: true,
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
      fallback: {
        fs: false, //https://webpack.js.org/migrate/5/#clean-up-configuration
      },
    },
    // devtool: 'cheap-module-source-map',
    output: {
      library: ASSETS_UMD,
      libraryTarget: 'umd',
      path: DIST_PATH,
      publicPath: './',
      filename: 'index.min.js',
    },
    plugins: plugins,
    externals: {
      lodash: '_',
      react: 'React',
      'react-dom': 'ReactDOM',
      '@antv/graphin': 'Graphin',
      '@antv/g6': 'G6',
      '@antv/gi-sdk': 'GISDK',
      antd: 'antd',
      '@antv/g2plot': 'G2Plot',
    },
    watch: Boolean(env.watch),
  };
};

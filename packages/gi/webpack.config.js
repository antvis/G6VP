/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

module.exports = (env, argv) => {
  return {
    entry: {
      index: './src/index.tsx',
    },
    mode: argv.mode,
    module: {
      rules: [
        {
          test: /\.js$/,
          use: ['source-map-loader'],
          enforce: 'pre',
        },
        {
          test: /\.(js|jsx)$/,
          exclude: /(node_modules|bower_components)/,
          loader: 'babel-loader',
          options: {
            presets: ['@babel/env', '@babel/preset-react'],

            plugins: [
              ['@babel/plugin-proposal-class-properties', { loose: true }],
              ['@babel/plugin-proposal-private-methods', { loose: true }],
              ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
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
          test: /\.less$/i,
          use: [
            // compiles Less to CSS
            // 'style-loader',
            {
              loader: MiniCssExtractPlugin.loader,
            },
            'css-loader',
            'less-loader',
          ],
        },
        {
          test: /\.(woff|woff2|eot|ttf|otf)$/,
          use: ['file-loader'],
        },
      ],
    },

    resolve: {
      extensions: ['*', '.ts', '.tsx', '.js', '.jsx'],
    },
    // devtool: 'cheap-module-source-map',
    output: {
      library: 'GISDK',
      libraryTarget: 'umd',
      path: path.resolve(__dirname, 'dist/'),
      publicPath: './',
      filename: 'index.min.js',
    },
    plugins: [
      new MiniCssExtractPlugin(),
      // new BundleAnalyzerPlugin()
    ],
    externals: {
      react: 'React',
      'react-dom': 'ReactDOM',
      '@antv/graphin': 'Graphin',
      '@antv/g6': 'G6',
      antd: 'antd',
    },
  };
};

const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const FixStyleOnlyEntriesPlugin = require('webpack-fix-style-only-entries');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const nodeExternals = require('webpack-node-externals');
const WebPackShellPlugin = require('webpack-shell-plugin');

module.exports = [
  {
    name: 'default',
    mode: 'development',
    entry: {
      main: './src/index.js'
    },
    output: {
      filename: '[name].bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    module: {
      rules: [
        {
          test: /\.css$/i,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    plugins: [
      new HtmlWebpackPlugin({ template: './src/index.html' }),
      new MiniCssExtractPlugin({ filename: '[name].bundle.css' }),
      new FixStyleOnlyEntriesPlugin(),
      new OptimizeCSSAssetsPlugin({}),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true
      }),
      new CopyPlugin([{ from: './src/assets', to: '.' }, { from: './src/img', to: './img' }])
    ],
    target: 'node'
  },
  {
    name: 'production',
    entry: path.resolve(__dirname, './src/api.index.js'),
    target: 'node',
    mode: 'production',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'api.bundle.js'
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js']
    }
  },
  {
    name: 'development',
    entry: path.resolve(__dirname, './src/api.index.js'),
    target: 'node',
    mode: process.env.NODE_ENV,
    watch: process.env.NODE_ENV === 'development',
    output: {
      path: path.resolve(__dirname, 'build'),
      filename: 'api.bundle.js'
    },
    node: {
      __dirname: false
    },
    externals: [nodeExternals()],
    resolve: {
      extensions: ['.ts', '.js']
    },
    plugins: [
      new WebPackShellPlugin({
        onBuildEnd: ['npm run start:api']
      })
    ]
  }];

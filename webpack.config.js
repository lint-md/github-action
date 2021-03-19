/*
 * File: webpack.config.js
 * Description: webpack 配置
 * Created: 2021-3-15 21:47:18
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const TerserPlugin = require('terser-webpack-plugin')
const WebpackNodeDynamicPlugin = require('./src/utils/plugin')
const path = require('path')

module.exports = {
  entry: './src/index.js',
  output: {
    filename: './index.js'
  },
  target: [
    'node'
  ],
  mode: 'production',
  devtool: false,
  optimization: {
    minimize: false,
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          format: {
            comments: false
          }
        },
        extractComments: false
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: path.resolve(__dirname, 'src', 'utils', 'foo-loader.js')
      }
    ]
  },
  plugins: [
    new WebpackNodeDynamicPlugin()
  ]
}
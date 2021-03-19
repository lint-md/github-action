/*
 * File: webpack.config.js
 * Description: webpack 配置
 * Created: 2021-3-15 21:47:18
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const TerserPlugin = require('terser-webpack-plugin')
const NodeRequireWebpackPlugin = require('node-require-webpack-plugin')

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
  plugins: [
    new NodeRequireWebpackPlugin()
  ]
}
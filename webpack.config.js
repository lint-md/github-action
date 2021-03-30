/*
 * File: webpack.config.js
 * Description: webpack 配置
 * Created: 2021-3-15 21:47:18
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

const TerserPlugin = require('terser-webpack-plugin')
const NodeRequireWebpackPlugin = require('node-require-webpack-plugin')

module.exports = (env, argv) => {
  const isDev = (argv.mode === 'development')

  return {
    entry: './src/index.ts',
    output: {
      filename: './index.js'
    },
    target: [
      'node'
    ],
    mode: isDev ? 'development' : 'production',
    devtool: false,
    optimization: {
      minimize: !isDev,
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
          test: /\.tsx?$/,
          loader: 'ts-loader'
        }
      ]
    },
    plugins: [
      new NodeRequireWebpackPlugin()
    ],
    resolve: {
      extensions: ['.ts', '.js']
    }
  }
}

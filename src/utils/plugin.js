 /*
  * File: plugin.js
  * Description: 处理动态 require 的插件
  * Created: 2021-3-19 09:46:42
  * Author: yuzhanglong
  * Email: yuzl1123@163.com
  */

const { RawSource } = require('webpack-sources')

class Plugin {
  apply(compiler) {
    compiler.hooks.emit.tap('emit', (compilation) => {
      let outputFile = compilation.options.output.filename
      let assets = compilation.assets
      let keys = Object.keys(assets)
      keys.forEach(key => {
        if (outputFile !== key || outputFile.substr(outputFile.lastIndexOf('.')) !== '.js') {
          return
        }

        let asset = assets[key]
        let content = `function __WEBPACK_PURE_REQUIRE__(content) {
  /******/ return require(content)
} \n\n\n${asset.source()}`
        assets[key] = new RawSource(content)
      })
    })
  }
}

module.exports = Plugin
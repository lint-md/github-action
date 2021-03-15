/*
 * File: extend-linter.js
 * Description: lint-md cli 的 lint.js 没有暴露出获取 warning 和 error 的方法
 * 我们需要继承之
 *
 * 由于 cli 被打包成了 es5 这里不能使用 class extend 
 * Created: 2021-3-15 19:38:03
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

require('babel-polyfill')
const Lint = require('@lint-md/cli/bin/Lint')
const loadMdFiles = require('@lint-md/cli/bin/helper/file')
const lint = require('@lint-md/cli/bin/Lint/lint')

const inherit = (subType, superType) => {
  let prototype = Object.create(superType.prototype)
  prototype.constructor = subType
  subType.prototype = prototype
}

function ExtendLinter(files, config) {
  // 调用父类构造函数
  this.files = files
  this.config = config
}

inherit(ExtendLinter, Lint)

ExtendLinter.prototype.start = async function() {
  const mdFiles = await loadMdFiles(this.files, this.config)

  // 参考 https://github.com/lint-md/cli/blob/master/src/Lint/index.js
  const errorFiles = []
  for (const file of mdFiles) {
    const errorFile = await lint(file, this.config)
    errorFiles.push(errorFile)
    this.printErrorFile(errorFile)
  }
  // 绑定到 this 上方便调用
  this.errorFiles = errorFiles
}

ExtendLinter.prototype.errorCount = function() {
  return Lint.prototype.errorCount.call(this, this.errorFiles)
}

ExtendLinter.prototype.printOverview = function() {
  Lint.prototype.printOverview.call(this, this.errorFiles)
}

ExtendLinter.prototype.getErrorFiles = function() {
  return this.errorFiles
}


module.exports = ExtendLinter
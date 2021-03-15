/*
 * File: lint-md-action.js
 * Description: lint-md github action 核心逻辑
 * Created: 2021-3-15 22:23:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

require('babel-polyfill')
const core = require('@actions/core')
const path = require('path')
const fs = require('fs')
const ExtendLinter = require('./extend-linter')

class LintMdAction {
  constructor(basePath) {
    if (!basePath) {
      this.basePath = process.env.GITHUB_WORKSPACE
    }
    this.config = this.getConfig()
    // 获取所有需要 lint 的目录，如果有多个需要以 ' ' 分割
    this.lintFiles = core
      .getInput('files')
      .split(' ')
      .map(res => path.resolve(this.basePath, res))
  }

  getConfig() {
    // 获取用户传入的配置文件目录
    const configPath = path.resolve(process.env.GITHUB_WORKSPACE, core.getInput('configFile'))
    if (!fs.existsSync(configPath)) {
      core.warning('The user does not have a configuration file to pass in, we will use the default configuration instead...')
      return {}
    }

    // JavaScript 模块，直接 require
    if (configPath.endsWith('.js')) {
      return require(configPath)
    }
    const content = fs.readFileSync(configPath).toString()
    return JSON.parse(content)
  }

  isPass() {
    const result = this.linter ? this.linter.errorCount() : {}
    const noErrorAndWarn = result.error === 0 && result.warning === 0
    return core.getInput('failOnWarnings') ? noErrorAndWarn : result.error === 0
  }

  async lint() {
    // 开始 lint
    this.linter = new ExtendLinter(this.lintFiles, this.config)
    await this.linter.start()
    return this
  }

  showResult() {
    if (this.linter) {
      this.linter.printOverview()
    }
    return this
  }

  showErrorOrPassInfo() {
    if (this.isPass()) {
      core.info('\nMarkdown Lint free! 🎉')
    } else {
      core.setFailed('\nThere are some lint errors in your files 😭...')
    }
  }

  getErrors() {
    return this.linter.getErrorFiles()
  }
}

module.exports = LintMdAction
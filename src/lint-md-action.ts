/*
 * File: lint-md-action.ts
 * Description: lint-md github action 核心逻辑
 * Created: 2021-3-15 22:23:51
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as fs from 'fs'
import * as path from 'path'
import * as core from '@actions/core'
import { Lint, CliConfig, CliLintResult } from '@lint-md/cli/lib/index'

export class LintMdAction {
  private readonly basePath!: string
  private readonly config: CliConfig
  private readonly lintFiles: string[]
  private linter!: Lint

  constructor(basePath?: string) {
    if (!basePath) {
      this.basePath = process.env.GITHUB_WORKSPACE || process.cwd()
    } else {
      this.basePath = basePath
    }
    this.config = this.getConfig()
    // 获取所有需要 lint 的目录，如果有多个需要以 ' ' 分割
    this.lintFiles = core
      .getInput('files')
      .split(' ')
      .map(res => path.resolve(this.basePath, res))
  }

  getConfig(): CliConfig {
    const configPath = path.resolve(this.basePath, core.getInput('configFile'))
    if (!fs.existsSync(configPath)) {
      core.warning('The user does not have a configuration file to pass in, we will use the default configuration instead...')
      return {}
    }

    if (configPath.endsWith('.js')) {
      return require(`${configPath}`)
    }
    const content = fs.readFileSync(configPath).toString()
    try {
      return JSON.parse(content)
    } catch (e) {
      core.warning(`Failed to parse config file: ${(e as Error).message}`)
      return {}
    }
  }

  isPass() {
    // 没有初始化直接调用 isPass, 返回 true
    if (!this.linter) {
      return true
    }
    const result = this.linter.countError()
    const noErrorAndWarn = result.error === 0 && result.warning === 0
    // 注意这里的 getInput 返回值为 string
    return core.getInput('failOnWarnings') === 'true' ? noErrorAndWarn : result.error === 0
  }

  async lint() {
    // 开始 lint
    this.linter = new Lint(this.lintFiles, this.config)
    await this.linter.start()
    return this
  }

  showResult() {
    if (this.linter) {
      this.linter.showResult()
    }
    return this
  }

  showErrorOrPassInfo() {
    if (this.isPass()) {
      core.info('\nMarkdown Lint free! 🎉')
    } else {
      for (const errorFile of this.getErrors()) {
        const filePath = path.join(errorFile.path, errorFile.file)
        for (const error of errorFile.errors) {
          const message = `[${error.type}] ${error.text} (${filePath}:${error.start.line}:${error.start.column})`
          if (error.level === 'error') {
            core.error(message)
          } else {
            core.warning(message)
          }
        }
      }
      core.setFailed('\nThere are some lint errors in your files 😭...')
    }
  }

  getErrors(): CliLintResult[] {
    return this.linter.errorFiles
  }
}

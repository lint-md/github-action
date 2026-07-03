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
import { lintMarkdown, LintMdRulesConfig, ReportOption } from '@lint-md/core'
import { glob } from 'glob'

interface LintConfig {
  excludeFiles?: string[]
  rules?: LintMdRulesConfig
  extensions?: string[]
}

interface LintResultWithPath extends ReportOption {
  path: string
}

async function loadMdFiles(
  patterns: string[],
  excludeFiles: string[],
  extensions = ['.md', '.markdown', '.mdx']
): Promise<string[]> {
  const filePaths = await Promise.all(
    [...new Set(patterns)].map(p => glob(p, { ignore: excludeFiles, absolute: true }))
  )
  return [...new Set(filePaths.flat())].filter(f => extensions.some(ext => f.endsWith(ext)))
}

export class LintMdAction {
  private readonly basePath!: string
  private readonly config: LintConfig
  private readonly lintFiles: string[]
  private lintResults: LintResultWithPath[] = []

  constructor(basePath?: string) {
    if (!basePath) {
      this.basePath = process.env.GITHUB_WORKSPACE || process.cwd()
    } else {
      this.basePath = basePath
    }
    this.config = this.getConfig()
    this.lintFiles = core
      .getInput('files')
      .split(' ')
      .map(res => path.resolve(this.basePath, res))
  }

  getConfig(): LintConfig {
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
    if (!this.lintResults.length) {
      return true
    }
    const errorCount = this.lintResults.filter(r => r.severity === 2).length
    const warningCount = this.lintResults.filter(r => r.severity === 1).length
    const noErrorAndWarn = errorCount === 0 && warningCount === 0
    return core.getInput('failOnWarnings') === 'true' ? noErrorAndWarn : errorCount === 0
  }

  async lint() {
    const mdFiles = await loadMdFiles(
      this.lintFiles,
      this.config.excludeFiles || [],
      this.config.extensions
    )

    if (!mdFiles.length) {
      core.info('No markdown files to lint.')
      return this
    }

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const result = lintMarkdown(content, this.config.rules, false)
      for (const item of result.lintResult) {
        this.lintResults.push({ ...item, path: file })
      }
    }

    return this
  }

  showResult() {
    if (this.lintResults.length) {
      core.info(`\nFound ${this.lintResults.length} issue(s) in markdown files.`)
    }
    return this
  }

  showErrorOrPassInfo() {
    if (this.isPass()) {
      core.info('\nMarkdown Lint free! 🎉')
    } else {
      for (const result of this.lintResults) {
        const filePath = result.path
        const message = `[${result.name}] ${result.message} (${filePath}:${result.loc.start.line}:${result.loc.start.column})`
        if (result.severity === 2) {
          core.error(message)
        } else {
          core.warning(message)
        }
      }
      core.setFailed('\nThere are some lint errors in your files 😭...')
    }
  }

  getErrors(): LintResultWithPath[] {
    return this.lintResults
  }
}

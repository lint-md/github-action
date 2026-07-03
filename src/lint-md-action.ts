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
import { lintMarkdown, LintMdRulesConfig } from '@lint-md/core'
import { glob } from 'glob'

interface LintConfig {
  excludeFiles?: string[]
  rules?: LintMdRulesConfig
  extensions?: string[]
}

interface LintResultItem {
  loc: { start: { line: number; column: number }; end: { line: number; column: number } }
  message: string
  name: string
  content: string
  severity: number
}

interface FileLintResult {
  path: string
  errors: LintResultItem[]
}

async function loadMdFiles(
  patterns: string[],
  excludeFiles: string[],
  extensions = ['.md', '.markdown', '.mdx']
): Promise<string[]> {
  const expandedPatterns = await Promise.all(
    [...new Set(patterns)].map(async (p) => {
      try {
        const stat = fs.statSync(p)
        return stat.isDirectory() ? `${p}/**/*` : p
      } catch {
        return p
      }
    })
  )
  const filePaths = await Promise.all(
    expandedPatterns.map(p => glob(p, { ignore: excludeFiles, absolute: true }))
  )
  return [...new Set(filePaths.flat())].filter(f => extensions.some(ext => f.endsWith(ext)))
}

export class LintMdAction {
  private readonly basePath!: string
  private readonly config: LintConfig
  private readonly lintFiles: string[]
  private fileResults: FileLintResult[] = []

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
      core.info('No configuration file provided, using default rules.')
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
    const allErrors = this.fileResults.flatMap(f => f.errors)
    if (!allErrors.length) {
      return true
    }
    const errorCount = allErrors.filter(r => r.severity === 2).length
    const warningCount = allErrors.filter(r => r.severity === 1).length
    const noErrorAndWarn = errorCount === 0 && warningCount === 0
    return core.getInput('failOnWarnings') === 'true' ? noErrorAndWarn : errorCount === 0
  }

  async lint() {
    this.fileResults = []
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
      if (result.lintResult.length > 0) {
        this.fileResults.push({
          path: file,
          errors: result.lintResult as LintResultItem[],
        })
      }
    }

    return this
  }

  showResult() {
    const totalIssues = this.fileResults.reduce((sum, f) => sum + f.errors.length, 0)
    if (totalIssues) {
      core.info(`\nFound ${totalIssues} issue(s) in markdown files.`)
    }
    return this
  }

  showErrorOrPassInfo() {
    if (this.isPass()) {
      core.info('\nMarkdown Lint free! 🎉')
    } else {
      for (const fileResult of this.fileResults) {
        for (const error of fileResult.errors) {
          const message = `[${error.name}] ${error.message} (${fileResult.path}:${error.loc.start.line}:${error.loc.start.column})`
          if (error.severity === 2) {
            core.error(message)
          } else {
            core.warning(message)
          }
        }
      }
      core.setFailed('\nThere are some lint errors in your files 😭...')
    }
  }

  getErrors(): FileLintResult[] {
    return this.fileResults
  }
}

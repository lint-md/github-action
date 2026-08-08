/*
 * File: github-action.spec.js
 * Description:  GitHub action tests
 * Created: 2021-3-15 20:32:25
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import * as core from '@actions/core'

import { LintMdAction } from '../src/lint-md-action'

import { mockAction } from '../src/test-utils'


describe('lint-md GitHub action 测试', () => {

  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('用户工作目录下没有任何配置文件', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'no-config-file')
    mockAction()
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showResult()
    lintMdAction.showErrorOrPassInfo()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(1)
    expect(totalErrors[0].path).toStrictEqual(path.resolve(process.env.GITHUB_WORKSPACE!, 'bad.md'))
    expect(totalErrors[0].errors.map((tmp: any) => tmp.name)).toStrictEqual([
      'space-around-alphabet',
      'no-empty-list'
    ])
  })

  test('用户工作目录下存在配置文件，优先使用用户的配置文件', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'use-config-file')
    mockAction()
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(1)
    expect(totalErrors[0].path).toStrictEqual(path.resolve(process.env.GITHUB_WORKSPACE!, 'bad.md'))
    expect(totalErrors[0].errors.map((tmp: any) => tmp.severity)).toStrictEqual([
      1,
      2
    ])
    expect(totalErrors[0].errors.map((tmp: any) => tmp.name)).toStrictEqual([
      'space-around-alphabet',
      'no-empty-list'
    ])
  })

  test('用户在 GitHub Action 配置中传入自定义的配置文件', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'use-custom-config')
    mockAction(null as any, 'hello')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(1)
    expect(totalErrors[0].path).toStrictEqual(path.resolve(process.env.GITHUB_WORKSPACE!, 'bad.md'))
    expect(totalErrors[0].errors.map((tmp: any) => tmp.severity)).toStrictEqual([
      1,
      2
    ])
  })

  test('没有任何 error 而只有 warning 我们默认通过此次 ci', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null as any, '.lintmdrc')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showResult()
    lintMdAction.showErrorOrPassInfo()
    expect(lintMdAction.isPass()).toStrictEqual(true)
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('[space-around-alphabet]'))
    expect(core.error).not.toHaveBeenCalled()
    expect(core.setFailed).not.toHaveBeenCalled()
    expect(core.info).toHaveBeenCalledWith('\nMarkdown lint passed! 🎉')
  })

  test('用户在 GitHub Action 将 failOnWarnings 值设为 true，即使只有 warning 本次 ci fail', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null as any, '.lintmdrc', 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showErrorOrPassInfo()
    expect(lintMdAction.isPass()).toStrictEqual(false)
    expect(core.warning).toHaveBeenCalledWith(expect.stringContaining('[space-around-alphabet]'))
    expect(core.error).not.toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith('\nThere are lint issues in your files 😭...')
  })

  test('用户自定义的配置文件为 JavaScript 模块', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'js-config')
    mockAction(null as any, '.lintmdrc.js', 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    expect(lintMdAction.isPass()).toStrictEqual(false)
  })

  test('用户传入了多个以空格分割的检测目录', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples')
    mockAction('./js-config ./no-config-file', null as any, 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showResult()
    lintMdAction.showErrorOrPassInfo()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(2)
  })

  test('目录递归展开：files 为目录时自动扫描子目录', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples')
    mockAction('./no-config-file ./use-config-file')
    const lintMdAction = new LintMdAction()
    await lintMdAction.lint()
    const errors = lintMdAction.getErrors()
    expect(errors.length).toStrictEqual(2)
    expect(errors.every(e => e.path.endsWith('bad.md'))).toBe(true)
  })

  test('glob pattern 匹配：files 为具体文件路径', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples')
    mockAction('./no-config-file/bad.md')
    const lintMdAction = new LintMdAction()
    await lintMdAction.lint()
    const errors = lintMdAction.getErrors()
    expect(errors.length).toStrictEqual(1)
    expect(errors[0].path).toStrictEqual(
      path.resolve(process.cwd(), 'examples', 'no-config-file', 'bad.md')
    )
  })

  test('excludeFiles 排除指定目录', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples')
    mockAction('./', '.lintmdrc')
    const lintMdAction = new LintMdAction()
    await lintMdAction.lint()
    const errors = lintMdAction.getErrors()
    const paths = errors.map(e => e.path)
    expect(paths.every(p => !p.includes('only-warning'))).toBe(true)
    expect(errors.length).toBeGreaterThan(0)
  })
})

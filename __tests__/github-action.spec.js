/*
 * File: github-action.spec.js
 * Description:  GitHub action tests
 * Created: 2021-3-15 20:32:25
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


const path = require('path')
const LintMdAction = require('../src/lint-md-action')
const { mockAction } = require('../src/test-utils')


describe('lint-md GitHub action 测试', () => {

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
    expect(totalErrors[0].path).toStrictEqual(process.env.GITHUB_WORKSPACE)
    expect(totalErrors[0].errors.map(tmp => tmp.type)).toStrictEqual([
      'space-round-alphabet',
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
    expect(totalErrors[0].path).toStrictEqual(process.env.GITHUB_WORKSPACE)
    expect(totalErrors[0].errors.map(tmp => tmp.level)).toStrictEqual([
      'warning',
      'error'
    ])
    expect(totalErrors[0].errors.map(tmp => tmp.type)).toStrictEqual([
      'space-round-alphabet',
      'no-empty-list'
    ])
  })

  test('用户在 GitHub Action 配置中传入自定义的配置文件', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'use-custom-config')
    mockAction(null, 'hello')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(1)
    expect(totalErrors[0].path).toStrictEqual(process.env.GITHUB_WORKSPACE)
    expect(totalErrors[0].errors.map(tmp => tmp.level)).toStrictEqual([
      'warning',
      'error'
    ])
  })

  test('没有任何 error 而只有 warning 我们默认通过此次 ci', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null, '.lintmdrc')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showResult()
    expect(lintMdAction.isPass()).toStrictEqual(true)
  })

  test('用户在 GitHub Action 将 failOnWarnings 值设为 true，即使只有 warning 本次 ci fail', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null, '.lintmdrc', 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    expect(lintMdAction.isPass()).toStrictEqual(false)
  })

  test('用户自定义的配置文件为 JavaScript 模块', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'js-config')
    mockAction(null, '.lintmdrc.js', 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    expect(lintMdAction.isPass()).toStrictEqual(false)
  })

  test('用户传入了多个以空格分割的检测目录', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples')
    mockAction('./js-config ./no-config-file', null, 'true')
    const lintMdAction = new LintMdAction()
    // lint
    await lintMdAction.lint()
    lintMdAction.showResult()
    lintMdAction.showErrorOrPassInfo()
    const totalErrors = lintMdAction.getErrors()
    expect(totalErrors.length).toStrictEqual(2)
  })
})
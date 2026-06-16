/*
 * File: index.spec.ts
 * Description: Test entry point index.ts
 * Created: 2026-06-16
 */

import * as path from 'path'
import * as core from '@actions/core'
import { runAction } from '../src/index'
import { mockAction } from '../src/test-utils'

describe('runAction function', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  test('succeeds when no errors exist', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null as any, '.lintmdrc')

    await runAction()

    expect(core.info).toHaveBeenCalledWith(expect.stringContaining('Markdown Lint free'))
    expect(core.setFailed).not.toHaveBeenCalled()
  })

  test('fails when lint errors are detected', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'use-config-file')
    mockAction(null as any, '.lintmdrc')

    await runAction()

    expect(core.error).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('lint errors'))
  })

  test('fails when failOnWarnings is true and warnings exist', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'only-warning')
    mockAction(null as any, '.lintmdrc', 'true')

    await runAction()

    expect(core.warning).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalledWith(expect.stringContaining('lint errors'))
  })

  test('shows lint results and exits gracefully on errors', async () => {
    process.env.GITHUB_WORKSPACE = path.resolve(process.cwd(), 'examples', 'no-config-file')
    mockAction()

    await runAction()

    expect(core.error).toHaveBeenCalled()
    expect(core.setFailed).toHaveBeenCalled()
  })
})

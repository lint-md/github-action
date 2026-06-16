/*
 * File: index.ts
 * Description: action 入口
 * Created: 2021-3-15 20:39:28
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as core from '@actions/core'
import { LintMdAction } from './lint-md-action'

export const runAction = async () => {
  const lintMdAction = new LintMdAction()
  await lintMdAction.lint()
  lintMdAction
    .showResult()
    .showErrorOrPassInfo()
}

if (require.main === module) {
  runAction().catch((err: Error) => {
    core.setFailed(err.message || 'unknown error!')
  })
}

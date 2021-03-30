/*
 * File: index.ts
 * Description: action 入口
 * Created: 2021-3-15 20:39:28
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import { LintMdAction } from './lint-md-action'

const runAction = async () => {
  // init LintMdAction
  const lintMdAction = new LintMdAction()

  // run lint
  await lintMdAction.lint()

  // log info
  lintMdAction
    .showResult()
    .showErrorOrPassInfo()
}

runAction().catch(res => {
  console.log(res)
  throw new Error('unknown error!')
})

/*
 * File: extend-linter.spec.js
 * Description: lint 继承对象测试
 * Created: 2021-3-15 19:48:45
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */


import * as path from 'path'
import { Lint } from '@lint-md/cli'

describe('lint 继承对象测试集合', () => {
  test('有 error 出现 (see examples/)', async () => {
    const newLinter = new Lint([path.resolve(process.cwd(), 'examples')], {
      rules: {}
    })

    await newLinter.start()
    newLinter.printOverview()
    expect(newLinter.countError()).toStrictEqual({
      'error': 8,
      'warning': 0
    })
  })
})

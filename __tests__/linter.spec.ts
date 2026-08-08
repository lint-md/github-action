/*
 * File: extend-linter.spec.js
 * Description: lint 继承对象测试
 * Created: 2021-3-15 19:48:45
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as path from 'path'
import * as fs from 'fs'
import { lintMarkdown } from '@lint-md/core'
import { glob } from 'glob'

describe('lint 继承对象测试集合', () => {
  test('有 error 出现 (see examples/)', async () => {
    const mdFiles = await glob(path.resolve(process.cwd(), 'examples') + '/**/*.md', {
      absolute: true
    })

    let errorCount = 0
    let warningCount = 0

    for (const file of mdFiles) {
      const content = fs.readFileSync(file, 'utf-8')
      const result = lintMarkdown(content, {}, false)
      for (const item of result.lintResult) {
        if (item.severity === 2) {
          errorCount++
        } else if (item.severity === 1) {
          warningCount++
        }
      }
    }

    expect({ error: errorCount, warning: warningCount }).toStrictEqual({
      'error': 8,
      'warning': 0
    })
  })

  test('支持 core 2.3.0 新增规则', () => {
    const result = lintMarkdown(
      '第一行\n第二行含有[链接](https://example.com)文字\n\n\n结尾',
      {
        'require-trailing-spaces': 2,
        'space-around-link': 2,
        'no-multiple-blank-lines': 2
      },
      false
    )

    expect(new Set(result.lintResult.map(item => item.name))).toStrictEqual(
      new Set(['require-trailing-spaces', 'space-around-link', 'no-multiple-blank-lines'])
    )
  })
})

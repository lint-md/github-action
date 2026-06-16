/*
 * File: test-utils.ts
 * Description: 测试工具函数集
 * Created: 2021-3-30 14:18:15
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

export const mockAction = (files?: string | null, configFile?: string | null, failOnWarnings?: string | null) => {
  const core = require('@actions/core')
  core.getInput = (arg: string) => {
    switch (arg) {
      case 'files':
        return files || './'
      case 'configFile':
        return configFile || '.lintmdrc'
      case 'failOnWarnings':
        return failOnWarnings || 'false'
      default:
        return ''
    }
  }
}

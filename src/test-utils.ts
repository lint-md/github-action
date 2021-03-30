/*
 * File: test-utils.ts
 * Description: 测试工具函数集
 * Created: 2021-3-30 14:18:15
 * Author: yuzhanglong
 * Email: yuzl1123@163.com
 */

import * as core from '@actions/core'

// mock GitHub action 的用户参数
export const mockAction = (files?: string, configFile?: string, failOnWarnings?: string) => {
  jest.mock('@actions/core')

  // mock getInput method
  // @ts-ignore
  // eslint-disable-next-line no-import-assign
  core.getInput = (arg) => {
    switch (arg) {
      case 'files':
        return files || './'
      case 'configFile':
        return configFile || '.lintmdrc'
      case 'failOnWarnings':
        return failOnWarnings || 'false'
    }
  }
}

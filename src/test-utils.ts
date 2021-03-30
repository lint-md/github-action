import * as core from '@actions/core'


// mock GitHub action 的用户参数
export const mockAction = (files?: string, configFile?: string, failOnWarnings?: string) => {
  jest.mock('@actions/core')

  // mock getInput method
  // @ts-ignore
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

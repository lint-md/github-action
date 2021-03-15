const core = require('@actions/core')

// mock GitHub action 的用户参数
const mockAction = (files, configFile, failOnWarnings) => {
  jest.mock('@actions/core')
  core.getInput = (arg) => {
    switch (arg) {
      case 'files':
        return files || './'
      case 'configFile':
        return configFile || '.lintmdrc'
      case 'failOnWarnings':
        return failOnWarnings || false
    }
  }
}

module.exports = {
  mockAction
}
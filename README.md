# @lint-md/github-action

[![CI](https://github.com/lint-md/github-action/actions/workflows/build.yml/badge.svg)](https://github.com/lint-md/github-action/actions/workflows/build.yml)
[![license](https://img.shields.io/github/license/lint-md/github-action)](./LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/lint-md/github-action)](https://github.com/lint-md/github-action/releases)

> 为 [lint-md](https://github.com/lint-md/lint-md) 提供的 GitHub Action 集成，无需在 CI 中额外执行 `npm install`，开箱即用，速度更快。

lint-md 是一款面向中文技术文档的 Markdown 格式检查工具，可检测空格、标点、排版等常见问题。本 Action 将其封装为可直接在 GitHub Actions 工作流中使用的步骤。

## 使用方式

在仓库中创建工作流文件，例如 `.github/workflows/lint-md.yml`：

```yaml
name: Lint Markdown

on:
  push:
    branches:
      - main
  pull_request:

jobs:
  lint-markdown:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Lint Markdown
        uses: lint-md/github-action@v0.1.1
        with:
          files: './docs ./'
          configFile: '.lintmdrc'
          failOnWarnings: 'false'
```

## 配置参数

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `files` | `string` | `./` | 否 | 要检查的目录或文件路径，多个路径之间用空格分隔，例如：`./docs ./README.md` |
| `configFile` | `string` | `.lintmdrc` | 否 | lint-md 配置文件路径，支持 JSON 文件或 JavaScript 模块（`.lintmdrc` / `.lintmdrc.js`） |
| `failOnWarnings` | `boolean` | `false` | 否 | 是否在出现警告（warning）时也使 Action 失败 |

## lint-md 配置文件

若工作目录下存在配置文件，Action 会自动读取并应用其中的规则；若不存在，则使用 [lint-md 默认规则](https://github.com/lint-md/lint-md#rules-%E9%85%8D%E7%BD%AE)。

### JSON 格式（`.lintmdrc`）

```json
{
  "excludeFiles": [],
  "rules": {
    "space-round-alphabet": 1,
    "space-round-number": 1,
    "no-empty-code-lang": 1,
    "no-trailing-punctuation": 1
  }
}
```

### JavaScript 模块格式（`.lintmdrc.js`）

```js
module.exports = {
  excludeFiles: [],
  rules: {
    "space-round-alphabet": 1,
    "space-round-number": 1,
    "no-empty-code-lang": 1,
    "no-trailing-punctuation": 1
  }
}
```

规则值含义：`0` — 关闭，`1` — 警告，`2` — 错误。完整规则列表请参考 [lint-md 文档](https://github.com/lint-md/lint-md#rules-%E9%85%8D%E7%BD%AE)。

### 指定自定义配置文件路径

如果配置文件不在工作目录根路径，可以通过 `configFile` 参数显式指定：

```yaml
- name: Lint Markdown
  uses: lint-md/github-action@v0.1.1
  with:
    configFile: './config/.lintmdrc'
```

## License

[MIT](./LICENSE) © Jim Yu

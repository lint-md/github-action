# @lint-md/github-action

[![CI](https://github.com/lint-md/github-action/actions/workflows/build.yml/badge.svg)](https://github.com/lint-md/github-action/actions/workflows/build.yml)
[![license](https://img.shields.io/github/license/lint-md/github-action)](./LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/lint-md/github-action)](https://github.com/lint-md/github-action/releases)

> 为 [lint-md](https://github.com/lint-md/lint-md) 提供的 GitHub Action 集成，无需在 CI 中额外执行 `npm install`，开箱即用，速度更快。

lint-md 是一款面向中文技术文档的 Markdown 格式检查工具，可检测空格、标点、排版等常见问题。本 Action 将其封装为可直接在 GitHub Actions 工作流中使用的步骤。

## 快速开始

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
        uses: actions/checkout@v6.0.2

      - name: Lint Markdown
        uses: lint-md/github-action@v0.3.0
```

这会使用默认规则检查当前目录下的所有 Markdown 文件。

## 配置参数

| 参数名 | 类型 | 默认值 | 必填 | 说明 |
| --- | --- | --- | --- | --- |
| `files` | `string` | `./` | 否 | 要检查的目录或文件路径，多个路径之间用空格分隔，例如：`./docs ./README.md` |
| `configFile` | `string` | `.lintmdrc` | 否 | lint-md 配置文件路径，支持 JSON 文件或 JavaScript 模块（`.lintmdrc` / `.lintmdrc.js`） |
| `failOnWarnings` | `boolean` | `false` | 否 | 是否在出现警告（warning）时也使 Action 失败 |

### 检查多个目录

```yaml
- name: Lint Markdown
  uses: lint-md/github-action@v0.3.0
  with:
    files: './docs ./src ./README.md'
```

### 指定自定义配置文件

```yaml
- name: Lint Markdown
  uses: lint-md/github-action@v0.3.0
  with:
    configFile: './config/.lintmdrc'
```

### 警告也视为失败

```yaml
- name: Lint Markdown
  uses: lint-md/github-action@v0.3.0
  with:
    failOnWarnings: 'true'
```

## 配置文件

若工作目录下存在配置文件，Action 会自动读取并应用其中的规则；若不存在，则使用默认规则。

### JSON 格式（`.lintmdrc`）

```json
{
  "excludeFiles": ["**/node_modules/**", "**/dist/**"],
  "rules": {
    "space-around-alphabet": 1,
    "space-around-number": 1,
    "no-empty-code-lang": 2,
    "correct-title-trailing-punctuation": 2
  }
}
```

### JavaScript 模块格式（`.lintmdrc.js`）

```js
module.exports = {
  excludeFiles: ['**/node_modules/**'],
  rules: {
    "space-around-alphabet": 1,
    "space-around-number": 1,
    "no-empty-code-lang": 2,
    "correct-title-trailing-punctuation": 2
  }
}
```

### 配置项说明

| 字段 | 类型 | 默认值 | 说明 |
| --- | --- | --- | --- |
| `excludeFiles` | `string[]` | `["**/node_modules/**", "**/.git/**"]` | 排除的文件 glob 模式 |
| `rules` | `object` | `{}` | 规则配置，见下方规则列表 |

### 规则值含义

`rules` 对象的键是规则名。值是该规则的检查级别。

| 值 | 级别 | Action 行为 |
| --- | --- | --- |
| `0` | 关闭 | 不执行该规则，也不产生检查结果 |
| `1` | 警告 | 将问题标记为警告。Action 默认成功 |
| `2` | 错误 | 将问题标记为错误。Action 失败 |

当 `failOnWarnings: 'true'` 时，级别 `1` 也会使 Action 失败。
此设置不会把警告转换为错误。

例如，以下配置将空列表项视为错误，将中英文间距问题视为警告：

```json
{
  "rules": {
    "space-around-alphabet": 1,
    "no-empty-list": 2
  }
}
```

## 可用规则

| 规则名 | 说明 |
| --- | --- |
| `space-around-alphabet` | 中英文之间需要添加空格 |
| `space-around-number` | 中文与数字之间需要添加空格 |
| `no-empty-list` | 禁止空列表项 |
| `no-empty-code` | 禁止空代码块 |
| `no-empty-code-lang` | 代码块必须指定语言 |
| `no-empty-inline-code` | 禁止空行内代码 |
| `no-empty-url` | 禁止空链接 |
| `no-empty-blockquote` | 禁止空引用 |
| `no-full-width-number` | 禁止全角数字 |
| `no-half-width-punctuation` | 禁止半角标点 |
| `no-long-code` | 代码块不能过长 |
| `no-multiple-space-blockquote` | 引用块不能有多个空格 |
| `no-space-in-inline-code` | 行内代码前后不能有空格 |
| `no-space-in-link` | 链接文字前后不能有空格 |
| `no-special-characters` | 禁止特殊字符 |
| `use-standard-ellipsis` | 使用标准省略号 |
| `correct-title-trailing-punctuation` | 标题结尾标点符号检查 |
| `require-trailing-spaces` | 软换行前需要两个空格 |
| `space-around-link` | 链接与正文之间需要空格 |
| `no-multiple-blank-lines` | 连续空白行最多保留一行 |

`require-trailing-spaces`、`space-around-link` 和 `no-multiple-blank-lines` 默认关闭。
请在配置文件中显式启用它们。

完整规则列表请参考 [lint-md 文档](https://github.com/lint-md/lint-md#rules-%E9%85%8D%E7%BD%AE)。

## 示例：完整配置

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
        uses: actions/checkout@v6.0.2

      - name: Lint Markdown
        uses: lint-md/github-action@v0.3.0
        with:
          files: './docs ./README.md'
          configFile: '.lintmdrc'
          failOnWarnings: 'false'
```

## License

[MIT](./LICENSE) © Jim Yu

# @lint-md/github-action

⚡ @lint-md 的 GitHub Action 支持，避免每次检测都执行 `yarn install`，速度更快。

## 使用

在 .github 目录下创建一个 github workflow，例如 `.github/workflows/lint-md.yml`：

```yaml
name: Lint Markdown By Lint Markdown

on: [ pull_request ]

jobs:
  lint-markdown:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v2

      - name: lint-md-github-action
        uses: lint-md/github-action@v0.0.2
```

## 参数

### configFile

- 类型：`string`
- 默认值：`.lintmdrc`

您的 lint-md 配置文件的路径，支持 `json` 或者 JavaScript 模块。

如果工作目录下没有任何配置文件，我们使用[默认的规则](https://github.com/lint-md/lint-md#rules-%E9%85%8D%E7%BD%AE)

### failOnWarnings

是否要在出现 warning 时抛出错误。

- 类型：`boolean`
- 默认值：`false`

### files

要 lint 的目录或文件，如果有多个，用空格分割，例如：`./foo ./bar Document.md`

- 类型：`string`
- 默认值：`./`

## LICENSE

MIT

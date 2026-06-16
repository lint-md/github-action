declare module '@lint-md/cli' {
  export type RuleLevel = 0 | 1 | 2 | 'off' | 'warn' | 'error'

  export interface CliConfig {
    excludeFiles?: string[]
    rules?: Record<string, RuleLevel>
  }

  export interface CliLintResult {
    path: string
    file: string
    errors: LintMdError[]
  }

  export interface LintMdError {
    level: string
    type: string
    text: string
    start: { line: number; column: number }
    end: { line: number; column: number }
  }

  export class Lint {
    constructor(files: string[], config: CliConfig)
    start(): Promise<void>
    showResult(): void
    printOverview(): void
    countError(): { error: number; warning: number }
    errorFiles: CliLintResult[]
  }
}

declare module '@lint-md/cli/lib/index' {
  export { Lint, CliConfig, CliLintResult, LintMdError, RuleLevel } from '@lint-md/cli'
}

declare module '@lint-md/cli' {
  export class Lint {
    constructor(files: string[], config: any)
    start(): Promise<void>
    printOverview(): void
    countError(): { error: number; warning: number }
    errorFiles: any[]
  }
  export type CliConfig = any
}

declare module '@lint-md/cli/lib/index' {
  export { Lint, CliConfig } from '@lint-md/cli'
}

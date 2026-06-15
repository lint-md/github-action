import tsPlugin from '@typescript-eslint/eslint-plugin'
import tsParser from '@typescript-eslint/parser'
import importXPlugin from 'eslint-plugin-import-x'

export default [
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        browser: true,
        node: true,
        jest: true
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      'import-x': importXPlugin
    },
    rules: {
      'no-multiple-empty-lines': 1,
      'import-x/no-unresolved': 'off',
      'import-x/order': 'warn',
      '@typescript-eslint/no-empty-interface': 'warn',
      '@typescript-eslint/no-require-imports': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-function': 'off'
    }
  }
]

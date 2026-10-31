import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    files: ['src/{domain,application}/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react/**', 'react-dom', 'react-dom/**', 'framer-motion', 'framer-motion/**', '**/infrastructure/**', '**/presentation/**', '**/app/**'],
          message: 'Domain and application must not depend on frameworks or outer layers. Inject a repository port instead.',
        }],
      }],
      'no-restricted-globals': ['error', 'window', 'document', 'localStorage', 'sessionStorage', 'navigator', 'fetch'],
    },
  },
  {
    files: ['src/domain/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react/**', 'react-dom', 'react-dom/**', 'framer-motion', 'framer-motion/**', '**/application/**', '**/infrastructure/**', '**/presentation/**', '**/app/**'],
          message: 'The domain depends only on the domain and plain JavaScript.',
        }],
      }],
    },
  },
  {
    files: ['src/presentation/**/*.{js,jsx}'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['**/infrastructure/**', '**/app/**'],
          message: 'Presentation receives use cases through PortfolioProvider; concrete adapters belong in the composition root.',
        }],
      }],
    },
  },
  {
    files: ['src/infrastructure/**/*.js'],
    rules: {
      'no-restricted-imports': ['error', {
        patterns: [{
          group: ['react', 'react/**', 'react-dom', 'react-dom/**', 'framer-motion', '**/presentation/**', '**/app/**'],
          message: 'Infrastructure implements the application port and must not import presentation or composition.',
        }],
      }],
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: { globals: globals.node },
  },
])

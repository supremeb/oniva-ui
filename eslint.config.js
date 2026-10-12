import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import reactHooks from 'eslint-plugin-react-hooks';
import stylex from '@stylexjs/eslint-plugin';

export default tseslint.config(
  {
    ignores: [
      '**/dist/**',
      '**/node_modules/**',
      'playwright-report/**',
      'test-results/**',
      'docs/research/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
    plugins: { 'react-hooks': reactHooks },
    rules: {
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      '@typescript-eslint/consistent-type-imports': ['error', { fixStyle: 'inline-type-imports' }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },
  {
    files: ['**/*.{ts,tsx}'],
    plugins: { '@stylexjs': stylex },
    rules: {
      '@stylexjs/valid-styles': 'error',
      '@stylexjs/no-unused': 'warn',
      '@stylexjs/valid-shorthands': 'off',
      // Style objects are kept in logical (not alphabetical) order for readability.
      '@stylexjs/sort-keys': 'off',
    },
  },
);

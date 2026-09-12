/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { defineConfig } from 'eslint/config';
import importX from 'eslint-plugin-import-x';
import perfectionist from 'eslint-plugin-perfectionist';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import tsdoc from 'eslint-plugin-tsdoc';
import tseslint from 'typescript-eslint';

export default defineConfig([
  {
    ignores: [
      '.github/**',
      'coverage/**',
      'dist/**',
      'eslint.config.mjs',
      'tsup.config.ts',
      'vitest.config.ts',
      'node_modules/**',
    ],
  },
  eslint.configs.recommended,
  ...tseslint.configs.strictTypeChecked,
  ...tseslint.configs.stylisticTypeChecked,
  unicorn.configs.recommended,
  importX.flatConfigs.recommended,
  importX.flatConfigs.typescript,
  perfectionist.configs['recommended-natural'],
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: 'error',
    },
    plugins: {
      tsdoc,
    },
    rules: {
      '@typescript-eslint/explicit-function-return-type': ['error', { allowExpressions: true }],
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-unused-vars': [
        'error',
        { argsIgnorePattern: '^_', varsIgnorePattern: '^_' },
      ],
      '@typescript-eslint/strict-boolean-expressions': [
        'error',
        {
          allowNullableObject: true,
          allowNumber: false,
          allowString: false,
        },
      ],
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'tsdoc/syntax': 'error',
      'import-x/no-cycle': 'error',
      'no-console': 'error',
      'no-extend-native': 'error',
      'no-proto': 'error',
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            {
              group: ['node:*'],
              message: 'veils-js must remain isomorphic. Do not import Node.js built-ins.',
            },
          ],
          paths: [
            { name: 'fs', message: 'Do not import Node.js built-ins.' },
            { name: 'path', message: 'Do not import Node.js built-ins.' },
            { name: 'crypto', message: 'Do not import Node.js built-ins.' },
          ],
        },
      ],
      '@typescript-eslint/no-dynamic-delete': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'ForInStatement',
          message:
            'for...in loops over Proxies trigger an avalanche of internal traps (ownKeys, getOwnPropertyDescriptor) and destroy V8 optimization. Use Reflect.ownKeys() or Object.keys() instead.',
        },
      ],
    },
    settings: {
      'import-x/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  eslintConfigPrettier,
]);

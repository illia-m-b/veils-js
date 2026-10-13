/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { ConfigWithExtends } from 'typescript-eslint';

import eslint from '@eslint/js';
import eslintConfigPrettier from 'eslint-config-prettier';
import { flatConfigs as importX } from 'eslint-plugin-import-x';
import { configs as perfectionist } from 'eslint-plugin-perfectionist';
import tsdoc from 'eslint-plugin-tsdoc';
import unicorn from 'eslint-plugin-unicorn';
import globals from 'globals';
import { configs as tseslint } from 'typescript-eslint';

export default [
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
  ...tseslint.strictTypeChecked,
  ...tseslint.stylisticTypeChecked,
  unicorn.configs.recommended,
  importX.recommended,
  importX.typescript,
  perfectionist['recommended-natural'],
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
      '@typescript-eslint/no-dynamic-delete': 'error',
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
      'import-x/no-cycle': 'error',
      'no-console': 'error',
      'no-extend-native': 'error',
      'no-proto': 'error',
      'no-restricted-imports': [
        'error',
        {
          paths: [
            { message: 'Do not import Node.js built-ins.', name: 'fs' },
            { message: 'Do not import Node.js built-ins.', name: 'path' },
            { message: 'Do not import Node.js built-ins.', name: 'crypto' },
          ],
          patterns: [
            {
              group: ['node:*'],
              message: 'veils-js must remain isomorphic. Do not import Node.js built-ins.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          message:
            'for...in loops over Proxies trigger an avalanche of internal traps (ownKeys, getOwnPropertyDescriptor) and destroy V8 optimization. Use Reflect.ownKeys() or Object.keys() instead.',
          selector: 'ForInStatement',
        },
      ],
      'tsdoc/syntax': 'error',
      'unicorn/no-asterisk-prefix-in-documentation-comments': 'off',
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
] satisfies ConfigWithExtends[];

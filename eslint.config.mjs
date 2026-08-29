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
      'import-x/no-cycle': 'error',
      'import-x/no-unused-modules': 'off',
      'no-console': 'error',
      'unicorn/filename-case': 'off',
      'unicorn/no-empty-file': 'off',
      'unicorn/prevent-abbreviations': 'off',
    },
  },
  eslintConfigPrettier,
]);

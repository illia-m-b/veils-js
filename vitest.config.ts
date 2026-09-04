/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['test/**/*.test.ts'],
    typecheck: {
      enabled: true,
    },
    pool: 'threads',
    isolate: false,
    sequence: {
      shuffle: true,
    },
    slowTestThreshold: 100,
    testTimeout: 2000,
    onConsoleLog(): never {
      throw new Error('Logs are forbidden in test suites');
    },
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      include: ['src/**/*.ts'],
      thresholds: {
        100: true,
      },
    },
  },
});

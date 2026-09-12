/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expectTypeOf, test } from 'vitest';

import type { VeilCache } from '../src/veil-cache.js';

test('infers cache types correctly', (): void => {
  interface Page {
    id: string;
    load: () => string;
    save(content: ArrayBuffer): string;
  }
  interface PageCache {
    id?: string;
    load?: string;
    save?: string;
  }
  expectTypeOf<VeilCache<Page>>().toEqualTypeOf<PageCache>();
});

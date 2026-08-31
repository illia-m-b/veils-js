/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expectTypeOf, test } from 'vitest';

import { ShiftsIn } from '../src/ShiftsIn.js';

test('infers input shifts correctly', (): void => {
  interface Page {
    id: string;
    load: () => string;
    save(content: ArrayBuffer): string;
  }
  interface PageShiftsIn {
    id?: never;
    load?: () => [];
    save?(content: ArrayBuffer): [ArrayBuffer];
  }
  expectTypeOf<ShiftsIn<Page>>().toEqualTypeOf<PageShiftsIn>();
});

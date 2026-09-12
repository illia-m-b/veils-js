/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expectTypeOf, test } from 'vitest';

import type { ShiftsOut } from '../src/shifts-out.js';

test('infers output shifts correctly', (): void => {
  interface Post {
    content: () => string;
    fetched: () => Promise<Map<string, boolean>>;
    id: number;
  }
  interface PostShiftsOut {
    content?: (content: string) => string;
    fetched?: (
      fetched: Map<string, boolean>,
    ) => Map<string, boolean> | Promise<Map<string, boolean>>;
    id?: (id: number) => number;
  }
  expectTypeOf<ShiftsOut<Post>>().toEqualTypeOf<PostShiftsOut>();
});

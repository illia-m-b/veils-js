/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expectTypeOf, test } from 'vitest';

import type { ShiftsOut } from '../src/ShiftsOut.js';

test('infers output shifts correctly', (): void => {
  interface Post {
    content: () => string;
    id: number;
  }
  interface PostShiftsOut {
    content?: (content: string) => string;
    id?: (id: number) => number;
  }
  expectTypeOf<ShiftsOut<Post>>().toEqualTypeOf<PostShiftsOut>();
});

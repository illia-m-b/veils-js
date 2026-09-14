/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expectTypeOf, test } from 'vitest';

import type { ShiftsOut } from '../src/shifts-out.js';

test('infers output shifts correctly', (): void => {
  interface Post {
    method: () => Map<string, boolean>;
    nested: () => Promise<PromiseLike<symbol>>;
    promise: () => Promise<number>;
    property: string;
    thenable: () => PromiseLike<boolean>;
    union: () => number | Promise<number>;
  }
  interface PostShiftsOut {
    method?: (_argument: Map<string, boolean>) => Map<string, boolean>;
    nested?: (_argument: symbol) => Promise<symbol> | symbol;
    promise?: (_argument: number) => number | Promise<number>;
    property?: (_argument: string) => string;
    thenable?: (_isReady: boolean) => boolean | Promise<boolean>;
    union?: ((_argument: number) => number) | ((_argument: number) => number | Promise<number>);
  }
  expectTypeOf<ShiftsOut<Post>>().toEqualTypeOf<PostShiftsOut>();
});

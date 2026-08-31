/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { ShiftsIn } from '../src/ShiftsIn.js';

import { alterIn } from '../src/alterIn.js';

test('returns original value for a property', (): void => {
  interface User {
    age: number;
  }
  const age = 30;
  const dude: User = { age };
  const shifts: ShiftsIn<User> = {};
  const covering: User = alterIn(dude, shifts);
  expect(covering.age).toBe(age);
});

test('calls original method when shift is not provided', (): void => {
  interface User {
    age: () => number;
  }
  const age = 30;
  const dude: User = { age: (): number => age };
  const shifts: ShiftsIn<User> = {};
  const covering: User = alterIn(dude, shifts);
  expect(covering.age()).toBe(age);
});

test('modifies input arguments using the provided shift', (): void => {
  interface Maths {
    square: (x: number) => number;
  }
  const maths: Maths = { square: (x: number): number => x * x };
  const shifts: ShiftsIn<Maths> = { square: (x: number): [number] => [x * 2] };
  const covering: Maths = alterIn(maths, shifts);
  const original = 10;
  const squareOfDouble = (2 * original) ** 2;
  expect(covering.square(original)).toBe(squareOfDouble);
});

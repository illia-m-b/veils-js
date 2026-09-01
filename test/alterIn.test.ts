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
  class DumbUser {
    constructor(public readonly name: string) {}
    greeting(): string {
      return `Hello, ${this.name}!`;
    }
  }
  const name = 'John';
  const greeting = `Hello, ${name}!`;
  const john = new DumbUser(name);
  const shifts: ShiftsIn<DumbUser> = {};
  const covering: DumbUser = alterIn(john, shifts);
  expect(covering.greeting()).toBe(greeting);
});

test('modifies input arguments using the provided shift', (): void => {
  class DumbMaths {
    constructor(public readonly x: number) {}
    sum(y: number): number {
      return this.x + y;
    }
  }
  const x = 10;
  const y = 20;
  const xPlusDoubleY = x + y * 2;
  const maths = new DumbMaths(x);
  const shifts: ShiftsIn<DumbMaths> = { sum: (y: number): [number] => [y * 2] };
  const covering: DumbMaths = alterIn(maths, shifts);
  expect(covering.sum(y)).toBe(xPlusDoubleY);
});

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
  expect(covering.age, 'Original property value must remain unmodified by alterIn').toBe(age);
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
  expect(
    covering.greeting(),
    'Method without a shift transformer must return original output',
  ).toBe(greeting);
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
  expect(covering.sum(y), 'Shift transformer was not applied to the method arguments').toBe(
    xPlusDoubleY,
  );
});

test('respects proxied methods', (): void => {
  class DumbUser {
    constructor(public readonly name: string) {}
    greeting(stranger: string): string {
      return `Hello, ${stranger}`;
    }
    meeting(phrase: string, stranger: string): string {
      return `${this.greeting(stranger)}. ${phrase} is ${this.name}.`;
    }
  }
  const name = 'John';
  const stranger = '\r\n \t  jack    ';
  const phrase = 'my name';
  const transformed = `Hello, ${stranger.trim()}. ${phrase.toUpperCase()} is ${name}.`;
  const john = new DumbUser(name);
  const shifts: ShiftsIn<DumbUser> = {
    greeting: (stranger: string): [string] => [stranger.trim()],
    meeting: (phrase: string, stranger: string): [string, string] => [
      phrase.toUpperCase(),
      stranger,
    ],
  };
  const covering: DumbUser = alterIn(john, shifts);
  expect(
    covering.meeting(phrase, stranger),
    'Internal method call on proxied receiver failed to apply shift',
  ).toBe(transformed);
});

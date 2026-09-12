/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { ShiftsIn } from '../src/shifts-in.js';

import { alterIn } from '../src/alter-in.js';

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

test('respects proxy invariants for frozen methods', (): void => {
  interface Maths {
    maths(n: number): number;
  }
  const original = Math.random();
  const doubled = original * 2;
  const maths: Maths = {
    maths(n: number): number {
      return n * 2;
    },
  };
  Object.defineProperty(maths, 'maths', { configurable: false, writable: false });
  const shifts: ShiftsIn<Maths> = { maths: (n: number): [number] => [n * 2] };
  const covering = alterIn(maths, shifts);
  expect(
    covering.maths(original),
    'The input shift was applied to a frozen method, violating proxy invariants',
  ).toBe(doubled);
});

test('preserves method referential identity upon repeated access', (): void => {
  const object = { dumb: (s: string): string => s };
  const shifts: ShiftsIn<typeof object> = { dumb: (s: string): [string] => [s.trim()] };
  const covering = alterIn(object, shifts);
  expect(covering.dumb, 'The proxy returned a different closure on repeated method access').toBe(
    covering.dumb,
  );
});

test('resolves method when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const shifts: ShiftsIn<typeof object> = { dumb: () => [] };
  const covering = alterIn(object, shifts);
  const receiver = 42;
  const resolved = Reflect.get(covering, 'dumb', receiver);
  expect(typeof resolved, 'Failed to resolve method when accessed with a primitive receiver').toBe(
    'function',
  );
});

test('bypasses method cache when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const shifts: ShiftsIn<typeof object> = { dumb: () => [] };
  const covering = alterIn(object, shifts);
  const receiver = 42;
  const first = Reflect.get(covering, 'dumb', receiver);
  const second = Reflect.get(covering, 'dumb', receiver);
  expect(
    first,
    'A primitive receiver was erroneously cached despite not being a valid WeakMap key',
  ).not.toBe(second);
});

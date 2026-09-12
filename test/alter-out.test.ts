/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { ShiftsOut } from '../src/shifts-out.js';

import { alterOut } from '../src/alter-out.js';

test('returns original value when there is no corresponding transformer function', (): void => {
  class DumbMath {
    constructor(public readonly value: number) {}
    sumSquared(other: number): number {
      return (this.value + other) ** 2;
    }
  }
  const value = 2;
  const other = 3;
  const maths = new DumbMath(value);
  const shifts: ShiftsOut<DumbMath> = {};
  const covering: DumbMath = alterOut(maths, shifts);
  expect(
    covering.sumSquared(other),
    'Method without a shift transformer must return unmodified output',
  ).toBe((value + other) ** 2);
});

test('alters the result of the original method with the given transformer function', (): void => {
  class DumbMath {
    constructor(public readonly value: number) {}
    sumSquared(other: number): number {
      return (this.value + other) ** 2;
    }
  }
  const value = 2;
  const other = 3;
  const maths = new DumbMath(value);
  const shifts: ShiftsOut<DumbMath> = { sumSquared: (result: number): number => result * 2 };
  const covering: DumbMath = alterOut(maths, shifts);
  expect(
    covering.sumSquared(other),
    'Shift transformer was not applied to the method return value',
  ).toBe((value + other) ** 2 * 2);
});

test('alters the value of the original property with the given transformer function', (): void => {
  interface Maths {
    readonly value: number;
  }
  const value = 2;
  const maths: Maths = { value };
  const shifts: ShiftsOut<Maths> = { value: (v: number): number => v * 2 };
  const covering: Maths = alterOut(maths, shifts);
  expect(covering.value, 'Shift transformer was not applied to the property value').toBe(value * 2);
});

test('respects proxied methods', (): void => {
  class DumbUser {
    constructor(
      public readonly firstName: string,
      public readonly lastName: string,
    ) {}
    fullName(): string {
      return `${this.firstName} ${this.lastName}`;
    }
    greeting(): string {
      return `Hello, ${this.fullName()}!`;
    }
  }
  const pollutedFirstName = '   \r\n  \t John';
  const pollutedLastName = 'Smith   \r\n  \t ';
  const pollutedFullName = `${pollutedFirstName} ${pollutedLastName}`;
  const transformed = `Hello, ${pollutedFullName.trim()}!`.toUpperCase();
  const john = new DumbUser(pollutedFirstName, pollutedLastName);
  const shifts: ShiftsOut<DumbUser> = {
    fullName: (n: string): string => n.trim(),
    greeting: (g: string): string => g.toUpperCase(),
  };
  const covering: DumbUser = alterOut(john, shifts);
  expect(
    covering.greeting(),
    'Nested method call on proxied receiver failed to apply output shift',
  ).toBe(transformed);
});

test('alters the resolved value of a promise returned by an asynchronous method', async (): Promise<void> => {
  interface Maths {
    maths: () => Promise<number>;
  }
  const random = Math.random();
  const transformed = random * 2;
  const object: Maths = { maths: () => Promise.resolve(random) };
  const shifts: ShiftsOut<Maths> = { maths: (n: number): number => n * 2 };
  const covering: Maths = alterOut(object, shifts);
  expect(
    await covering.maths(),
    'The output shift was not applied to the resolved value of the promise',
  ).toBe(transformed);
});

test('respects proxy invariants for frozen data properties', (): void => {
  interface Maths {
    readonly maths: number;
  }
  const original = Math.random();
  const object: Maths = { maths: original };
  Object.defineProperty(object, 'maths', { configurable: false, writable: false });
  const shifts: ShiftsOut<Maths> = { maths: (v: number) => v * 2 };
  const covering: Maths = alterOut(object, shifts);
  expect(
    covering.maths,
    'The output shift was applied to a frozen data property, violating proxy invariants',
  ).toBe(original);
});

test('respects proxy invariants for frozen setter-only accessors', (): void => {
  const object = Object.defineProperty({}, 'property', {
    configurable: false,
    set: (): void => {
      Object.freeze({});
    },
  });
  const covering = alterOut(object, { property: () => 'altered' });
  expect(
    // @ts-expect-error: property is defined with `Object.defineProperty`
    covering.property,
    'The output shift was applied to a setter-only accessor, violating proxy invariants',
  ).toBe(undefined);
});

test('respects proxy invariants for frozen methods', (): void => {
  interface Maths {
    maths: () => number;
  }
  const original = Math.random();
  const maths: Maths = { maths: (): number => original };
  Object.defineProperty(maths, 'maths', {
    configurable: false,
    writable: false,
  });
  const shifts: ShiftsOut<Maths> = { maths: (n: number): number => n * 2 };
  const covering: Maths = alterOut(maths, shifts);
  expect(
    covering.maths(),
    'The output shift was applied to a frozen method, violating proxy invariants',
  ).toBe(original);
});

test('preserves method referential identity upon repeated access', (): void => {
  const object = { dumb: (): string => 'Hello' };
  const shifts: ShiftsOut<typeof object> = { dumb: (s: string): string => s.toUpperCase() };
  const covering = alterOut(object, shifts);
  expect(covering.dumb, 'The proxy returned a different closure on repeated method access').toBe(
    covering.dumb,
  );
});

test('resolves method when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const shifts: ShiftsOut<typeof object> = { dumb: (value) => value };
  const covering = alterOut(object, shifts);
  const receiver = 42;
  const resolved = Reflect.get(covering, 'dumb', receiver);
  expect(typeof resolved, 'Failed to resolve method when accessed with a primitive receiver').toBe(
    'function',
  );
});

test('bypasses method cache when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const shifts: ShiftsOut<typeof object> = { dumb: (value) => value };
  const covering = alterOut(object, shifts);
  const receiver = 42;
  const first = Reflect.get(covering, 'dumb', receiver);
  const second = Reflect.get(covering, 'dumb', receiver);
  expect(
    first,
    'A primitive receiver was erroneously cached despite not being a valid WeakMap key',
  ).not.toBe(second);
});

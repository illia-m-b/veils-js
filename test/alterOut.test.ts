/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { ShiftsOut } from '../src/ShiftsOut.js';

import { alterOut } from '../src/alterOut.js';

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

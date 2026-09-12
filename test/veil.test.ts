/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { VeilCache } from '../src/veil-cache.js';

import { veil } from '../src/veil.js';

test('returns cached value for a property', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = veil(john, cache);
  expect(covering.name, 'Failed to serve cached property value while veil is intact').toBe(cached);
});

test('returns cached value as a callable function for a method', (): void => {
  interface User {
    name: () => string;
  }
  const john: User = { name: (): string => 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = veil(john, cache);
  expect(covering.name(), 'Cached method did not return expected value when called').toBe(cached);
});

test('falls back to original object when there is no corresponding cache', (): void => {
  class DumbUser {
    constructor(public readonly name: string) {}
    greeting(): string {
      return `Hello, ${this.name}!`;
    }
  }
  const name = 'John';
  const original = `Hello, ${name}!`;
  const john = new DumbUser(name);
  const cache: VeilCache<DumbUser> = { name: 'David' };
  const covering: DumbUser = veil(john, cache);
  expect(covering.greeting(), 'Uncached method call failed to delegate to original object').toBe(
    original,
  );
});

test('ignores cache entirely after the veil is pierced', (): void => {
  class DumbUser {
    constructor(public readonly name: string) {}
    greeting(): string {
      return `Hello, ${this.name}!`;
    }
  }
  const original = 'John';
  const john = new DumbUser(original);
  const cache: VeilCache<DumbUser> = { name: 'David' };
  const covering: DumbUser = veil(john, cache);
  covering.greeting();
  expect(covering.name, 'Cache was still served after the veil was pierced').toBe(original);
});

test('pierces the veil and returns mutated value after property assignment', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cache: VeilCache<User> = { name: 'Jack' };
  const covering: User = veil(john, cache);
  const mutated = 'James';
  covering.name = mutated;
  expect(covering.name, 'Veil was not pierced following property mutation').toBe(mutated);
});

/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { VeilCache } from '../src/VeilCache.js';

import { veil } from '../src/veil.js';

test('returns cached value for a property', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = veil(john, cache);
  expect(covering.name).toBe(cached);
});

test('returns cached value as a callable function for a method', (): void => {
  interface User {
    name: () => string;
  }
  const john: User = { name: (): string => 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = veil(john, cache);
  expect(covering.name()).toBe(cached);
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
  expect(covering.greeting()).toBe(original);
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
  expect(covering.name).toBe(original);
});

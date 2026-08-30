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
  const covering = veil(john, cache);
  expect(covering.name).toBe(cached);
});

test('returns cached value as a callable function for a method', (): void => {
  interface User {
    name: () => string;
  }
  const john: User = { name: (): string => 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering = veil(john, cache);
  expect(covering.name()).toBe(cached);
});

test('falls back to original object when property is not in cache', (): void => {
  interface User {
    age: () => number;
    name: () => string;
  }
  const age = 30;
  const john: User = {
    age: (): number => age,
    name: (): string => 'John',
  };
  const cache: VeilCache<User> = { name: 'David' };
  const covering = veil(john, cache);
  expect(covering.age()).toBe(age);
});

test('ignores cache entirely after the veil is pierced', (): void => {
  interface User {
    age: () => number;
    name: () => string;
  }
  const name = 'John';
  const john: User = {
    age: (): number => 30,
    name: (): string => name,
  };
  const cache: VeilCache<User> = { name: 'David' };
  const covering = veil(john, cache);
  covering.age();
  expect(covering.name()).toBe(name);
});

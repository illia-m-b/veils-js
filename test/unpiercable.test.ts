/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { VeilCache } from '../src/VeilCache.js';

import { unpiercable } from '../src/unpiercable.js';

test('returns cached value for a property', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const veil = unpiercable(john, cache);
  expect(veil.name).toBe(cached);
});

test('returns cached value as a callable function for a method', (): void => {
  interface User {
    name: () => string;
  }
  const john: User = { name: (): string => 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const veil = unpiercable(john, cache);
  expect(veil.name()).toBe(cached);
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
  const veil = unpiercable(john, cache);
  expect(veil.age()).toBe(age);
});

test('retains cached value after accessing an uncached property', (): void => {
  interface Post {
    content: () => string;
    length: () => number;
  }
  const content = 'Hello, world!';
  const post: Post = {
    content: (): string => content,
    length: (): number => content.length,
  };
  const cached = 0;
  const cache: VeilCache<Post> = { length: cached };
  const veil = unpiercable(post, cache);
  veil.content();
  expect(veil.length()).toBe(cached);
});

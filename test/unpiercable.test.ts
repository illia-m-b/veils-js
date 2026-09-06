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
  const covering: User = unpiercable(john, cache);
  expect(covering.name, 'Failed to retrieve cached property value').toBe(cached);
});

test('returns cached value as a callable function for a method', (): void => {
  interface User {
    name: () => string;
  }
  const john: User = { name: (): string => 'John' };
  const cached = 'David';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = unpiercable(john, cache);
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
  const greeting = `Hello, ${name}!`;
  const john = new DumbUser(name);
  const cache: VeilCache<DumbUser> = {};
  const covering: DumbUser = unpiercable(john, cache);
  expect(covering.greeting(), 'Uncached method call failed to delegate to original object').toBe(
    greeting,
  );
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
  const covering: Post = unpiercable(post, cache);
  covering.content();
  expect(covering.length(), 'Unpiercable veil was pierced by accessing an uncached property').toBe(
    cached,
  );
});

test('retains cached value after property mutation', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cached = 'Jack';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = unpiercable(john, cache);
  covering.name = 'James';
  expect(covering.name, 'Unpiercable veil allowed property mutation to pierce the cache').toBe(
    cached,
  );
});

test('mutates the original object upon property assignment', (): void => {
  interface User {
    name: string;
  }
  const john: User = { name: 'John' };
  const cache: VeilCache<User> = { name: 'Jack' };
  const covering: User = unpiercable(john, cache);
  const mutated = 'James';
  covering.name = mutated;
  expect(john.name, 'Property assignment on proxy was not forwarded to the target object').toBe(
    mutated,
  );
});

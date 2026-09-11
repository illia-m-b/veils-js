/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Policy } from '../src/Policy.js';
import type { VeilCache } from '../src/VeilCache.js';

import { cloak } from '../src/cloak.js';

/**
 * A dumb policy that allows accessing the cached value exactly two times. Any
 * subsequent access bypasses the cache, unless a property is mutated, which
 * resets the access counter.
 */
const twoTimesPolicy = (): Policy => {
  let count = 0;
  return {
    onMutate: (_property: string | symbol): void => {
      count = 0;
    },
    verdict: (_property: string | symbol, isInCache: boolean): boolean => {
      if (count >= 2) {
        return false;
      }
      count += 1;
      return isInCache;
    },
  };
};

test('respects custom policy decisions over multiple accesses', (): void => {
  interface User {
    readonly name: string;
  }
  const original = 'John';
  const john: User = { name: original };
  const cached = 'Jack';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = cloak(john, cache, twoTimesPolicy());
  expect(
    [covering.name, covering.name, covering.name],
    'Policy decisions were not followed across successive accesses',
  ).toStrictEqual([cached, cached, original]);
});

test('resets policy state and restores cache access upon property mutation', (): void => {
  interface User {
    name: string;
  }
  const original = 'John';
  const john: User = { name: original };
  const cached = 'Jack';
  const cache: VeilCache<User> = { name: cached };
  const covering: User = cloak(john, cache, twoTimesPolicy());
  const sequence: string[] = [covering.name, covering.name, covering.name];
  covering.name = 'James';
  sequence.push(covering.name);
  expect(sequence, 'Policy failed to restore cache access after property mutation').toStrictEqual([
    cached,
    cached,
    original,
    cached,
  ]);
});

test('does not notify policy when mutation fails', (): void => {
  interface User {
    name: string;
  }
  const original = 'John';
  const cached = 'Jack';
  const john: User = { name: original };
  Object.defineProperty(john, 'name', { writable: false });
  const cache: VeilCache<User> = { name: cached };
  const covering: User = cloak(john, cache, twoTimesPolicy());
  const calls = [covering.name, covering.name];
  try {
    covering.name = 'James';
  } catch (error: unknown) {
    if (!(error instanceof TypeError)) {
      throw error;
    }
  }
  calls.push(covering.name);
  expect(calls, 'Policy was notified, even though the mutation failed').toStrictEqual([
    cached,
    cached,
    original,
  ]);
});

test('does not evaluate eager getters when serving from cache', (): void => {
  const object = {
    get dumb(): number {
      throw new Error('You are not allowed to execute this code!');
    },
  };
  const cached = Math.random();
  const cache: VeilCache<typeof object> = { dumb: cached };
  const covering = cloak(object, cache, twoTimesPolicy());
  expect(
    covering.dumb,
    'Cloak eagerly evaluated the getter despite policy allowing cache access',
  ).toBe(cached);
});

test('preserves method referential identity upon repeated access', (): void => {
  const object = { dumb: (): string => 'Hello' };
  const cache: VeilCache<typeof object> = { dumb: 'Cached' };
  const covering = cloak(object, cache, twoTimesPolicy());
  expect(covering.dumb, 'The proxy returned a different closure on repeated method access').toBe(
    covering.dumb,
  );
});

test('resolves method when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const cache: VeilCache<typeof object> = { dumb: [] };
  const covering = cloak(object, cache, twoTimesPolicy());
  const receiver = 42;
  const resolved = Reflect.get(covering, 'dumb', receiver);
  expect(typeof resolved, 'Failed to resolve method when accessed with a primitive receiver').toBe(
    'function',
  );
});

test('bypasses method cache when accessed with a primitive receiver', (): void => {
  const object = { dumb: (): number[] => [] };
  const cache: VeilCache<typeof object> = { dumb: [] };
  const covering = cloak(object, cache, twoTimesPolicy());
  const receiver = 42;
  const first = Reflect.get(covering, 'dumb', receiver);
  const second = Reflect.get(covering, 'dumb', receiver);
  expect(
    first,
    'A primitive receiver was erroneously cached despite not being a valid WeakMap key',
  ).not.toBe(second);
});

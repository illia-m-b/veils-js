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
  const john: User = { name: original };
  Object.defineProperty(john, 'name', { writable: false });
  const cache: VeilCache<User> = { name: 'Jack' };
  const covering: User = cloak(john, cache, twoTimesPolicy());
  void covering.name; // eslint-disable-line @typescript-eslint/no-meaningless-void-operator
  void covering.name; // eslint-disable-line @typescript-eslint/no-meaningless-void-operator
  try {
    covering.name = 'James';
  } catch {} // eslint-disable-line no-empty
  expect(covering.name, 'Policy was notified, even though the mutation failed').toBe(original);
});

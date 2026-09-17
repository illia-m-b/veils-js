/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { describe, expect, test } from 'vitest';

import type { Policy } from '../src/policy.js';
import type { VeilCache } from '../src/veil-cache.js';

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

/**
 * A fake policy that served pre-defined verdict result and ignores mutation at
 * all.
 *
 * @param isCached - The constant indicator whether it should serve cache or
 *   not.
 */
const fkPolicy = (isCached: boolean): Policy => ({
  onMutate: (): void => {
    //
  },
  verdict: (): boolean => isCached,
});

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

test('notifies a policy when a property is mutated with Object.defineProperty()', (): void => {
  const john = { name: 'John' };
  const cache: VeilCache<typeof john> = { name: 'Jack' };
  let isMutated = false;
  const covering = cloak(john, cache, {
    onMutate: () => {
      isMutated = true;
    },
    verdict: () => true,
  });
  Object.defineProperty(covering, 'name', { value: 'James' });
  expect(
    isMutated,
    'Mutating a property with Object.defineProperty() was not considered as mutation',
  ).toBe(true);
});

test('does not notify a policy when mutation with Object.defineProperty() fails', (): void => {
  const john = { name: 'John' };
  Object.defineProperty(john, 'name', { configurable: false, writable: false });
  const cache: VeilCache<typeof john> = { name: 'Jack' };
  let isMutated = false;
  const covering = cloak(john, cache, {
    onMutate: () => {
      isMutated = true;
    },
    verdict: () => true,
  });
  try {
    Object.defineProperty(covering, 'name', { value: 'James' });
  } catch {} // eslint-disable-line no-empty
  expect(
    isMutated,
    'Policy is always notified about mutation despite the actual result of the mutation',
  ).toBe(false);
});

test('notifies a policy when a property is deleted', (): void => {
  interface Dude {
    name?: string;
  }
  const john: Dude = { name: 'John' };
  const cache: VeilCache<Dude> = { name: 'Jack' };
  let isMutated = false;
  const covering: Dude = cloak(john, cache, {
    onMutate: () => {
      isMutated = true;
    },
    verdict: () => true,
  });
  delete covering.name;
  expect(isMutated, 'Property deletion was not considered as mutation').toBe(true);
});

test('does not notify a policy when deletion fails', (): void => {
  interface Dude {
    name?: string;
  }
  const john: Dude = { name: 'John' };
  Object.defineProperty(john, 'name', { configurable: false });
  const cache: VeilCache<Dude> = { name: 'Jack' };
  let isMutated = false;
  const covering: Dude = cloak(john, cache, {
    onMutate: () => {
      isMutated = true;
    },
    verdict: () => true,
  });
  try {
    delete covering.name;
  } catch {} // eslint-disable-line no-empty
  expect(
    isMutated,
    'Policy is always notified about mutation despite the actual result of the deletion',
  ).toBe(false);
});

describe('getOwnPropertyDescriptor trap', (): void => {
  test('returns undefined for missing properties', (): void => {
    const dude = {};
    const covering = cloak(dude, {}, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'ghost');
    expect(
      descriptor,
      'Engine returned a defined descriptor for a strictly non-existent object key',
    ).toBeUndefined();
  });

  test('preserves original descriptor when policy denies cache', (): void => {
    const original = 10;
    const dude = { age: original };
    const covering = cloak(dude, { age: Math.random() }, fkPolicy(false));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.value,
      'Descriptor was maliciously veiled even though the caching policy forbade it',
    ).toBe(original);
  });

  test('preserves original descriptor for non-configurable accessors', (): void => {
    const original = 10;
    const dude = {};
    Object.defineProperty(dude, 'age', { get: () => original });
    const covering = cloak(dude, { age: Math.random() }, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.get?.(),
      'The getter of a non-configurable accessor was mutated violating strict proxy invariants',
    ).toBe(original);
  });

  test('preserves original descriptor for completely frozen data properties', (): void => {
    const original = 10;
    const dude = {};
    Object.defineProperty(dude, 'age', { value: original });
    const covering = cloak(dude, { age: Math.random() }, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.value,
      'The value of a frozen data property was mutated violating strict proxy invariants',
    ).toBe(original);
  });

  test('preserves original descriptor for write-only properties', (): void => {
    const dude = {
      set age(_value: unknown) {
        //
      },
    };
    const covering = cloak(dude, { age: 20 }, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      typeof descriptor?.get,
      'A write-only property was implicitly and illegally converted into a readable accessor',
    ).toBe('undefined');
  });

  test('veils value for non-configurable but writable data properties', (): void => {
    const dude = {};
    Object.defineProperty(dude, 'age', { value: 10, writable: true });
    const cached = Math.random();
    const covering = cloak(dude, { age: cached }, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.value,
      'A writable data property was ignored by the veiling mechanism despite being legally modifiable',
    ).toBe(cached);
  });

  test('veils property for accessor', (): void => {
    const dude = {
      get age(): number {
        return 10;
      },
    };
    const cached = Math.random();
    const cache: VeilCache<typeof dude> = { age: cached };
    const covering = cloak(dude, cache, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.get?.(),
      'The active policy failed to veil the valid target descriptor for a getter',
    ).toBe(cached);
  });

  test('veils regular property', (): void => {
    const dude = { age: 10 };
    const cached = Math.random();
    const cache: VeilCache<typeof dude> = { age: cached };
    const covering = cloak(dude, cache, fkPolicy(true));
    const descriptor = Object.getOwnPropertyDescriptor(covering, 'age');
    expect(
      descriptor?.value,
      'The active policy failed to veil the valid target descriptor for a regular property',
    ).toBe(cached);
  });
});

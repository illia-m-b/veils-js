/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Policy } from './Policy.js';
import type { VeilCache } from './VeilCache.js';

/**
 * Internal proxy engine that intercepts property and method access.
 *
 * @param object The original target object to be veiled.
 * @param cache The partial object containing pre-calculated values.
 * @param policy The caching rules engine to determine if cache should be used.
 *
 * @returns A `Proxy` that serves values from the cache if the policy allows,
 *   preserving the distinction between static properties and callable methods.
 *   If the policy denies cache usage, it falls back to the actual target using
 *   `Reflect`.
 */
export const cloak = <T extends object>(
  object: T,
  cache: NoInfer<VeilCache<T>>,
  policy: Policy,
): T =>
  new Proxy(object, {
    get(target: T, property: string | symbol, receiver: unknown) {
      const original = Reflect.get(target, property, receiver);
      if (policy.verdict(property, Object.hasOwn(cache, property))) {
        const cached = cache[property as keyof T];
        return typeof original === 'function' ? () => cached : cached;
      }
      return original;
    },

    set(target: T, property: string | symbol, newValue: unknown, receiver: unknown): boolean {
      policy.onMutate(property);
      return Reflect.set(target, property, newValue, receiver);
    },
  });

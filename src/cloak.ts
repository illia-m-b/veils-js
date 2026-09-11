/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Policy } from './Policy.js';
import type { VeilCache } from './VeilCache.js';

import { Member } from './Member.js';
import { members, Members } from './members.js';

/**
 * Creates a veiled wrapper around the given object using a custom caching
 * policy.
 *
 * This function serves as the foundation for creating custom veil decorators
 * (such as {@link veil} or {@link unpiercable}). It intercepts property and
 * method access, querying the provided {@link Policy} to determine whether to
 * serve pre-calculated values from the cache or delegate to the original
 * object. When a method is cached, it returns a callable function that resolves
 * to the cached value, preserving the callable interface. Any property
 * mutations notify the policy via its `onMutate` callback before modifying the
 * target object.
 *
 * @remarks
 * NEVER decorate objects whose methods access ECMAScript `#private` fields or
 * methods. Because `Proxy` traps preserve receiver context, accessing native
 * `#private` members will throw a `TypeError`.
 *
 * @param object - The original target object to wrap.
 * @param cache - A partial object containing pre-calculated values or method
 *   returns.
 * @param policy - The caching policy that determines whether the cache should
 *   be used.
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
): T => {
  const collection: Members = members(object);
  return new Proxy(object, {
    get(_target: T, property: string | symbol, receiver: unknown) {
      const member: Member = collection.member(property);
      if (policy.verdict(property, Object.hasOwn(cache, property))) {
        return member.veiled(cache[property as keyof T], receiver);
      }
      return member.value(receiver);
    },

    set(target: T, property: string | symbol, newValue: unknown, receiver: unknown): boolean {
      const isMutated = Reflect.set(target, property, newValue, receiver);
      if (isMutated) {
        policy.onMutate(property);
      }
      return isMutated;
    },
  });
};

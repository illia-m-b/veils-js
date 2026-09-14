/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './member.js';

import { hasGetInvariant } from './has-get-invariant.js';

const isFunction = (value: unknown): value is (...arguments_: unknown[]) => unknown =>
  typeof value === 'function';

/**
 * Resolves the underlying property value.
 *
 * @param target - The original object.
 * @param key - The property key.
 * @param receiver - The proxy receiver.
 *
 * @returns The resolved value.
 */
const resolved = (target: object, key: string | symbol, receiver: unknown): unknown =>
  Reflect.get(target, key, receiver);

/**
 * Executes a resolved function, preserving its context.
 *
 * @param target - The original object.
 * @param key - The property key.
 * @param receiver - The proxy receiver.
 * @param parameters - The arguments to pass to the function.
 *
 * @returns The result of the function execution.
 *
 * @throws `TypeError` if the resolved property is not a function.
 */
const executed = (
  target: object,
  key: string | symbol,
  receiver: unknown,
  parameters: unknown[],
): unknown => {
  const function_ = resolved(target, key, receiver);
  if (!isFunction(function_)) {
    throw new TypeError('Expected a method, but received a different type');
  }
  return Reflect.apply(function_, receiver, parameters);
};

/**
 * Determines if a value can safely be used as a key in a `WeakMap`.
 *
 * @param value - The value to check.
 *
 * @returns `true` if the value is a valid `WeakMap` key.
 */
const isWeakKey = (value: unknown): value is object =>
  (typeof value === 'object' && value !== null) || typeof value === 'function';

/**
 * Creates a {@link Member} representation for an object's method.
 *
 * This factory generates a member that enforces function execution and strictly
 * preserves the calling context (`receiver`). It robustly handles both
 * synchronous and asynchronous (`Thenable`) method results, allowing seamless
 * argument and output transformations.
 *
 * @param target - The original object containing the method.
 * @param key - The method key (string or symbol) to wrap.
 *
 * @returns A member instance governing the specified method.
 *
 * @throws `TypeError` if the targeted member is accessed and executed but is
 *   not a valid function.
 *
 * @internal
 */
export const method = (target: object, key: string | symbol): Member => {
  const cacheIn = new WeakMap<object, unknown>();
  const cacheOut = new WeakMap<object, unknown>();
  const cacheVeiled = new WeakMap<object, unknown>();
  return {
    shiftedIn: (
      shift: () => (...arguments_: unknown[]) => unknown[],
      receiver: unknown,
    ): unknown => {
      if (hasGetInvariant(target, key)) {
        return resolved(target, key, receiver);
      }
      if (isWeakKey(receiver)) {
        const cached = cacheIn.get(receiver);
        if (cached !== undefined) return cached;
      }
      const covering = (...parameters: unknown[]): unknown =>
        executed(target, key, receiver, shift()(...parameters));
      if (isWeakKey(receiver)) {
        cacheIn.set(receiver, covering);
      }
      return covering;
    },

    shiftedOut: (shift: () => (argument: unknown) => unknown, receiver: unknown): unknown => {
      if (hasGetInvariant(target, key)) {
        return resolved(target, key, receiver);
      }
      if (isWeakKey(receiver)) {
        const cached = cacheOut.get(receiver);
        if (cached !== undefined) return cached;
      }
      const covering = (...parameters: unknown[]): unknown => {
        const evaluated = executed(target, key, receiver, parameters);
        if (
          evaluated !== null &&
          (typeof evaluated === 'object' || typeof evaluated === 'function')
        ) {
          try {
            const then = (evaluated as { then?: unknown }).then;
            if (typeof then === 'function') {
              return Reflect.apply(then, evaluated, [shift()]);
            }
          } catch (error: unknown) {
            return Promise.reject(
              error instanceof Error
                ? error
                : new Error('Promise getter threw a non-Error exception', { cause: error }),
            );
          }
        }
        return shift()(evaluated);
      };
      if (isWeakKey(receiver)) {
        cacheOut.set(receiver, covering);
      }
      return covering;
    },

    value: (receiver: unknown): unknown => resolved(target, key, receiver),

    veiled: (cached: () => unknown, receiver: unknown): unknown => {
      if (hasGetInvariant(target, key)) {
        return resolved(target, key, receiver);
      }
      if (isWeakKey(receiver)) {
        const existing = cacheVeiled.get(receiver);
        if (existing !== undefined) return existing;
      }
      const covering = (..._arguments: unknown[]): unknown => cached();
      if (isWeakKey(receiver)) {
        cacheVeiled.set(receiver, covering);
      }
      return covering;
    },
  };
};

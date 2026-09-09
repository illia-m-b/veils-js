/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './Member.js';

interface Thenable {
  then(onFulfilled: (value: unknown) => unknown): unknown;
}

const isFunction = (value: unknown): value is (...arguments_: unknown[]) => unknown =>
  typeof value === 'function';

const isThenable = (value: unknown): value is Thenable =>
  value !== null &&
  (typeof value === 'object' || typeof value === 'function') &&
  'then' in value &&
  typeof value.then === 'function';

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
 * @throws A `TypeError` if the targeted member is accessed and executed but is
 *   not a valid function.
 *
 * @internal
 */
export const method = (target: object, key: string | symbol): Member => {
  const original = (receiver: unknown): unknown => Reflect.get(target, key, receiver);
  const result = (receiver: unknown, parameters: unknown[]): unknown => {
    const function_ = original(receiver);
    if (!isFunction(function_)) {
      throw new TypeError('Expected a method, but received a different type');
    }
    return Reflect.apply(function_, receiver, parameters);
  };
  return {
    shiftedIn:
      (shift: (...arguments_: unknown[]) => unknown[], receiver: unknown): unknown =>
      (...parameters: unknown[]): unknown =>
        result(receiver, shift(...parameters)),
    shiftedOut:
      (shift: (argument: unknown) => unknown, receiver: unknown): unknown =>
      (...parameters: unknown[]): unknown => {
        const evaluated = result(receiver, parameters);
        // eslint-disable-next-line unicorn/prefer-await
        return isThenable(evaluated) ? evaluated.then(shift) : shift(evaluated);
      },
    value: original,
    veiled:
      (cached: unknown): unknown =>
      (..._arguments: unknown[]): unknown =>
        cached,
  };
};

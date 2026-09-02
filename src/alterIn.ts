/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { ShiftsIn } from './ShiftsIn.js';

/**
 * Creates a wrapper around the given object that intercepts and modifies method
 * arguments.
 *
 * This decorator allows you to define transformer functions (shifts) for
 * specific methods. When a decorated method is called, its arguments are first
 * passed through the corresponding transformer. The resulting modified
 * arguments are then transparently forwarded to the original object. Any
 * methods or properties without defined shifts are passed through unmodified.
 *
 * @param object The original target object to wrap.
 * @param shifts A map of optional argument transformer functions.
 *
 * @returns A proxied version of the target object with the argument modifiers
 *   applied.
 */
export const alterIn = <T extends object>(object: T, shifts: NoInfer<ShiftsIn<T>>): T =>
  new Proxy(object, {
    get(target: T, property: string | symbol, receiver: unknown) {
      const original = Reflect.get(target, property, receiver);
      if (typeof original !== 'function' || !Object.hasOwn(shifts, property)) {
        return original;
      }
      return (..._arguments: unknown[]): unknown =>
        Reflect.apply(
          original,
          receiver,
          (shifts[property as keyof T] as (..._arguments: unknown[]) => unknown[])(..._arguments),
        );
    },
  });

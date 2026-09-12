/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './member.js';
import type { Members } from './members.js';
import type { ShiftsIn } from './shifts-in.js';

import { members } from './members.js';

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
 * @remarks
 * 1. NEVER decorate objects whose methods access ECMAScript `#private` fields or
 *    methods. Because `Proxy` traps preserve receiver context, accessing native
 *    `#private` members will throw a `TypeError`.
 * 2. If an input shift is provided for a standard data property or an accessor
 *    (getter), it is silently ignored, as these members do not accept
 *    arguments.
 *
 * @param object - The original target object to wrap.
 * @param shifts - A map of optional argument transformer functions.
 *
 * @returns A proxied version of the target object with the argument modifiers
 *   applied.
 */
export const alterIn = <T extends object>(object: T, shifts: NoInfer<ShiftsIn<T>>): T => {
  const collection: Members = members(object);
  return new Proxy(object, {
    get(_target: T, property: string | symbol, receiver: unknown) {
      const member: Member = collection.member(property);
      if (!Object.hasOwn(shifts, property)) {
        return member.value(receiver);
      }
      return member.shiftedIn(
        shifts[property as keyof T] as (..._arguments: unknown[]) => unknown[],
        receiver,
      );
    },
  });
};

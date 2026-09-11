/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { ShiftsOut } from './ShiftsOut.js';

import { Member } from './Member.js';
import { members, Members } from './members.js';

/**
 * Decorates the given object intercepting and modifying returned values.
 *
 * This decorator allows you to define transformer functions (shifts) for
 * specific properties or methods. For decorated properties, the value is passed
 * through the transformer upon access. For decorated methods, the original
 * execution completes first, and the resulting value is then passed through the
 * transformer before being returned to the caller.
 *
 * @remarks
 * NEVER decorate objects whose methods access ECMAScript `#private` fields or
 * methods. Because `Proxy` traps preserve receiver context, accessing native
 * `#private` members will throw a `TypeError`.
 *
 * @param object - The original target object to wrap.
 * @param shifts - A map of optional return value transformer functions.
 *
 * @returns A proxied version of the target object with the output modifiers
 *   applied.
 */
export const alterOut = <T extends object>(object: T, shifts: NoInfer<ShiftsOut<T>>): T => {
  const collection: Members = members(object);
  return new Proxy(object, {
    get(_target: T, property: string | symbol, receiver: unknown) {
      const member: Member = collection.member(property);
      if (!Object.hasOwn(shifts, property)) {
        return member.value(receiver);
      }
      return member.shiftedOut(
        shifts[property as keyof T] as (..._arguments: unknown[]) => unknown,
        receiver,
      );
    },
  });
};

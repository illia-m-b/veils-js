/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './Member.js';

/**
 * Creates a {@link Member} representation for a standard object property or
 * getter.
 *
 * This factory generates a member that seamlessly delegates access to the
 * underlying property via `Reflect.get`. Because data properties do not accept
 * arguments, any input transformations (`shiftedIn`) are silently ignored.
 *
 * @param target - The original object containing the property.
 * @param key - The property key (string or symbol) to wrap.
 *
 * @returns A member instance governing the specified property.
 *
 * @internal
 */
export const property = (target: object, key: string | symbol): Member => {
  const original = (receiver: unknown): unknown => Reflect.get(target, key, receiver);
  return {
    shiftedIn: (_shift: (...arguments_: unknown[]) => unknown[], receiver: unknown): unknown =>
      original(receiver),
    shiftedOut: (shift: (argument: unknown) => unknown, receiver: unknown): unknown =>
      shift(original(receiver)),
    value: (receiver: unknown): unknown => original(receiver),
    veiled: (cached: unknown): unknown => cached,
  };
};

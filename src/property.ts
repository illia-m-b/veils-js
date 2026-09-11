/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './Member.js';

import { hasGetInvariant } from './hasGetInvariant.js';

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
export const property = (target: object, key: string | symbol): Member => ({
  shiftedIn: (_shift: (...arguments_: unknown[]) => unknown[], receiver: unknown): unknown =>
    resolved(target, key, receiver),

  shiftedOut: (shift: (argument: unknown) => unknown, receiver: unknown): unknown =>
    hasGetInvariant(target, key)
      ? resolved(target, key, receiver)
      : shift(resolved(target, key, receiver)),

  value: (receiver: unknown): unknown => resolved(target, key, receiver),

  veiled: (cached: unknown, receiver: unknown): unknown =>
    hasGetInvariant(target, key) ? resolved(target, key, receiver) : cached,
});

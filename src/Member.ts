/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents a member (property or method) of an object in the proxy chain.
 *
 * @internal
 */
export interface Member {
  /**
   * Applies an input shift (for arguments) if this member is a method. For
   * regular properties, it simply returns the property value.
   *
   * @param shift - The transformer function to apply to the method's arguments.
   * @param receiver - The `this` context for evaluating the property or method.
   *
   * @returns The dynamically wrapped method or evaluated property value.
   */
  shiftedIn(shift: (...arguments_: unknown[]) => unknown[], receiver: unknown): unknown;

  /**
   * Applies an output shift (for return values) if this member is a method. For
   * regular properties, it applies the shift directly to the property value.
   *
   * @param shift - The transformer function to apply to the result.
   * @param receiver - The `this` context for evaluating the property or method.
   *
   * @returns The dynamically wrapped method or transformed property value.
   */
  shiftedOut(shift: (argument: unknown) => unknown, receiver: unknown): unknown;

  /**
   * Evaluates and returns the original value of the member.
   *
   * @param receiver - The `this` context for evaluating the property or method.
   *
   * @returns The raw, original value of the property or method.
   */
  value(receiver: unknown): unknown;

  /**
   * Returns a veiled version of the member, hiding its actual logic behind the
   * cached value.
   *
   * @param cached - The pre-calculated safe value or fallback to return instead
   *   of the real one.
   *
   * @returns The masked value or a function that returns the masked value.
   */
  veiled(cached: unknown): unknown;
}

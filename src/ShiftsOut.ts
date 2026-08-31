/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents a map of value transformer functions (shifts) for the target object's properties or methods.
 * The keys match the names of the properties or methods on the target object.
 *
 * For methods, the transformer function accepts the exact return type of the original method
 * and must return a modified value of the same type. For properties, it accepts the property's
 * value and returns a modified value of the same type.
 *
 * Note: All transformers are strictly optional; you only need to provide them for
 * the members you actually want to modify.
 */
export type ShiftsOut<T extends object> = Partial<{
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [K in keyof T]: T[K] extends (..._arguments: any[]) => infer U
    ? (_argument: U) => U
    : (_argument: T[K]) => T[K];
}>;

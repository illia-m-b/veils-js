/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents a map of argument transformer functions (shifts) for the target
 * object's methods. The keys match the names of the methods on the target
 * object. Static properties are ignored.
 *
 * The values are transformer functions that accept the exact same arguments as
 * the original method and must return an array (tuple) of the modified
 * arguments.
 *
 * Note: These transformers are used to intercept and mutate inputs before they
 * are passed to the original object. All transformers are strictly optional;
 * you only need to provide them for the methods you actually want to modify.
 */
export type ShiftsIn<T extends object> = Partial<{
  [K in keyof T]: T[K] extends (...arguments_: infer U) => unknown
    ? (...arguments_: U) => U
    : never;
}>;

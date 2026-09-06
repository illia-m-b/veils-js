/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents the cache for a veil object. The cache keys match the names of the
 * target object's properties or methods. The cache values are either the
 * property types themselves or the return types of the methods.
 *
 * @remarks
 * This is not memoization; method arguments are completely ignored. The cache
 * is entirely optional and can technically be empty.
 */
export type VeilCache<T extends object> = Partial<{
  [K in keyof T]: T[K] extends (..._arguments: never[]) => unknown ? ReturnType<T[K]> : T[K];
}>;

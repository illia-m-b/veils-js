/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { VeilCache } from './VeilCache.js';

import { cloak } from './cloak.js';
import { unpiercablePolicy } from './unpiercablePolicy.js';

/**
 * Creates an unpiercable wrapper around the given object.
 *
 * This acts as a decorator that works similarly to {@link veil}, but it can
 * never be permanently pierced. Regardless of how many times you access
 * properties that are missing from the cache, this proxy will always return a
 * cached value for subsequent accesses if the cache contains it.
 *
 * @param object - The original target object to wrap.
 * @param cache - A partial object containing pre-calculated values or method
 *   returns.
 *
 * @returns A proxied version of the target object with the unpiercable caching
 *   policy applied.
 */
export const unpiercable = <T extends object>(object: T, cache: NoInfer<VeilCache<T>>): T =>
  cloak<T>(object, cache, unpiercablePolicy());

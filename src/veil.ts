/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { VeilCache } from './VeilCache.js';

import { cloak } from './cloak.js';
import { veilPolicy } from './veilPolicy.js';

/**
 * Creates a standard, piercable wrapper around the given object.
 *
 * This decorator returns predefined values from the cache for accessed
 * properties or methods. However, the moment a property or method is accessed
 * that is _not_ in the cache, the veil is permanently pierced. All subsequent
 * accesses will bypass the cache and delegate to the original object.
 *
 * For a version that never pierces, see {@link unpiercable}.
 *
 * @param object The original target object to wrap.
 * @param cache A partial object containing pre-calculated values or method
 *   returns.
 *
 * @returns A proxied version of the target object with the standard piercing
 *   policy applied.
 */
export const veil = <T extends object>(object: T, cache: NoInfer<VeilCache<T>>): T =>
  cloak<T>(object, cache, veilPolicy());

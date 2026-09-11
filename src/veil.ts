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
 * Implicit systemic lookups by the JS engine (such as `Symbol`s, `.then`,
 * `.toString`) are safely ignored by the underlying policy and will not pierce
 * the veil.
 *
 * For a version that never pierces, see {@link unpiercable}.
 *
 * @remarks
 * NEVER decorate objects whose methods access ECMAScript `#private` fields or
 * methods. Because `Proxy` traps preserve receiver context, accessing native
 * `#private` members will throw a `TypeError`.
 *
 * @param object - The original target object to wrap.
 * @param cache - A partial object containing pre-calculated values or method
 *   returns.
 *
 * @returns A proxied version of the target object with the standard piercing
 *   policy applied.
 */
export const veil = <T extends object>(object: T, cache: NoInfer<VeilCache<T>>): T =>
  cloak<T>(object, cache, veilPolicy());

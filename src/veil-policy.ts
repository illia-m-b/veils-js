/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Policy } from './policy.js';

/**
 * A set of property keys that are implicitly accessed by the JavaScript engine,
 * Node.js environments, or ecosystem tools. Accessing these keys when they are
 * missing from the cache does not pierce the veil.
 */
const ignored = new Set<string | symbol>([
  '__proto__',
  'constructor',
  'inspect',
  'then',
  'toJSON',
  'toLocaleString',
  'toString',
  'valueOf',
]);

/**
 * @remarks
 * Missing systemic property lookups (like `.then` or `Symbol`s) are ignored and
 * do not pierce the veil.
 *
 * @returns A policy for a standard, piercable veil. If a requested property or
 *   method is not found in the cache, the veil is permanently pierced. All
 *   subsequent accesses will bypass the cache and fetch the original values,
 *   regardless of whether they were previously cached.
 */
export const veilPolicy = (): Policy => {
  let isPierced = false;
  return {
    onMutate: (property: string | symbol): void => {
      if (!(typeof property === 'symbol' || ignored.has(property))) {
        isPierced = true;
      }
    },

    verdict: (property: string | symbol, isInCache: boolean): boolean => {
      if (isInCache) {
        return !isPierced;
      }
      if (!(typeof property === 'symbol' || ignored.has(property))) {
        isPierced = true;
      }
      return false;
    },
  };
};

/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Policy } from './Policy.js';

/**
 * @returns A policy for a standard, piercable veil. If a requested property or method is not found
 * in the cache, the veil is permanently pierced. All subsequent accesses will bypass the cache
 * and fetch the original values, regardless of whether they were previously cached.
 */
export const veilPolicy = (): Policy => {
  let isPierced = false;
  return {
    verdict: (_property: string | symbol, isInCache: boolean): boolean => {
      if (!isInCache) {
        isPierced = true;
      }
      return !isPierced;
    },
  };
};

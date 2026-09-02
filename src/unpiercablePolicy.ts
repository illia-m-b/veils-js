/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Policy } from './Policy.js';

/**
 * @returns A policy for an unpiercable veil. Regardless of the accessed
 *   property or method, this policy instructs the `Proxy` to use the cached
 *   value if it exists, and only fetch the original value if it is not in the
 *   cache.
 */
export const unpiercablePolicy = (): Policy => ({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  onMutate: (_property: string | symbol): void => {},
  verdict: (_property: string | symbol, isInCache: boolean): boolean => isInCache,
});

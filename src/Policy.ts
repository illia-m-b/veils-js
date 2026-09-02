/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Represents a caching policy queried by the `cloak` mechanism. It determines
 * the rules for accessing cached values versus fetching actual properties from
 * the target object.
 */
export interface Policy {
  /** Called when a property on the target object is mutated (set). */
  onMutate(property: string | symbol): void;

  /**
   * Decides whether the `Proxy` should return a cached value or bypass the
   * cache to retrieve the actual value.
   *
   * @param property The name of the property or method being accessed.
   * @param isInCache Indicates whether a cached value for this property already
   *   exists.
   *
   * @returns `true` if the `Proxy` should use the cache, or `false` to fetch
   *   the actual value.
   */
  verdict: (property: string | symbol, isInCache: boolean) => boolean;
}

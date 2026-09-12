/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

/**
 * Checks whether a property has an enforced Proxy `[[Get]]` invariant:
 *
 * 1. Non-configurable, non-writable data descriptor (must return exact target
 *    value)
 * 2. Non-configurable accessor descriptor with no getter (must return undefined)
 */
export const hasGetInvariant = (target: object, property: string | symbol): boolean => {
  const descriptor = Object.getOwnPropertyDescriptor(target, property);
  if (descriptor?.configurable !== false) {
    return false;
  }
  return 'writable' in descriptor ? !descriptor.writable : descriptor.get === undefined;
};

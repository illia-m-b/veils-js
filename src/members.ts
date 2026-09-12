/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import type { Member } from './member.js';

import { method } from './method.js';
import { property } from './property.js';

/**
 * Represents a collection of members (properties and methods) belonging to an
 * object.
 *
 * This abstraction provides a unified way to retrieve members from an object,
 * automatically resolving them across the prototype chain. It encapsulates the
 * complexity of differentiating between standard data properties and methods.
 *
 * @internal
 */
export interface Members {
  /**
   * Retrieves a member representation for the specified property key.
   *
   * @param key - The property or method key (string or symbol).
   *
   * @returns A {@link Member} instance corresponding to the key.
   */
  member: (key: string | symbol) => Member;
}

/**
 * Recursively climbs the prototype chain to determine if a property is a
 * method.
 *
 * @param current - The current object in the prototype chain being inspected.
 * @param key - The property or method key (string or symbol).
 *
 * @returns `true` if the descriptor's value is a function, `false` otherwise.
 */
const isMethod = (current: null | object, key: string | symbol): boolean => {
  if (current === null) {
    return false;
  }
  const descriptor = Object.getOwnPropertyDescriptor(current, key);
  return descriptor
    ? typeof descriptor.value === 'function'
    : isMethod(Reflect.getPrototypeOf(current), key);
};

/**
 * Creates a {@link Members} collection for the given target object.
 *
 * This factory initializes a cache and returns an object capable of resolving
 * properties and methods along the prototype chain. By inspecting property
 * descriptors directly (`Object.getOwnPropertyDescriptor`), it safely
 * identifies methods without triggering eager execution of getters.
 *
 * @param target - The object whose members need to be resolved.
 *
 * @returns A {@link Members} collection bound to the target object.
 *
 * @internal
 */
export const members = (target: object): Members => {
  const cache = new Map<string | symbol, Member>();
  return {
    member: (key: string | symbol): Member => {
      let member = cache.get(key);
      if (!member) {
        member = isMethod(target, key) ? method(target, key) : property(target, key);
        cache.set(key, member);
      }
      return member;
    },
  };
};

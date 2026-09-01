/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Policy } from '../src/Policy.js';

import { unpiercablePolicy } from '../src/unpiercablePolicy.js';

test.for([
  [true, true],
  [false, false],
])('returns %s when isInCache is %s', ([expected, isInCache], { expect }): void => {
  const policy: Policy = unpiercablePolicy();
  const property = Symbol('property');
  expect(policy.verdict(property, isInCache)).toBe(expected);
});

test('ignores mutation and returns true for cached property', (): void => {
  const policy: Policy = unpiercablePolicy();
  const property = Symbol('property');
  const isInCache = true;
  policy.onMutate(property);
  expect(policy.verdict(property, isInCache)).toBe(true);
});

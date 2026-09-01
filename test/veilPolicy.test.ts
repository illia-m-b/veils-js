/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Policy } from '../src/Policy.js';

import { veilPolicy } from '../src/veilPolicy.js';

test('allows access to cached property when veil is intact', (): void => {
  const policy: Policy = veilPolicy();
  const property = Symbol('property');
  const isInCache = true;
  expect(policy.verdict(property, isInCache)).toBe(true);
});

test('pierces the veil when property is not in cache', (): void => {
  const policy: Policy = veilPolicy();
  const property = Symbol('property');
  const isInCache = false;
  expect(policy.verdict(property, isInCache)).toBe(false);
});

test('rejects access to cached property after veil was pierced', (): void => {
  const policy: Policy = veilPolicy();
  const missedProperty = Symbol('missed-property');
  const isMissed = false;
  policy.verdict(missedProperty, isMissed);
  const cachedProperty = Symbol('cached-property');
  const isCached = true;
  expect(policy.verdict(cachedProperty, isCached)).toBe(false);
});

test('pierces the veil when a property is mutated', (): void => {
  const policy: Policy = veilPolicy();
  const property = Symbol('property');
  const mutated = Symbol('mutated-property');
  const isInCache = true;
  policy.onMutate(mutated);
  expect(policy.verdict(property, isInCache)).toBe(false);
});

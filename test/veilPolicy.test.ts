/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Policy } from '../src/Policy.js';

import { veilPolicy } from '../src/veilPolicy.js';

test('allows access to cached property when veil is intact', (): void => {
  const policy: Policy = veilPolicy();
  const property = 'property';
  const isInCache = true;
  expect(
    policy.verdict(property, isInCache),
    'Policy denied cache access while veil is intact',
  ).toBe(true);
});

test('pierces the veil when property is not in cache', (): void => {
  const policy: Policy = veilPolicy();
  const property = 'property';
  const isInCache = false;
  expect(
    policy.verdict(property, isInCache),
    'Policy allowed access for a property missing from cache',
  ).toBe(false);
});

test('rejects access to cached property after veil was pierced', (): void => {
  const policy: Policy = veilPolicy();
  const missedProperty = 'missedProperty';
  const isMissed = false;
  policy.verdict(missedProperty, isMissed);
  const cachedProperty = 'cachedProperty';
  const isCached = true;
  expect(
    policy.verdict(cachedProperty, isCached),
    'Policy granted cache access after veil was previously pierced',
  ).toBe(false);
});

test('pierces the veil when a property is mutated', (): void => {
  const policy: Policy = veilPolicy();
  const property = 'property';
  const mutated = 'mutatedProperty';
  const isInCache = true;
  policy.onMutate(mutated);
  expect(
    policy.verdict(property, isInCache),
    'Policy granted cache access after a property was mutated',
  ).toBe(false);
});

test('ignores missing symbol lookups without piercing the veil', (): void => {
  const policy: Policy = veilPolicy();
  const symbolic = Symbol(Math.random());
  const isNotCached = false;
  policy.verdict(symbolic, isNotCached);
  const regular = 'property';
  const isCached = true;
  expect(policy.verdict(regular, isCached), 'Policy pierced the veil after a Symbol lookup').toBe(
    true,
  );
});

test.each([
  '__proto__',
  'constructor',
  'inspect',
  'then',
  'toJSON',
  'toLocaleString',
  'toString',
  'valueOf',
])('ignores implicit engine lookup "%s" without piercing the veil', (internal: string): void => {
  const policy: Policy = veilPolicy();
  const isNotCached = false;
  policy.verdict(internal, isNotCached);
  const regular = 'property';
  const isCached = true;
  expect(
    policy.verdict(regular, isCached),
    `Policy pierced the veil after an implicit engine lookup for '${internal}'`,
  ).toBe(true);
});

test('ignores symbol mutations without piercing the veil', (): void => {
  const policy: Policy = veilPolicy();
  const symbolic = Symbol(Math.random());
  policy.onMutate(symbolic);
  const regular = 'property';
  const isCached = true;
  expect(policy.verdict(regular, isCached), 'Policy pierced the veil after a Symbol mutation').toBe(
    true,
  );
});

test('ignores safe key mutations without piercing the veil', (): void => {
  const policy: Policy = veilPolicy();
  policy.onMutate('then');
  const regular = 'property';
  const isCached = true;
  expect(
    policy.verdict(regular, isCached),
    'Policy pierced the veil after an ignored key mutation',
  ).toBe(true);
});

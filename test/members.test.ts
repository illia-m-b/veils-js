/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Member } from '../src/member.js';

import { members } from '../src/members.js';

test('resolves inherited method from prototype chain as a method member', (): void => {
  const inherited = 'base';
  const base = { greeting: () => inherited };
  const derived = Object.create(base) as typeof base;
  const method = members(derived).member('greeting').value(base) as (
    ..._arguments: unknown[]
  ) => unknown;
  expect(
    method(),
    'The members factory failed to resolve the inherited method as a method member',
  ).toBe(inherited);
});

test('resolves own data property as a property member', (): void => {
  const original = Math.random();
  const maths = { number: original };
  const member: Member = members(maths).member('number');
  expect(
    member.value(maths),
    'The members factory failed to resolve the own property as a property member',
  ).toBe(original);
});

test('resolves getter on prototype as a property member without executing it', (): void => {
  const object = {
    get getter(): never {
      throw new Error('You are not allowed to execute this code!');
    },
  };
  const member: Member = members(object).member('getter');
  const cached = Math.random();
  const veiled = member.veiled(cached, object);
  expect(
    veiled,
    'The members factory eagerly executed the getter or failed to resolve it as a property member',
  ).toBe(cached);
});

test('resolves non-existent property as a property member fallback', (): void => {
  const empty = {};
  const member = members(empty).member(Symbol(Math.random()));
  expect(
    member.value(empty),
    'The members factory failed to fall back to a property member for a missing key',
  ).toBe(undefined);
});

test('reuses cached member instance on repeated access', (): void => {
  const maths = { number: Math.random() };
  const factory = members(maths);
  const first = factory.member('number');
  const second = factory.member('number');
  expect(
    first,
    'The members factory failed to return the cached member instance on subsequent access',
  ).toBe(second);
});

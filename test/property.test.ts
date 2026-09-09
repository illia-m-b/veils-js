/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import type { Member } from '../src/Member.js';

import { property } from '../src/property.js';

test('returns original value', (): void => {
  const target = 'target';
  const receiver = 'receiver';
  class Target {
    readonly _name: string = target;
    get name(): string {
      return this._name;
    }
  }
  const original = new Target();
  const member: Member = property(original, 'name');
  expect(
    [member.value(original), member.value({ _name: receiver })],
    'The property failed to preserve the receiver context when retrieving the value',
  ).toStrictEqual([target, receiver]);
});

test('ignores transformers and returns actual value', (): void => {
  const target = 'target';
  const receiver = 'receiver';
  class Target {
    readonly _name: string = target;
    get name(): string {
      return this._name;
    }
  }
  const original = new Target();
  const member: Member = property(original, 'name');
  expect(
    [member.shiftedIn(() => [], original), member.shiftedIn(() => [], { _name: receiver })],
    'The property incorrectly applied an input transformer, instead of ignoring it',
  ).toStrictEqual([target, receiver]);
});

test('applies transformer function to the actual value', (): void => {
  const target = 'target';
  const receiver = ' \r\n \t receiver   \r\n   \t  ';
  class Target {
    readonly _name: string = target;
    get name(): string {
      return this._name;
    }
  }
  const original = new Target();
  const member: Member = property(original, 'name');
  expect(
    [
      member.shiftedOut((s) => String(s).toUpperCase(), original),
      member.shiftedOut((s) => String(s).trim(), { _name: receiver }),
    ],
    'The property failed to apply the output transformer to the retrieved value',
  ).toStrictEqual([target.toUpperCase(), receiver.trim()]);
});

test('returns cached value', (): void => {
  const john = { name: 'Jonh' };
  const cached = 'Jack';
  const member: Member = property(john, 'name');
  expect(
    member.veiled(cached),
    'The property returned the actual value instead of the provided cached one',
  ).toBe(cached);
});

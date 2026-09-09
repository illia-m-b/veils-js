/*
 * SPDX-FileCopyrightText: Copyright (c) 2026 Illia Brashkin
 * SPDX-License-Identifier: MIT
 */

import { expect, test } from 'vitest';

import { Member } from '../src/Member.js';
import { method } from '../src/method.js';

test('retrieves the unbound original function', (): void => {
  const object = { description: () => 'dumb' };
  const member: Member = method(object, 'description');
  expect(
    member.value(object),
    'The method member failed to return the original unbound function',
  ).toStrictEqual(object.description);
});

test('applies input transformations to the arguments before execution', (): void => {
  class User {
    constructor(private readonly name: string) {}
    greeting(beginning: string): string {
      return `${beginning}, ${this.name}!`;
    }
  }
  const name = 'John';
  const object = new User(name);
  const member: Member = method(object, 'greeting');
  const beginning = 'Hello';
  const shifted = member.shiftedIn(
    (s: unknown): unknown[] => [(s as string).toUpperCase()],
    object,
  ) as (..._arguments: unknown[]) => unknown;
  expect(
    shifted(beginning),
    'The method member failed to apply the transformer function to the intercepted arguments',
  ).toBe(`${beginning.toUpperCase()}, ${name}!`);
});

test('applies output transformations to the synchronous result', (): void => {
  const number = Math.random();
  const transformed = number * 2;
  const object = { dumb: () => number };
  const member: Member = method(object, 'dumb');
  const shifted = member.shiftedOut((n: unknown): unknown => (n as number) * 2, object) as (
    ..._arguments: unknown[]
  ) => unknown;
  expect(
    shifted(),
    'The method member failed to apply the output transformer to the synchronous result',
  ).toBe(transformed);
});

test('applies output transformations to the asynchronous result', async (): Promise<void> => {
  const string_ = 'dumb';
  const transformed = string_.toUpperCase();
  const object = { dumb: () => Promise.resolve(string_) };
  const member: Member = method(object, 'dumb');
  const shifted = member.shiftedOut(
    (s: unknown): unknown => (s as string).toUpperCase(),
    object,
  ) as (..._arguments: unknown[]) => unknown;
  expect(
    await shifted(),
    'The method member failed to apply the output transformer to the resolved promise result',
  ).toBe(transformed);
});

test('throws an error when attempting to invoke a non-function', (): void => {
  const object = { property: 'value' };
  const member: Member = method(object, 'property');
  const shifted = member.shiftedOut(() => [], object) as (..._arguments: unknown[]) => unknown;
  expect(
    () => shifted(),
    'The method member failed to throw a TypeError when a non-function was invoked',
  ).toThrow(TypeError);
});

test('returns a function that evaluates to the provided cached value instead of executing', (): void => {
  const object = { greeting: (name: string) => `Hello, ${name}!` };
  const member: Member = method(object, 'greeting');
  const cached = 'Bye, James!';
  const veiled = member.veiled(cached) as (..._arguments: unknown[]) => unknown;
  expect(
    veiled('John'),
    'The method member failed to bypass execution and return the provided cached value',
  ).toBe(cached);
});

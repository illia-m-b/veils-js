# Veils.js

_Veil Objects to Replace DTOs, Reduce Boilerplate Code and Leverage JavaScript's
Dynamic Nature_

[![EO principles respected here](https://www.elegantobjects.org/badge.svg)](https://www.elegantobjects.org)
[![We recommend WebStorm](https://gist.githack.com/illia-m-b/6a8d5e5f48910e79b532ddbcd9b39c01/raw/webstorm.svg)](https://www.jetbrains.com/webstorm/)

[![npm version](https://img.shields.io/npm/v/veils-js)](https://www.npmjs.com/package/veils-js)
[![CI](https://img.shields.io/github/actions/workflow/status/illia-m-b/veils-js/npm.yml?branch=main&label=CI)](https://github.com/illia-m-b/veils-js/actions/workflows/npm.yml)
[![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)](https://github.com/illia-m-b/veils-js/blob/main/vitest.config.ts)
[![Zero Dependencies](https://img.shields.io/badge/Dependencies-0-brightgreen)](https://www.npmjs.com/package/veils-js?activeTab=dependencies)
[![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-22.x%20||%2024.x%20||%20>=26-3c873a)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-brightgreen.svg)](https://github.com/illia-m-b/veils/blob/main/LICENSE.txt)

[Overview](#overview) &bull;
[Installation](#installation) &bull;
[Usage](#usage) &bull;
[Use Cases](#use-case-sql-speaking-objects) &bull;
[Limitations](#limitations) &bull;
[Contributing](CONTRIBUTING.md)

> [!TIP]
> Read this blog post first: [Veil Objects to Replace DTOs][link-blog].

## Overview

In object-oriented programming, objects should represent live entities, not just
passive data holders (DTOs). The Veils.js library allows you to create smart
wrappers around your objects that cache reads until the first write, seamlessly
combining the efficiency of a DTO with the elegance of OOP.

## Installation

```bash
npm install veils-js
```

## Usage

### Supported Declarations

You can decorate object properties, getters, and any method declaration format:

```typescript
const object = {
  property: 'property',
  get getter() {},
  es6Method() {},
  anonymousFunction: function () {},
  nfe: function namedFunctionExpression() {},
  async asyncMethod() {},
};
```

> [!CAUTION]
> Because Veils.js relies on JavaScript `Proxy` objects, there are specific
> limitations regarding frozen properties, built-in objects (such as `Map` or
> `Date`), and class instances with `#private` elements. Be sure to read
> the [Limitations](#limitations) section for more details.

### Basic Veil

```typescript
import { veil } from 'veils-js';
import type { VeilCache } from 'veils-js';

const john: User = {
  name: 'John',
  hash(): string {
    // Imagine some heavy CPU work here
    return 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855';
  },
};
const cache: VeilCache<User> = { hash: 'cached-hash-value' };
const covering: User = veil(john, cache);
```

Calling the `hash()` method instantly returns the `'cached-hash-value'` string
without executing the method body. This cached value is
served until an uncached property (like `name`) is accessed or a mutation
occurs, at which point the veil is "pierced."

You can also use the `unpiercable` [decorator][link-decorator]
(do not confuse with [TypeScript decorators][link-ts-decorators]), which will
never be pierced: a very good instrument for data memoization but ignoring
arguments passed.

### Alter Output

The `alterOut` decorator lets you modify the output of object methods on the
fly:

```typescript
import { alterOut } from 'veils-js';
import type { ShiftsOut } from 'veils-js';

const john: User = { name: 'John' };
const shifts: ShiftsOut<User> = {
  name: (original: string): string => original.toUpperCase(),
};
const covering: User = alterOut(john, shifts);
```

### Alter Input

The `alterIn` decorator modifies incoming method arguments before they reach the
target object. The result of your transformer function replaces the original
arguments:

```typescript
import { alterIn } from 'veils-js';
import type { ShiftsIn } from 'veils-js';

const dude: User = {
  greet: (phrase: string, name: string): void => {
    console.log(`${phrase}, ${name}!`);
  },
};
const shifts: ShiftsIn<User> = {
  greet: (phrase: string, name: string) => [phrase.trim(), name.toUpperCase()],
};
const covering: User = alterIn(dude, shifts);
```

## Use Case: SQL-Speaking Objects

Imagine a `Project` object that fetches its
properties [directly][link-sql-objects] from a PostgreSQL database:

<!-- markdownlint-disable -->

```typescript
const project = (database: Database, identifier: number): Project => ({
  name: async (): Promise<string> => {
    const { rows } = await database.query('SELECT name FROM projects WHERE id = $1', [identifier]);
    return rows[0].name;
  },
});
```

<!-- markdownlint-restore -->

This design is elegant for single-object manipulations. However, if you execute
`SELECT * FROM projects` and map the results to `Project` instances, calling
`.name()` on each will generate redundant database requests for data you already
fetched (the N+1 query problem).

Instead of degrading your class into a dumb [DTO][link-dtos], use an
`unpiercable` veil:

```typescript
import { unpiercable } from 'veils-js';

const projects = () => ({
  fetch: async (database: Database): Promise<Project[]> => {
    const { rows } = await database.query('SELECT * FROM projects');
    return rows.map((row) =>
      unpiercable(
        project(database, row.id),
        // Pre-calculate methods with the data we already hold in memory
        { name: Promise.resolve(row.name) },
      ),
    );
  },
});
```

Now you have real, smart objects. When `project.name()` is called, it instantly
returns the cached promise without hitting the database.

## Creating Custom Veil Decorators

In fact, [`veil`][link-veil] and [`unpiercable`][link-unpiercable] are just
high-level factory functions. They both use the [`cloak`][link-cloak] function
under the hood. This function serves as the foundation for creating custom veil
decorators.

It intercepts property and method access, querying the provided policy's
`verdict` method to determine whether to serve pre-calculated values from the
cache or delegate to the original object. This mechanism implements
the [strategy pattern][link-strategy]. Any property mutations notify the policy
via its `onMutate` method before modifying the target object.

For instance, you can create an `immutableVeil` that serves values from the
cache but strictly forbids any object mutations while the veil is active.

<!-- markdownlint-disable -->

```typescript
import { cloak } from 'veils-js';
import type { Policy, VeilCache } from 'veils-js';

export const immutablePolicy = (): Policy => ({
  verdict: (_property: string | symbol, isInCache: boolean): boolean => isInCache,
  onMutate: (property: string | symbol): never => {
    // Instead of piercing the veil, we block the mutation entirely
    throw new TypeError(`Mutation of '${String(property)}' is forbidden!`);
  },
});

export const immutableVeil = <T extends object>(object: T, cache: NoInfer<VeilCache<T>>): T =>
  cloak(object, cache, immutablePolicy());
```

<!-- markdownlint-restore -->

## Limitations

### Frozen Properties

> [!CAUTION]
> The library relies on JavaScript `Proxy` objects, which must comply
> with [ECMAScript invariants][link-es-invariants]. A `Proxy` cannot alter the
> return value of a property if it is a non-configurable, non-writable own data
> property (for instance, properties on [frozen objects][link-object-freeze]).

To prevent breaking the `[[Get]]` invariant and causing a `TypeError`, all
decorators will **silently ignore** cache entries and transformer functions for
frozen properties. Accessing them will always yield the original, unaltered
value.

```typescript
import type { ShiftsOut } from 'veils-js';
import { alterOut } from 'veils-js';

const frozen = Object.freeze({ name: 'John' });
const shifts: ShiftsOut<typeof frozen> = {
  name: (original: string): string => original.toUpperCase(),
};

const covering = alterOut(frozen, shifts);

// The transformer is silently ignored to comply with Proxy invariants
covering.name; // 'John'
```

### Built-in Objects and Internal Slots

> [!CAUTION]
> The Veils.js library uses `Proxy` to wrap your objects. In
> ECMAScript, [Proxy objects do not forward internal slots][link-proxy-internal]
> (like `[[MapData]]`, `[[DateValue]]`, or `[[PromiseState]]`). As a result, you
> **cannot** use these decorators directly on most built-in objects (such as
> `Map`, `Set`, `Date`, or `Promise`).

When a method of a built-in object is executed via a Veil proxy, the receiver
(`this` context) is the Proxy itself, which lacks the required internal slot,
throwing a `TypeError`:

```typescript
import { veil } from 'veils-js';

const map = new Map();
const covering = veil(map, { size: 10 });

// TypeError: Method Map.prototype.set called on incompatible receiver
covering.set('a', 1);
```

### Private Elements

> [!CAUTION]
> All decorators are "deep", which means that internal method or property
> accesses are intercepted if there is a corresponding cache entry or
> transformer function. Due to [`Proxy` limitations][link-proxy-limitations],
> you **cannot** use these decorators on class instances if their methods access
> native [`#private` fields or methods][link-privates].

```typescript
import { alterOut } from 'veils-js';
import type { ShiftsOut } from 'veils-js';

class User {
  #name: string;

  constructor(name: string) {
    this.#name = name;
  }

  greeting(): string {
    return `Hello, ${this.#name}!`;
  }
}

const john = new User('John');
const shifts: ShiftsOut<User> = {
  greeting: (original: string): string => original.toUpperCase(),
};
const covering: User = alterOut(john, shifts);

// Calling ANY method from the proxy that accesses a `#private` field will throw
covering.greeting(); // TypeError: Cannot read private member #name
```

If possible, use alternatives such
as [TypeScript compile-time member visibility][link-ts-member-visibility] or
[closure-based encapsulation][link-closure-encapsulation] (see, for example,
our [`veilPolicy`][link-veil-policy] implementation). The following works as
expected:

```typescript
import { alterOut } from 'veils-js';
import type { ShiftsOut } from 'veils-js';

class User {
  // Uses TS `private` modifier instead of native `#`
  constructor(private readonly name: string) {}

  greeting(): string {
    return `Hello, ${this.name}!`;
  }
}

const john = new User('John');
const shifts: ShiftsOut<User> = {
  greeting: (original: string): string => original.toUpperCase(),
};
const covering: User = alterOut(john, shifts);
covering.greeting(); // 'HELLO, JOHN!'
```

Even [better][link-classes-miserable] (using plain old JavaScript objects and
closures):

```typescript
import { alterOut } from 'veils-js';
import type { ShiftsOut } from 'veils-js';

const user = (name: string): User => ({
  greeting: (): string => `Hello, ${name}!`,
});

const john: User = user('John');
const shifts: ShiftsOut<User> = {
  greeting: (original: string): string => original.toUpperCase(),
};
const covering: User = alterOut(john, shifts);
covering.greeting(); // 'HELLO, JOHN!'
```

[link-blog]: https://www.yegor256.com/2020/05/19/veil-objects.html
[link-classes-miserable]: https://x.com/yegor256/status/2010297169899913568
[link-cloak]: https://github.com/illia-m-b/veils-js/blob/main/src/cloak.ts
[link-closure-encapsulation]: https://www.crockford.com/javascript/private.html
[link-decorator]: https://refactoring.guru/design-patterns/decorator
[link-dtos]: https://www.yegor256.com/2016/07/06/data-transfer-object.html
[link-es-invariants]: https://tc39.es/ecma262/#sec-invariants-of-the-essential-internal-methods
[link-object-freeze]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/freeze
[link-privates]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Private_elements
[link-proxy-internal]: https://tc39.es/ecma262/#sec-proxy-object-internal-methods-and-internal-slots
[link-proxy-limitations]: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy#no_private_field_forwarding
[link-sql-objects]: https://www.yegor256.com/2014/12/01/orm-offensive-anti-pattern.html
[link-strategy]: https://refactoring.guru/design-patterns/strategy
[link-ts-decorators]: https://www.typescriptlang.org/docs/handbook/decorators.html
[link-ts-member-visibility]: https://www.typescriptlang.org/docs/handbook/2/classes.html#private
[link-unpiercable]: https://github.com/illia-m-b/veils-js/blob/main/src/unpiercable.ts
[link-veil]: https://github.com/illia-m-b/veils-js/blob/main/src/veil.ts
[link-veil-policy]: https://github.com/illia-m-b/veils-js/blob/main/src/veilPolicy.ts

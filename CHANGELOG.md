# Changelog

## [1.0.3](https://github.com/illia-m-b/veils-js/compare/veils-js-v1.0.2...veils-js-v1.0.3) (2026-09-15)


### Bug Fixes

* **cloak:** notify policy about mutation with `Object.definePropery` and deletion ([#187](https://github.com/illia-m-b/veils-js/issues/187)) ([e201362](https://github.com/illia-m-b/veils-js/commit/e2013623e9555d78b3245a813ea1283c9d881725))

## [1.0.2](https://github.com/illia-m-b/veils-js/compare/veils-js-v1.0.1...veils-js-v1.0.2) (2026-09-14)


### Bug Fixes

* **shifts-out:** support thenables and convert throwing then-getters to rejection ([#182](https://github.com/illia-m-b/veils-js/issues/182)) ([7432780](https://github.com/illia-m-b/veils-js/commit/743278064d42f283d3ef997155ecf92d18cda374))

## [1.0.1](https://github.com/illia-m-b/veils-js/compare/veils-js-v1.0.0...veils-js-v1.0.1) (2026-09-14)


### Bug Fixes

* evaluate cache and shift mutations dynamically in method closures ([#178](https://github.com/illia-m-b/veils-js/issues/178)) ([3a91408](https://github.com/illia-m-b/veils-js/commit/3a91408a3092d2069f068f8009d2b71e6f0c9a3c))

## [1.0.0](https://github.com/illia-m-b/veils-js/compare/veils-js-v0.1.2...veils-js-v1.0.0) (2026-09-12)


### Code Refactoring

* Transition to kebab-case filenames and clean up eslint config ([5e0996a](https://github.com/illia-m-b/veils-js/commit/5e0996adbf1f45ab9751c3da15b617a6a425f98f))

## [0.1.2](https://github.com/illia-m-b/veils-js/compare/veils-js-v0.1.1...veils-js-v0.1.2) (2026-09-11)


### Bug Fixes

This massive architectural upgrade resolves multiple critical bugs and refactors the internal caching strategy:

* Enforce ECMAScript Proxy `[[Get]]` invariants for frozen properties (resolves #125).
* Wrap getters as data properties to prevent heavy lifting on cached accesses (resolves #99).
* Ignore implicit engine lookups (e.g., `.then`, `Symbol`) to prevent async code from piercing the veil (resolves #98, #109).
* Refactor decorators (`alterIn`, `alterOut`, `cloak`) to use the new `Members` factory (resolves #106, #107, #108).
* Ensure method wrappers safely capture arguments with `..._arguments: unknown[]` (resolves #97).
* Support asynchronous (`Thenable`) method unwrapping in `alterOut` (resolves #96).
* Implement `WeakMap`-based caching to preserve referential transparency for proxy methods.

## [0.1.1](https://github.com/illia-m-b/veils-js/compare/veils-js-v0.1.0...veils-js-v0.1.1) (2026-09-08)


### Bug Fixes

* **pkg:** normalize repository URL ([#142](https://github.com/illia-m-b/veils-js/issues/142)) ([a1f6be5](https://github.com/illia-m-b/veils-js/commit/a1f6be5904472d7d368559209270c08a87523d8a))

## 0.1.0 (2026-09-07)


### Added

* `veil`: Caches method calls. The veil is "pierced" (cache invalidated) upon mutation or when accessing uncached properties.
* `unpiercable`: A strict veil that never invalidates, ideal for pure data memoization (ignoring arguments passed).
* `alterOut`: A decorator to seamlessly intercept and modify object method outputs on the fly.
* `alterIn`: A decorator to transform incoming method arguments before they reach core logic.
* `cloak`: The underlying engine for custom veils; implements the Strategy pattern through configurable `Policy` definitions (`verdict` and `onMutate`).


### Technical Highlights

* Zero dependencies.
* Fully typed.
* Deep method and property access interception via decorators.

> [!CAUTION]
> Due to native JavaScript `Proxy` limitations, decorators cannot be used on class instances whose methods access native private fields or methods (`#private`). Use closure-based encapsulation or TypeScript's `private` visibility modifier instead.

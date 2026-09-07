# Changelog

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

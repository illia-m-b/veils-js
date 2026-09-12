# Security Policy

Security is a top priority for Veils.js. We take multiple proactive measures to
ensure the integrity of the package, including CodeQL scanning, strict linting
rules, zero runtime dependencies, and cryptographic provenance.

## Supported Versions

Because Veils.js is an unfunded free and open-source project, **only the latest
version is supported** with security updates.

| Version                               | Supported          |
| ------------------------------------- | ------------------ |
| 0.1.x <!-- x-release-please-minor --> | :white_check_mark: |
| < 0.1 <!-- x-release-please-minor --> | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability in Veils.js, please report it privately
via GitHub. **Do not create public issues for security vulnerabilities.**

1. Go to the [Security tab][link-gh-security] in this repository.
2. Click **Report a vulnerability**.
3. Provide a detailed description of the issue, including steps to reproduce it.

We aim to acknowledge your report as quickly as possible, typically within 72
hours. Because this is a volunteer-driven project, patches are provided on a
best-effort basis. We ask for a 90-day responsible disclosure window before you
publish any details publicly.

### Bug Bounties

Veils.js is an unfunded open-source project maintained by volunteers. As such,
**we do not offer monetary bug bounties**. We will, however, gladly credit you
as the discoverer in the GitHub Security Advisory.

## Scope and Ecosystem Nuances

### Zero-Dependency Policy

Veils.js is strictly a **zero-dependency** package at runtime, and we are
committed to keeping it that way.

### `devDependencies` are Out of Scope

Vulnerabilities found in our `devDependencies` (e.g., via `npm audit`) are **out
of scope** for this security policy. These tools (like `esbuild`, `eslint`,
`vitest`, etc.) are used exclusively during local development and CI/CD
pipelines. They are **never** shipped or executed in the end-user's production
environment.

If you find a vulnerability in one of our `devDependencies`, please report it
directly to the maintainers of that specific package. (For instance, if
`npm audit` shows a low severity vulnerability in `esbuild`, do not report it
here). We use Renovate with strict policies to automatically keep our
development tools up to date.

## Proactive Security Measures

We employ several layers of security to protect the supply chain and codebase:

- **Provenance:** We use [npm trusted publishing via OpenID Connect][link-oidc]
  (OIDC). Every release is published directly from our GitHub Actions CI/CD
  workflow without long-lived tokens. This provides cryptographic provenance,
  allowing you to verify exactly where and how the package was built.
- **CodeQL Scanning:** We run [GitHub CodeQL][link-codeql]
  (`security-and-quality` queries) automatically on every push, pull request,
  and weekly schedule to catch vulnerabilities early.
- **Strict Package Linting:** We use
  [`npm-package-json-lint`][link-pkg-json-lint] to enforce strict
  rules for our `package.json`, ensuring security best practices (like blocking
  file/git/archive dependencies).
- [**GitHub Security Features:**][link-gh-security-features] Dependabot alerts,
  secret scanning, and security advisories are actively enabled for this
  repository.

[link-codeql]: https://codeql.github.com/
[link-gh-security]: https://github.com/illia-m-b/veils-js/security/advisories
[link-gh-security-features]: https://github.com/security
[link-oidc]: https://github.blog/changelog/2025-07-31-npm-trusted-publishing-with-oidc-is-generally-available/
[link-pkg-json-lint]: https://npmpackagejsonlint.org/

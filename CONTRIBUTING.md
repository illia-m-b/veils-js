# Contributing to Veils.js

First off, thank you for considering contributing to `veils-js`! It's people
like you that make open source such a great community.

## Reporting Bugs and Requesting Features

Before creating a new issue, please check if one already exists. If you find a
bug or have a feature request, please submit
a [bug report or feature request][link-issue].

## Local Development Setup

To set up your local development environment, follow these steps:

1. Read these [guidelines][link-guidelines].
2. [Fork][link-fork] this repository.
3. Make sure that you have the current or a supported LTS version
   of [Node][link-node] and [PNPM][link-pnpm] installed.
4. Install dependencies:

   ```bash
   pnpm install
   ```

5. Make sure that [Git hooks][link-lefthook] are installed:

   ```bash
   pnpm lefthook install
   ```

## Pull Request Process

1. Make sure that the CI pipeline is [green][link-status] (if it is not, submit
   a [bug report][link-issue]).
2. Develop your changes.
3. [Push][link-push] changes (if all pre-push hooks successfully passed).
4. Submit your [pull request][link-pr].

[link-fork]: https://docs.github.com/en/pull-requests/how-tos/work-with-forks/fork-a-repo
[link-guidelines]: https://www.yegor256.com/2014/04/15/github-guidelines.html
[link-issue]: https://docs.github.com/en/issues/tracking-your-work-with-issues/learning-about-issues/quickstart
[link-lefthook]: https://lefthook.dev/
[link-node]: https://nodejs.org/en/download
[link-pnpm]: https://pnpm.io/
[link-pr]: https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request
[link-push]: https://docs.github.com/en/get-started/using-git/pushing-commits-to-a-remote-repository
[link-status]: https://docs.github.com/en/pull-requests/reference/status-checks

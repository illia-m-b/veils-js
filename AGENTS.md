# Veils.js

Enforce these strict guidelines.

## Architecture

Treat package as Proxy-based decorator framework.
Apply Elegant Objects principles to closures and plain objects.
Use closure-based encapsulation instead of ES6 classes.
Construct plain JavaScript objects.
Keep package free of runtime dependencies.
Omit `this` keyword from library source code.
Prepend Software Package Data Exchange headers to new source files.

## Formatting

Insert blank lines exclusively between distinct blocks.
Omit blank lines inside methods, functions, tests, and workflows.
Omit step names from GitHub Actions workflow files.
Format continuous integration file names using kebab-case.
Match continuous integration job names to file names.

## Commands

Execute binary scripts using `npm exec --` command.
Run `npm run lint:ts:fix` to analyze TypeScript code.
Run `npm run format:code` to format source files.
Run `npm run types:check` to verify TypeScript typings.
Run `npm run test` to execute test suite with coverage.
Run `npm run lint:pkg` to lint `package.json`.
Run `npm run format:pkg` to sort `package.json` entries.
Pin developer dependencies using `--save-exact` flag.

## Testing

Read Angry Tests repository documentation for rules.
Apply Angry Tests philosophy.
Test only public interfaces.
Isolate every test completely from other tests.
Provide descriptive English failure messages in assertions.
Limit class usage strictly to tests verifying context binding.
Test `this` keyword behavior exclusively inside ES6 classes.

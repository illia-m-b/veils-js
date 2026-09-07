# Changelog

## 1.0.0 (2026-09-07)


### Features

* add `ShiftsIn` type definition and static tests ([#27](https://github.com/illia-m-b/veils-js/issues/27)) ([18a41b9](https://github.com/illia-m-b/veils-js/commit/18a41b978a25b61caf2b679cca787c14ed60932a))
* add `ShiftsOut` type definition and static tests ([#33](https://github.com/illia-m-b/veils-js/issues/33)) ([ae5cbb8](https://github.com/illia-m-b/veils-js/commit/ae5cbb8491fd72429c7b626d525cefa1483f2969))
* add `VeilCache` type definition and static tests ([#22](https://github.com/illia-m-b/veils-js/issues/22)) ([3df2645](https://github.com/illia-m-b/veils-js/commit/3df2645c53fd7879dcc1ea5ce4924bf087284353))
* add mutation awareness to caching policies ([#34](https://github.com/illia-m-b/veils-js/issues/34)) ([fe33996](https://github.com/illia-m-b/veils-js/commit/fe3399666d01bfa8218500f40b3100381d441d5f))
* add standard piercable `veil` factory function and tests ([#22](https://github.com/illia-m-b/veils-js/issues/22)) ([daf81e2](https://github.com/illia-m-b/veils-js/commit/daf81e24f25e99c72872f6931b708ca131b0154b))
* establish `veil` and `unpiercable`  factory functions ([#22](https://github.com/illia-m-b/veils-js/issues/22)) ([6488780](https://github.com/illia-m-b/veils-js/commit/6488780be56588fa2e3c597adcc47844a2b59944))
* expose `cloak` engine as public api and add integration tests ([#40](https://github.com/illia-m-b/veils-js/issues/40)) ([76fe7fb](https://github.com/illia-m-b/veils-js/commit/76fe7fb13446c739dd1b4108c0f5c45c016ba4f8))
* expose `cloak` engine as public api and add integration tests ([#40](https://github.com/illia-m-b/veils-js/issues/40)) ([def3208](https://github.com/illia-m-b/veils-js/commit/def3208fc1249203c5a0a5071ffa9243964bd75d))
* implement `alterIn` decorator and integration tests ([#27](https://github.com/illia-m-b/veils-js/issues/27)) ([c35b953](https://github.com/illia-m-b/veils-js/commit/c35b9532be24ebee89b27b2e261b1c9840a4f866))
* implement `alterOut` decorator and integration tests ([#33](https://github.com/illia-m-b/veils-js/issues/33)) ([bc1f878](https://github.com/illia-m-b/veils-js/commit/bc1f8785c3cea7d6e0d698d922885f4c1966dd59))
* implement `unpiercable` veil factory ([#22](https://github.com/illia-m-b/veils-js/issues/22)) ([39c8fc0](https://github.com/illia-m-b/veils-js/commit/39c8fc0f328845b7f7c025be90f78d5f3bc95fc4))
* implement internal `cloak` proxy mechanism ([#22](https://github.com/illia-m-b/veils-js/issues/22)) ([ed25e76](https://github.com/illia-m-b/veils-js/commit/ed25e7645b9ce587b2c5a7b33c6664c07c58a86a))
* intercept mutations in cloak engine and notify policies ([#34](https://github.com/illia-m-b/veils-js/issues/34)) ([0610f87](https://github.com/illia-m-b/veils-js/commit/0610f87aa4ba2a969d2c629ae8a0ecaa8ab8ea2b))
* introduce `alterIn` decorator ([#27](https://github.com/illia-m-b/veils-js/issues/27)) ([74aeccf](https://github.com/illia-m-b/veils-js/commit/74aeccfb270a49d902c71d6b00cbedc684343966))
* introduce `alterOut` decorator ([#33](https://github.com/illia-m-b/veils-js/issues/33)) ([d954e3d](https://github.com/illia-m-b/veils-js/commit/d954e3d0f2cd595c451e36750746c6f2c8c4448e))
* pierce veil after mutation ([#34](https://github.com/illia-m-b/veils-js/issues/34)) ([1a8eedb](https://github.com/illia-m-b/veils-js/commit/1a8eedb3b0280fd9897ad8900422aa31107b84f2))
* **policies:** implement a policy for a standard veil ([#18](https://github.com/illia-m-b/veils-js/issues/18)) ([e3c547a](https://github.com/illia-m-b/veils-js/commit/e3c547ad6fbc0df8e50d6355e0e1051cc0a788aa))
* **policies:** implement a policy for an unpiercable veil ([#18](https://github.com/illia-m-b/veils-js/issues/18)) ([def9416](https://github.com/illia-m-b/veils-js/commit/def941611be758c764ec6fe94fee53ecc7090d90))
* **policies:** implement policy contract ([#18](https://github.com/illia-m-b/veils-js/issues/18)) ([5633686](https://github.com/illia-m-b/veils-js/commit/5633686b2a93ee417fa90682a643d032acf64691))
* **policies:** implement veil policies ([#18](https://github.com/illia-m-b/veils-js/issues/18)) ([dd9c183](https://github.com/illia-m-b/veils-js/commit/dd9c183f3ea47e364dd9d5a9b35c7dc291a4969f))


### Bug Fixes

* **cloak:** do not notify policy when mutation fails ([#102](https://github.com/illia-m-b/veils-js/issues/102)) ([85a72fc](https://github.com/illia-m-b/veils-js/commit/85a72fc33d4fd1e85f7d8947da9d3e7081936d56))
* **cloak:** do not notify policy when mutation fails ([#102](https://github.com/illia-m-b/veils-js/issues/102)) ([a35af67](https://github.com/illia-m-b/veils-js/commit/a35af67994f2ec49edde0b5c36f0f9b35ed93b5e))
* **eslint:** integrate eslint import resolver ([#18](https://github.com/illia-m-b/veils-js/issues/18)) ([32109f0](https://github.com/illia-m-b/veils-js/commit/32109f0541ef8d0079d5d44d37d59cd6a6b9bf89))
* **pkg:** configure conditional exports for cjs and esm types ([#70](https://github.com/illia-m-b/veils-js/issues/70)) ([4064ba8](https://github.com/illia-m-b/veils-js/commit/4064ba8d277ce1335121ad0725058448eb8f6256))
* **pkg:** configure conditional exports for cjs and esm types ([#70](https://github.com/illia-m-b/veils-js/issues/70)) ([7df789a](https://github.com/illia-m-b/veils-js/commit/7df789a7697c4833390d54f000d8aff04003baca))
* preserve proxy context for internal method calls in `alterIn` and `alterOut` ([#48](https://github.com/illia-m-b/veils-js/issues/48)) ([b245fc7](https://github.com/illia-m-b/veils-js/commit/b245fc7921a37655cb84f9bb37e44ca67a5d5c0c))
* preserve proxy context for internal method calls in `alterIn` and `alterOut` ([#48](https://github.com/illia-m-b/veils-js/issues/48)) ([49274a9](https://github.com/illia-m-b/veils-js/commit/49274a9fd01b84c10958a37c363fc51b45c2d119))
* **prettier:** add consistent rules for comment line strategy ([#23](https://github.com/illia-m-b/veils-js/issues/23)) ([2ca0f09](https://github.com/illia-m-b/veils-js/commit/2ca0f097806bb749c4d60b3b6c193d31dad2da27))
* remove chore script from version control ([#6](https://github.com/illia-m-b/veils-js/issues/6)) ([16cd09c](https://github.com/illia-m-b/veils-js/commit/16cd09cf009245cd111cbc93e5783e11245bf4f0))
* remove chore script from version control ([#6](https://github.com/illia-m-b/veils-js/issues/6)) ([ce93dac](https://github.com/illia-m-b/veils-js/commit/ce93dac93e49eee2b57b35b06a050adaa9a073dd))
* **renovate:** use default commit message structure ([#57](https://github.com/illia-m-b/veils-js/issues/57)) ([3d7acd5](https://github.com/illia-m-b/veils-js/commit/3d7acd55262428e4db0b738e609cb0a45576a96a))
* **renovate:** use default commit message structure ([#57](https://github.com/illia-m-b/veils-js/issues/57)) ([55552a8](https://github.com/illia-m-b/veils-js/commit/55552a8d32358d8c9fdc3d5f361bee158b57c387))
* **tests:** resolve unchecked index access in `unpiercablePolicy` test ([#80](https://github.com/illia-m-b/veils-js/issues/80)) ([1bdf89f](https://github.com/illia-m-b/veils-js/commit/1bdf89fbdc6fd6d58481ee5af07bcc79eeda60d1))
* **vitest:** configure correct type tests execution ([#28](https://github.com/illia-m-b/veils-js/issues/28)) ([df1cadf](https://github.com/illia-m-b/veils-js/commit/df1cadfbacd286dc7eead9f848d08c3d0ca2d613))
* **vitest:** configure correct type tests execution ([#28](https://github.com/illia-m-b/veils-js/issues/28)) ([d4bfed6](https://github.com/illia-m-b/veils-js/commit/d4bfed6eb7b1dc5348b9e7e68944f6d35c61af52))

# webpack-filter-warnings-plugin
[![npm][npm]][npm-url]
[![node][node]][node-url]
[![deps][deps]][deps-url]
[![tests][tests]][tests-url]
[![coverage][cover]][cover-url]

> Allows you to hide certain warnings from webpack compilations

## Install
```bash
npm i -D webpack-filter-warnings-plugin
```

## Usage

Library supports both CommonJS and ES modules.

### Using CommonJS

```js
// webpack.config.js
const { FilterWarningsPlugin } = require('webpack-filter-warnings-plugin');

module.exports = {
  // ... rest of webpack config
  plugins: [
    new FilterWarningsPlugin({ 
      exclude: /any-warnings-matching-this-will-be-hidden/ 
    })
  ]
}
```

### Using ES modules

Library exposes special ES modules - compatible export. Use it if you are working in environment supporting those.
Notice additional '/es' suffix in import string.

```js
// webpack.config.js
import { FilterWarningsPlugin } from 'webpack-filter-warnings-plugin/es';
```

### Using with Typescript

Webpack Filter Warnings Plugin is completely written in Typescript. As such, it exposes Typescript bindings. 

Before using it, install webpack typings:

```bash
npm i --save-dev @types/webpack
```

or

```bash
yarn add --dev @types/webpack
```

Use ES imports:

```typescript
// webpack.config.ts
import { FilterWarningsPlugin } from 'webpack-filter-warnings-plugin';

```

The recommended way would be to use ES module residing in `webpack-filter-warnings-plugin/es`, though, as it exports ES6-compatible code.

## Options

Library exposes only one option: `exclude`. It may be one of `RegExp`, `String` or `Function`.

### String as `exclude` filter

When passing string as exclude parameter, phrase is converted to wildcard and matches any phrase that contains it.

```js
// webpack.config.js
module.exports = {
  // ... rest of webpack config
  plugins: [
    new FilterWarningsPlugin({ 
      exclude: 'hide me'
    })
  ]
}

```

This config will match any of `Should hide me`, `Hide me, please`, `HiDe Me` (filter is case insensitive) etc.

### Function as `exclude` filter

```js
// webpack.config.js
module.exports = {
  // ... rest of webpack config
  plugins: [
    new FilterWarningsPlugin({ 
      exclude: (input) => /.*hide.*/.test(input),
    })
  ]
}
```

## Why not use the built in stats.warningsFilter option?
Currently karma-webpack does not respect the stats.warningsFilter option. Also when excluding all warnings, webpack still says `Compiled with warnings.` when all warnings are filtered. Hopefully this plugin will no longer need to exist one day.

## Licence
MIT

[npm]: https://img.shields.io/npm/v/webpack-filter-warnings-plugin.svg
[npm-url]: https://npmjs.com/package/webpack-filter-warnings-plugin

[node]: https://img.shields.io/node/v/webpack-filter-warnings-plugin.svg
[node-url]: https://nodejs.org

[deps]: https://david-dm.org/mattlewis92/webpack-filter-warnings-plugin.svg
[deps-url]: https://david-dm.org/mattlewis92/webpack-filter-warnings-plugin

[tests]: http://img.shields.io/travis/mattlewis92/webpack-filter-warnings-plugin.svg
[tests-url]: https://travis-ci.org/mattlewis92/webpack-filter-warnings-plugin

[cover]: https://codecov.io/gh/mattlewis92/webpack-filter-warnings-plugin/branch/master/graph/badge.svg
[cover-url]: https://codecov.io/gh/mattlewis92/webpack-filter-warnings-plugin

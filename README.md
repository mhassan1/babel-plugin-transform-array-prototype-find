# babel-plugin-transform-array-prototype-find

Transforms `arr.find(predicate)` to ES5 without a polyfill

Inspired by [babel-plugin-array-includes](https://github.com/stoeffel/babel-plugin-array-includes).

## Example

**In**

```javascript
[1, 2, 3].find(v => v === 1);
[1, 2, 3]['find'](v => v === 1);
arr.find(v => v === 1);
arr['find'](v => v === 1);
```

**Out**

```javascript
[1, 2, 3].filter(v => v === 1)[0];
[1, 2, 3].filter(v => v === 1)[0];
Array.isArray(arr) ? arr.filter(v => v === 1)[0] : arr.find(v => v === 1);
Array.isArray(arr) ? arr.filter(v => v === 1)[0] : arr['find'](v => v === 1);
```

## Caveats

This is not a true replacement for `find`.
While `find` stops iterating when it finds a match, `filter` does not.
If the predicate causes side effects, do not use this plugin.

## Installation

```sh
$ npm install babel-plugin-transform-array-prototype-find
```

## Usage

### Via `.babelrc` (Recommended)

**.babelrc**

```json
{
  "plugins": ["transform-array-prototype-find"]
}
```

### Via CLI

```sh
$ babel --plugins transform-array-prototype-find script.js
```

### Via Node API

```javascript
require("@babel/core").transform("code", {
  plugins: ["transform-array-prototype-find"]
});
```

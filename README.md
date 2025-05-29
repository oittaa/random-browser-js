# random-browser-js
[![CI](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml/badge.svg)](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/oittaa/random-browser-js/main.svg)](https://results.pre-commit.ci/latest/github/oittaa/random-browser-js/main)
[![codecov](https://codecov.io/gh/oittaa/random-browser-js/branch/main/graph/badge.svg?token=U0IOMJNWDP)](https://codecov.io/gh/oittaa/random-browser-js)

This module is used for generating cryptographically strong random numbers suitable for managing data such as passwords, account authentication, security tokens, and related secrets.

In particular, this should be used in preference to the default pseudo-random number generator `Math.random()`, which is designed for modelling and simulation, not security or cryptography.

Inspired by [crypto][nodejs-crypto] from Node.js and [secrets][python-secrets] from Python.

## Example

```html
<script type="module">
import {
  choice,
  randomBits,
  randomBytes,
  randomInt,
  shuffle,
  tokenHex,
  tokenUrlsafe,
  uuidv7
} from 'https://cdn.jsdelivr.net/npm/random-browser';

const arr = ['Apple', 'Banana', 'Orange'];
console.log('Pick a random fruit from array: ' + choice(arr));
console.log('Pick a random character from string: ' + choice('ABCDEF'));
console.log('Random integer with 4 random bits (<16): ' + randomBits(4));
console.log('3 random bytes e.g. [218, 82, 127]: ' + randomBytes(3));
console.log('Random number chosen from (0, 1, 2): ' + randomInt(3));
console.log('The dice rolled: ' + randomInt(1, 7));
shuffle(arr);
console.log('Shuffled array: ' + arr);
console.log('32 character hexadecimal string from 16 random bytes: ' + tokenHex(16));
console.log('URL-safe Base64 text string from 32 random bytes: ' + tokenUrlsafe());
console.log('UUID Version 7: ' + uuidv7());
</script>
```

## Install

Use a CDN like JSDelivr:
```
https://cdn.jsdelivr.net/npm/random-browser@1.2.0
or
https://cdn.jsdelivr.net/npm/random-browser
```
Or you can download [random.js][random-js-file] from GitHub. Alternatively, you can install it via npm:
```bash
npm install random-browser
```

## Features

* No dependencies or huge compiled files.
* No configuration.
* No need to choose between entropy sources.
* Minimizing footguns is a high priority.
* Just call the functions and you're all set.

## Usage

### choice(arr)
* `arr` `<Array>` The array containing the choices.
* Returns `<Object>`

Return a randomly-chosen element from a non-empty array `arr`.
```javascript
choice(['Apple', 'Banana', 'Orange']);
choice('ABCDEF');
```

### randomBits(k)
* `k` `<integer>` Number of bits.
* Returns `<integer>`

Return a random integer `n` with `k` random bits such that <code>0 &lt;= n &lt; 2<sup>k</sup></code>. The number of bits (`k`) must be less than or equal to 48.
```javascript
randomBits(4);
```

### randomBytes(size)
* `size` `<integer>` The number of bytes to generate.
* Returns: `<Uint8Array>`

Generates cryptographically strong pseudorandom data. The `size` argument is a number indicating the number of bytes to generate.
```javascript
randomBytes(3);
```

### randomInt([min, ]max)
* `min` `<integer>` Start of random range (inclusive). Default: `0`.
* `max` `<integer>` End of random range (exclusive).
* Returns `<integer>`

Return a random integer `n` such that `min <= n < max`. The range (`max - min`) must be less than 2<sup>48</sup>. `min` and `max` must be safe integers.
```javascript
randomInt(3);
randomInt(1, 7);
```

### shuffle(arr)
* `arr` `<Array>` The array containing the values.
* Returns `<undefined>`

Shuffle the array `arr` in place.
```javascript
const arr = ['Apple', 'Banana', 'Orange'];
shuffle(arr);
console.log(arr);
```

### tokenHex([numBytes])
* `numBytes` `<integer>` The number of bytes to generate. Default: `32`.
* Returns: `<string>`

Return a random text string, in hexadecimal. The string has `numBytes` random bytes, each byte converted to two hex digits. If `numBytes` is not supplied, a reasonable default is used.
```javascript
tokenHex();
tokenHex(16);
```

### tokenUrlsafe([numBytes])
* `numBytes` `<integer>` The number of bytes to generate. Default: `32`.
* Returns: `<string>`

Return a random URL-safe text string, containing `numBytes` random bytes. The text is Base64 encoded, so on average each byte results in approximately 1.3 characters. If `numBytes` is not supplied, a reasonable default is used.
```javascript
tokenUrlsafe();
tokenUrlsafe(16);
```

### uuidv7()
* Returns: `<string>`

Return a [UUID Version 7][uuid-rfc] in the 8-4-4-4-12 canonical hexadecimal string representation.
```javascript
uuidv7();
```

[nodejs-crypto]: https://nodejs.org/api/crypto.html
[python-secrets]: https://docs.python.org/3/library/secrets.html
[random-js-file]: https://github.com/oittaa/random-browser-js/blob/main/random.js
[uuid-rfc]: https://www.rfc-editor.org/rfc/rfc9562.html#name-uuid-version-7

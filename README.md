# random-browser-js
[![CI](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml/badge.svg)](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/oittaa/random-browser-js/main.svg)](https://results.pre-commit.ci/latest/github/oittaa/random-browser-js/main)
[![codecov](https://codecov.io/gh/oittaa/random-browser-js/branch/main/graph/badge.svg?token=U0IOMJNWDP)](https://codecov.io/gh/oittaa/random-browser-js)

```html
<script type="module">
import { choice, randomBits, randomBytes, randomInt, tokenHex } from './browser.js';

console.log('choice(["Apple", "Banana", "Orange"]): ' + choice(["Apple", "Banana", "Orange"]));
console.log('randomBits(4): ' + randomBits(4));
console.log('randomBytes(3): ' + randomBytes(3));
console.log('Random number chosen from (0, 1, 2): ' + randomInt(3));
console.log('The dice rolled: ' + randomInt(1, 7));
console.log('tokenHex(16): ' + tokenHex(16));
</script>
```

## choice(arr)
* `arr` `<Array>` The array containing the choices.
* Returns `<Object>`

Return a randomly-chosen element from a non-empty array `arr`.

## randomBits(k)
* `k` `<integer>` Number of bits.
* Returns `<integer>`

Return a random integer `n` with `k` random bits such that <code>0 &lt;= n &lt; 2<sup>k</sup></code>. The number of bits (`k`) must be less than or equal to 48.

## randomBytes(size)
* `size` `<integer>` The number of bytes to generate.
* Returns: `<Uint8Array>`

Generates cryptographically strong pseudorandom data. The `size` argument is a number indicating the number of bytes to generate.

## randomInt([min, ]max)
* `min` `<integer>` Start of random range (inclusive). Default: `0`.
* `max` `<integer>` End of random range (exclusive).
* Returns `<integer>`

Return a random integer `n` such that `min <= n < max`. The range (`max - min`) must be less than 2<sup>48</sup>. `min` and `max` must be safe integers.

## tokenHex([numBytes])
* `numBytes` `<integer>` The number of bytes to generate. Default: `32`.
* Returns: `<string>`

Return a random text string, in hexadecimal. The string has `numBytes` random bytes, each byte converted to two hex digits. If `numBytes` is not supplied, a reasonable default is used.

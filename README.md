# random-browser-js
[![CI](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml/badge.svg)](https://github.com/oittaa/random-browser-js/actions/workflows/main.yml)
[![pre-commit.ci status](https://results.pre-commit.ci/badge/github/oittaa/random-browser-js/main.svg)](https://results.pre-commit.ci/latest/github/oittaa/random-browser-js/main)

```html
<script type="module">
import { choice, randomBits, randomInt, tokenHex } from './browser.js';

console.log('choice(["Apple", "Banana", "Orange"]): ' + choice(["Apple", "Banana", "Orange"]));
console.log('randomBits(4): ' + randomBits(4));
console.log('Random number chosen from (0, 1, 2): ' + randomInt(3));
console.log('The dice rolled: ' + randomInt(1, 7));
console.log('tokenHex(16): ' + tokenHex(16));
</script>
```

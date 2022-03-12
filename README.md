# random-browser-js

```
<script type="module">
import { choice, randomBits, randomInt, tokenHex } from './browser.js';

console.log('choice(["Apple", "Banana", "Orange"]): ' + choice(["Apple", "Banana", "Orange"]));
console.log('randomBits(4): ' + randomBits(4));
console.log('Random number chosen from (0, 1, 2): ' + randomInt(3));
console.log('The dice rolled: ' + randomInt(1, 7));
console.log('tokenHex(16): ' + tokenHex(16));
</script>
```

'use strict'

const BITS_MAX = 48
const DEFAULT_ENTROPY = 32
const RAND_MAX = 0xFFFF_FFFF_FFFF
const hexBytesCache = new Array(256).fill().map((element, index) => index.toString(16).padStart(2, '0'))
let lastUnixts = 0

/**
 * Return the integer quotient of the division of a by b.
 */
const intDiv = (a, b) => (a - a % b) / b

/**
 * Return a randomly-chosen element from a non-empty array.
 */
const choice = arr => arr[randomInt(arr.length)]

/**
 * Return an int with k random bits.
 */
function randomBits (k) {
  if (!Number.isInteger(k)) {
    throw new TypeError('"k" must be an integer.')
  }
  if (k < 0) {
    throw new RangeError('"k" must be non-negative.')
  }
  if (k > BITS_MAX) {
    throw new RangeError('"k" must be less than or equal to ' + BITS_MAX)
  }
  // bits / 8 and rounded up
  const numBytes = intDiv(k + 7, 8)
  return intDiv(
    randomBytes(numBytes).reduce((acc, cur) => acc * 256 + cur, 0),
    2 ** (numBytes * 8 - k))
}

/**
 * Generates cryptographically strong pseudorandom data. The size argument
 * is a number indicating the number of bytes to generate.
 */
function randomBytes (size) {
  if (Number.isInteger(size)) {
    return window.crypto.getRandomValues(new Uint8Array(size))
  }
  throw new TypeError('The argument must be an integer.')
}

/**
* Return a random integer n such that min <= n < max.
*/
function randomInt (min, max) {
  if (typeof max === 'undefined') {
    max = min
    min = 0
  }
  if (!Number.isSafeInteger(min)) {
    throw new TypeError('"min" is not a safe integer.')
  }
  if (!Number.isSafeInteger(max)) {
    throw new TypeError('"max" is not a safe integer.')
  }
  if (max <= min) {
    throw new RangeError('"max" must be greater than "min".')
  }
  const range = max - min - 1
  if (range >= RAND_MAX) {
    throw new RangeError('"max - min" must be less than or equal to ' + RAND_MAX)
  }
  if (range === 0) {
    return min
  }
  let x
  do {
    x = randomBits(range.toString(2).length)
  } while (x > range)
  return x + min
}

/**
 * Shuffle the array in place (Fisher-Yates shuffle)
 */

function shuffle (arr) {
  if (!Array.isArray(arr)) {
    throw new TypeError('The argument must be an array.')
  }
  if (arr.length > 1) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = randomInt(i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
  }
}
/**
 * Return a random text string, in hexadecimal. The string has numBytes random
 * bytes, each byte converted to two hex digits. If numBytes is not supplied,
 * a reasonable default is used.
 */
const tokenHex = (numBytes = DEFAULT_ENTROPY) =>
  Array.from(randomBytes(numBytes), byte => hexBytesCache[byte]).join('')

/**
 * Return a random URL-safe text string, containing numBytes random bytes. The
 * text is Base64 encoded, so on average each byte results in approximately
 * 1.3 characters. If numBytes is not supplied, a reasonable default is used.
 */
const tokenUrlsafe = (numBytes = DEFAULT_ENTROPY) =>
  window.btoa(String.fromCharCode(...randomBytes(numBytes)))
    .replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_')

/**
 * Return a UUID Version 7. https://www.rfc-editor.org/rfc/rfc9562.html
 */
function uuidv7 () {
  let unixts = Date.now()
  if (lastUnixts >= unixts) {
    unixts = lastUnixts + 1
  }
  lastUnixts = unixts
  const unixtsStr = unixts.toString(16).padStart(12, '0').slice(-12)
  const rand = randomBytes(10)
  rand[0] = rand[0] & 0xF | 0x70 // version
  rand[2] = rand[2] & 0x3F | 0x80 // variant
  let result = unixtsStr.slice(0, 8) + '-' + unixtsStr.slice(8) + '-'
  for (let i = 0; i < 10; i++) {
    result += hexBytesCache[rand[i]]
    if (i === 1 || i === 3) {
      result += '-'
    }
  }
  return result
}

export { choice, randomBits, randomBytes, randomInt, shuffle, tokenHex, tokenUrlsafe, uuidv7 }

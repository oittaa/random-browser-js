'use strict'

const BITS_MAX = 48
const DEFAULT_ENTROPY = 32
const RAND_MAX = 0xFFFF_FFFF_FFFF

/**
* Return the number of bits necessary to represent an unsigned integer in binary.
*/
function bitLength (n) {
  let x = 0
  while (n > 0) {
    x++
    n = intDiv(n, 2)
  }
  return x
}

/**
 * Return the integer quotient of the division of a by b.
 */
function intDiv (a, b) {
  return (a - a % b) / b
}

/**
 * Return a randomly-chosen element from a non-empty array.
 */
function choice (arr) {
  return arr[randomInt(arr.length)]
}

/**
 * Return an int with k random bits.
 */
function randomBits (k) {
  if (k < 0) {
    throw new RangeError('number of bits must be non-negative.')
  }
  if (k > BITS_MAX) {
    throw new RangeError('number of bits must be less than or equal to ' + BITS_MAX)
  }
  // bits / 8 and rounded up
  const numBytes = intDiv(k + 7, 8)
  const byteArray = randomBytes(numBytes)
  let x = 0
  for (const element of byteArray) {
    x = (x * 256) + element
  }
  // trim excess bits
  return intDiv(x, Math.pow(2, numBytes * 8 - k))
}

/**
 * Generates cryptographically strong pseudorandom data. The size argument
 * is a number indicating the number of bytes to generate.
 */
function randomBytes (size) {
  const bytes = new Uint8Array(size)
  window.crypto.getRandomValues(bytes)
  return bytes
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
    throw new Error('"min" is not a safe integer.')
  }
  if (!Number.isSafeInteger(max)) {
    throw new Error('"max" is not a safe integer.')
  }
  if (max <= min) {
    throw new RangeError('"max" must be greater than "min".')
  }
  const range = max - min
  if (!(range <= RAND_MAX)) {
    throw new RangeError('"max - min" must be less than or equal to ' + RAND_MAX)
  }
  if (range === 1) {
    return min
  }
  const k = bitLength(range)
  let x
  do {
    x = randomBits(k)
  } while (x >= range)
  return x + min
}

/**
 * Return a random text string, in hexadecimal. The string has numBytes random
 * bytes, each byte converted to two hex digits. If numBytes is not supplied,
 * a reasonable default is used.
 */
function tokenHex (numBytes) {
  if (typeof numBytes === 'undefined') {
    numBytes = DEFAULT_ENTROPY
  }
  const byteArray = randomBytes(numBytes)
  return Array.from(byteArray, function (byte) {
    return ('0' + byte.toString(16)).slice(-2)
  }).join('')
}

export { choice, randomBits, randomBytes, randomInt, tokenHex }

import { webcrypto } from 'crypto'

global.crypto = {
  getRandomValues: function (buffer) { return webcrypto.getRandomValues(buffer) }
}

let r
if (process.env.NODE_TEST_MINIFIED) {
  r = await import('./random.min.js')
} else {
  r = await import('./random.js')
}

const arr100 = Array.from(Array(100).keys())
const arrPets = ['Cat', 'Dog', 'Fish']
const maxInt = Number.MAX_SAFE_INTEGER
const minInt = Number.MIN_SAFE_INTEGER

test('choice(arr100)', () => {
  const value = r.choice(arr100)
  expect(arr100).toContain(value)
})

test('choice(arrPets)', () => {
  const value = r.choice(arrPets)
  expect(arrPets).toContain(value)
})

test('randomBits(2)', () => {
  const randomInts = []
  for (let i = 0; i < 100; i++) {
    const value = r.randomBits(2)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(4)
    randomInts.push(value)
  }
  expect(randomInts).toContain(0)
  expect(randomInts).toContain(1)
  expect(randomInts).toContain(2)
  expect(randomInts).toContain(3)
})

test('randomBits(0) -> randomBits(48)', () => {
  for (let i = 0; i <= 48; i++) {
    const value = r.randomBits(i)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(2 ** i)
  }
})

test('randomBytes(0)', () => {
  const value = r.randomBytes(0)
  expect(value.length).toBe(0)
})

test('randomBytes(8)', () => {
  const value = r.randomBytes(8)
  expect(value.length).toBe(8)
})

test('randomBytes(65536)', () => {
  const value = r.randomBytes(65536)
  expect(value.length).toBe(65536)
})

test('randomInt(3)', () => {
  const randomInts = []
  for (let i = 0; i < 100; i++) {
    const value = r.randomInt(3)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(3)
    randomInts.push(value)
  }
  expect(randomInts).toContain(0)
  expect(randomInts).toContain(1)
  expect(randomInts).toContain(2)
})

test('randomInt(1, 3)', () => {
  const randomInts = []
  for (let i = 0; i < 100; i++) {
    const value = r.randomInt(1, 3)
    expect(value).toBeGreaterThanOrEqual(1)
    expect(value).toBeLessThan(3)
    randomInts.push(value)
  }
  expect(randomInts).toContain(1)
  expect(randomInts).toContain(2)
})

test('randomInt(-10, -8)', () => {
  const randomInts = []
  for (let i = 0; i < 100; i++) {
    const value = r.randomInt(-10, -8)
    expect(value).toBeGreaterThanOrEqual(-10)
    expect(value).toBeLessThan(-8)
    randomInts.push(value)
  }
  expect(randomInts).toContain(-10)
  expect(randomInts).toContain(-9)
})

test('randomInt(0xFFFF_FFFF_FFFF)', () => {
  const value = r.randomInt(0xFFFF_FFFF_FFFF)
  expect(value).toBeGreaterThanOrEqual(0)
  expect(value).toBeLessThan(0xFFFF_FFFF_FFFF)
})

test('randomInt(minInt, minInt + 5)', () => {
  const value = r.randomInt(minInt, minInt + 5)
  expect(value).toBeGreaterThanOrEqual(minInt)
  expect(value).toBeLessThan(minInt + 5)
})

test('randomInt(maxInt - 5, maxInt)', () => {
  const value = r.randomInt(maxInt - 5, maxInt)
  expect(value).toBeGreaterThanOrEqual(maxInt - 5)
  expect(value).toBeLessThan(maxInt)
})

test('randomInt(1) -> randomInt(1000)', () => {
  for (let i = 1; i <= 1000; i++) {
    const value = r.randomInt(i)
    expect(value).toBeGreaterThanOrEqual(0)
    expect(value).toBeLessThan(i)
  }
})

test('tokenHex() collision', () => {
  let temp = ''
  for (let i = 0; i < 100; i++) {
    const value = r.tokenHex()
    expect(value.length).toBe(64)
    expect(value).not.toBe(temp)
    temp = value
  }
})

test('tokenHex() length', () => {
  for (let i = 0; i < 100; i++) {
    const value = r.tokenHex(i)
    expect(value.length).toBe(i * 2)
  }
})

describe('errors', () => {
  test.each([{}, []])('choice(%s)', (i) => {
    expect(() => r.choice([])).toThrow(RangeError)
  })

  test.each([false, true, NaN, null, {}, undefined])('choice(%s)', (i) => {
    expect(() => r.choice(i)).toThrow(TypeError)
  })

  test('randomBits(-1)', () => {
    expect(() => r.randomBits(-1)).toThrow(RangeError)
  })

  test('randomBits(49)', () => {
    expect(() => r.randomBits(49)).toThrow(RangeError)
  })

  test.each(['10', false, true, NaN, null, {}, [], undefined])('randomBits(%s)', (i) => {
    expect(() => r.randomBits(i)).toThrow(new TypeError('The "k" argument must be of type number.'))
  })

  test('randomBytes(-1)', () => {
    expect(() => r.randomBytes(-1)).toThrow(RangeError)
  })

  test.each(['10', false, true, NaN, null, {}, [], undefined])('randomBytes(%s)', (i) => {
    expect(() => r.randomBytes(i)).toThrow(new TypeError('The "size" argument must be of type number.'))
  })

  test.each([[0, 0], [1, 1], [3, 2], [-5, -5], [11, -10], [-1, 0xFFFF_FFFF_FFFF]])('randomInt(%i, %i)', (min, max) => {
    expect(() => r.randomInt(min, max)).toThrow(RangeError)
  })

  test.each([[maxInt, maxInt + 1, '"max" is not a safe integer.'], [minInt - 1, minInt, '"min" is not a safe integer.']])('randomInt(%i, %i) -> %s', (min, max, err) => {
    expect(() => r.randomInt(min, max)).toThrow(new TypeError(err))
  })

  test.each(['10', false, true, NaN, null, {}, []])('randomInt(%s)', (i) => {
    expect(() => r.randomInt(i, 100)).toThrow(new TypeError('"min" is not a safe integer.'))
    expect(() => r.randomInt(i)).toThrow(new TypeError('"max" is not a safe integer.'))
    expect(() => r.randomInt(0, i)).toThrow(new TypeError('"max" is not a safe integer.'))
  })

  test.each(['10', false, true, NaN, null, {}, []])('tokenHex(%s)', (i) => {
    expect(() => r.tokenHex(i)).toThrow(new TypeError('The "size" argument must be of type number.'))
  })
})

// Doesn't guarantee correctness, but at least the numbers are appearing in the full range.
describe('distribution', () => {
  test.each([1, 8, 65536])('randomBytes(%i)', (m) => {
    const dict = {}
    for (let i = 0; i < 1_000_000 / m; i++) {
      const bytes = r.randomBytes(m)
      for (let j = 0; j < bytes.length; j++) {
        if (bytes[j] in dict) {
          dict[bytes[j]]++
        } else {
          dict[bytes[j]] = 1
        }
      }
    }
    expect(Object.keys(dict).length).toBe(256)
    const values = Object.values(dict)
    const max = Math.max(...values)
    const min = Math.min(...values)
    expect(min / max).toBeGreaterThan(0.8)
  })

  test.each([2, 14, 15, 16, 17, 254, 255, 256, 257])('randomInt(%i)', (m) => {
    const dict = {}
    for (let i = 0; i < 100_000; i++) {
      const n = r.randomInt(m)
      if (n in dict) {
        dict[n]++
      } else {
        dict[n] = 1
      }
    }
    expect(Object.keys(dict).length).toBe(m)
    const values = Object.values(dict)
    const max = Math.max(...values)
    const min = Math.min(...values)
    expect(min / max).toBeGreaterThan(0.5)
  })

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9])('randomBits(%i)', (m) => {
    const dict = {}
    for (let i = 0; i < 100_000; i++) {
      const n = r.randomBits(m)
      if (n in dict) {
        dict[n]++
      } else {
        dict[n] = 1
      }
    }
    expect(Object.keys(dict).length).toBe(2 ** m)
    const values = Object.values(dict)
    const max = Math.max(...values)
    const min = Math.min(...values)
    expect(min / max).toBeGreaterThan(0.5)
  })

  test('randomBits(48) average', () => {
    const expected = (2 ** 48 - 1) / 2
    const rounds = 100_000
    let avg = 0
    for (let i = 0; i < rounds; i++) {
      avg += r.randomBits(48)
    }
    avg /= rounds
    expect(avg / expected).toBeCloseTo(1.0, 1)
  })
})

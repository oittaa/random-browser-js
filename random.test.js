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

const arr49 = Array.from(Array(49).keys())
const arr100 = Array.from(Array(100).keys())
const arrPets = ['Cat', 'Dog', 'Fish']
let temp = ''

test('choice(arr100)', () => {
  const value = r.choice(arr100)
  expect(arr100).toContain(value)
})

test('choice(arrPets)', () => {
  const value = r.choice(arrPets)
  expect(arrPets).toContain(value)
})

test.each(arr49)('randomBits(0) -> randomBits(48)', (i) => {
  const value = r.randomBits(i)
  expect(value).toBeGreaterThanOrEqual(0)
  expect(value).toBeLessThan(Math.pow(2, i))
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

test('randomInt(5, 10)', () => {
  const value = r.randomInt(5, 10)
  expect(value).toBeGreaterThanOrEqual(5)
  expect(value).toBeLessThan(10)
})

test('randomInt(-30, -20)', () => {
  const value = r.randomInt(-30, -20)
  expect(value).toBeGreaterThanOrEqual(-30)
  expect(value).toBeLessThan(-20)
})

test('randomInt(0xFFFF_FFFF_FFFF)', () => {
  const value = r.randomInt(0xFFFF_FFFF_FFFF)
  expect(value).toBeGreaterThanOrEqual(0)
  expect(value).toBeLessThan(0xFFFF_FFFF_FFFF)
})

test.each(arr100)('randomInt(1) -> randomInt(100)', (i) => {
  const value = r.randomInt(i + 1)
  expect(value).toBeGreaterThanOrEqual(0)
  expect(value).toBeLessThan(i + 1)
})

test.each(arr100)('tokenHex() collision', (i) => {
  const value = r.tokenHex()
  expect(value).not.toBe(temp)
  temp = value
})

test.each(arr100)('tokenHex() length', (i) => {
  const value = r.tokenHex(i)
  expect(value.length).toBe(i * 2)
})

describe('errors', () => {
  test('choice([])', () => {
    expect(() => r.choice([])).toThrow(RangeError)
  })

  test('randomBits(-1)', () => {
    expect(() => r.randomBits(-1)).toThrow(RangeError)
  })

  test('randomBits(49)', () => {
    expect(() => r.randomBits(49)).toThrow(RangeError)
  })

  test('randomBytes(-1)', () => {
    expect(() => r.randomBytes(-1)).toThrow(RangeError)
  })

  test('randomInt(-1, 0xFFFF_FFFF_FFFF)', () => {
    expect(() => r.randomInt(-1, 0xFFFF_FFFF_FFFF)).toThrow(RangeError)
  })

  test('randomInt() without safe integer', () => {
    expect(() => r.randomInt(Number.MAX_SAFE_INTEGER + 1)).toThrow(Error)
    expect(() => r.randomInt(Number.MIN_SAFE_INTEGER - 1, Number.MIN_SAFE_INTEGER)).toThrow(Error)
  })
})

// Doesn't guarantee correctness, but at least the numbers are appearing in the full range.
describe('distribution', () => {
  test.each([1, 8, 65536])('randomBytes()', (m) => {
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

  test.each([2, 14, 15, 16, 17, 254, 255, 256, 257])('randomInt()', (m) => {
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

  test.each([1, 2, 3, 4, 5, 6, 7, 8, 9])('randomBits()', (m) => {
    const dict = {}
    for (let i = 0; i < 100_000; i++) {
      const n = r.randomBits(m)
      if (n in dict) {
        dict[n]++
      } else {
        dict[n] = 1
      }
    }
    expect(Object.keys(dict).length).toBe(Math.pow(2, m))
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
    expect(avg / expected).toBeCloseTo(1.0)
  })
})

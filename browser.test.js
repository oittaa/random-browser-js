import { choice, randomBits, randomInt, tokenHex } from './browser.js';

import {randomFillSync} from 'crypto';

global.crypto = {
  getRandomValues: function(buffer) { return randomFillSync(buffer);}
};

const arr49 = Array.from(Array(49).keys());
const arr100 = Array.from(Array(100).keys());
const arrPets = ['Cat', 'Dog', 'Fish'];
let temp = '';

test('choice(arr100)', () => {
  const value = choice(arr100);
  expect(arr100).toContain(value);
});

test('choice(arrPets)', () => {
  const value = choice(arrPets);
  expect(arrPets).toContain(value);
});

test.each(arr49)('randomBits(0) -> randomBits(48)', (i) => {
  const value = randomBits(i);
  expect(value).toBeGreaterThanOrEqual(0);
  expect(value).toBeLessThan(Math.pow(2, i));
});

test('randomInt(5, 10)', () => {
  const value = randomInt(5, 10);
  expect(value).toBeGreaterThanOrEqual(5);
  expect(value).toBeLessThan(10);
});

test('randomInt(-30, -20)', () => {
  const value = randomInt(-30, -20);
  expect(value).toBeGreaterThanOrEqual(-30);
  expect(value).toBeLessThan(-20);
});

test('randomInt(0xFFFF_FFFF_FFFF)', () => {
  const value = randomInt(0xFFFF_FFFF_FFFF);
  expect(value).toBeGreaterThanOrEqual(0);
  expect(value).toBeLessThan(0xFFFF_FFFF_FFFF);
});

test.each(arr100)('randomInt(1) -> randomInt(100)', (i) => {
  const value = randomInt(i + 1);
  expect(value).toBeGreaterThanOrEqual(0);
  expect(value).toBeLessThan(i + 1);
});

test.each(arr100)('tokenHex()', (i) => {
  const value = tokenHex();
  expect(value).not.toBe(temp);
  temp = value;
});

test.each(arr100)('tokenHex() length', (i) => {
  const value = tokenHex(i);
  expect(value.length).toBe(i*2);
});

test('choice([])', () => {
  expect(() => choice([])).toThrow(RangeError);
});

test('randomBits(-1)', () => {
  expect(() => randomBits(-1)).toThrow(RangeError);
});

test('randomBits(49)', () => {
  expect(() => randomBits(49)).toThrow(RangeError);
});

test('randomInt(-1, 0xFFFF_FFFF_FFFF)', () => {
  expect(() => randomInt(-1, 0xFFFF_FFFF_FFFF)).toThrow(RangeError);
});

test('randomInt() without safe integer', () => {
  expect(() => randomInt(Number.MAX_SAFE_INTEGER + 1)).toThrow(Error);
  expect(() => randomInt(Number.MIN_SAFE_INTEGER - 1, Number.MIN_SAFE_INTEGER)).toThrow(Error);
});

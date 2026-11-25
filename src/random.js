/** Uniform random integer in [min, max] from crypto.getRandomValues (no modulo bias). */
export function randomInt(min, max) {
  const range = max - min + 1;
  const limit = Math.floor(0x100000000 / range) * range;
  const value = new Uint32Array(1);
  do {
    globalThis.crypto.getRandomValues(value);
  } while (value[0] >= limit);
  return min + (value[0] % range);
}

export function randomDigits(length) {
  return Array.from({ length }, () => String(randomInt(0, 9))).join("");
}

export function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

/** Removes spaces and dashes; accepts any value and returns a string. */
export function clean(input) {
  return String(input ?? "").replace(/[\s-]/g, "");
}

export function weightedSum(digits, weights) {
  let sum = 0;
  for (let index = 0; index < weights.length; index++) sum += Number(digits[index]) * weights[index];
  return sum;
}

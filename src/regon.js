// REGON: Polish business registry number, 9 digits (entity) or 14 digits (local unit).
import { clean, randomDigits, randomInt, weightedSum } from "./random.js";

const WEIGHTS_9 = [8, 9, 2, 3, 4, 5, 6, 7];
const WEIGHTS_14 = [2, 4, 8, 5, 0, 9, 7, 3, 6, 1, 2, 4, 8];

function check(digits, weights) {
  const remainder = weightedSum(digits, weights) % 11;
  return remainder === 10 ? 0 : remainder;
}

/** Validates a 9- or 14-digit REGON. A 14-digit REGON must also start with a valid 9-digit one. */
export function isValidRegon(input) {
  const value = clean(input);
  if (/^\d{9}$/.test(value)) return check(value, WEIGHTS_9) === Number(value[8]);
  if (/^\d{14}$/.test(value)) {
    return check(value, WEIGHTS_9) === Number(value[8]) && check(value, WEIGHTS_14) === Number(value[13]);
  }
  return false;
}

/** options.length - 9 (default) or 14. */
export function generateRegon(options = {}) {
  const length = options.length ?? 9;
  if (length !== 9 && length !== 14) throw new RangeError("REGON length must be 9 or 14");
  const firstEight = String(randomInt(1, 99)).padStart(2, "0") + randomDigits(6);
  const regon9 = firstEight + check(firstEight, WEIGHTS_9);
  if (length === 9) return regon9;
  const firstThirteen = regon9 + randomDigits(4);
  return firstThirteen + check(firstThirteen, WEIGHTS_14);
}

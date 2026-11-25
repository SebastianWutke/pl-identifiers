// Polish ID card number (dowód osobisty): 3 letters + 6 digits, the first digit is the check digit.
// Letters count as A=10 ... Z=35; weighted sum with 7,3,1,9,7,3,1,7,3 must be divisible by 10.
import { clean, randomDigits, randomInt } from "./random.js";

const WEIGHTS = [7, 3, 1, 9, 7, 3, 1, 7, 3];

function charValue(char) {
  return /\d/.test(char) ? Number(char) : char.charCodeAt(0) - 55;
}

/** Accepts "ABA300000" or "ABA 300000" (case-insensitive). */
export function isValidIdCard(input) {
  const value = clean(input).toUpperCase();
  if (!/^[A-Z]{3}\d{6}$/.test(value)) return false;
  const sum = [...value].reduce((total, char, index) => total + charValue(char) * WEIGHTS[index], 0);
  return sum % 10 === 0;
}

/** options.separator - string between letters and digits (default " "). */
export function generateIdCard(options = {}) {
  const letters = Array.from({ length: 3 }, () => String.fromCharCode(65 + randomInt(0, 25))).join("");
  const lastFive = randomDigits(5);
  // Weight 9 = -1 (mod 10), so the check digit equals the weighted sum of the other characters mod 10.
  const values = [...letters].map(charValue).concat([0], [...lastFive].map(Number));
  const check = values.reduce((total, value, index) => total + value * WEIGHTS[index], 0) % 10;
  return letters + (options.separator ?? " ") + check + lastFive;
}

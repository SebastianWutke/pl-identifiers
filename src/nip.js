// NIP: Polish tax identification number, 10 digits, check digit = weighted sum mod 11 (10 is never issued).
import { clean, pick, randomDigits, weightedSum } from "./random.js";

const WEIGHTS = [6, 5, 7, 2, 3, 4, 5, 6, 7];
// Prefixes of real tax offices, so generated numbers look realistic.
const TAX_OFFICE_CODES = ["101", "102", "113", "526", "701", "894", "951"];

/** Accepts "1234563218", "123-456-32-18", "PL1234563218". */
export function isValidNip(input) {
  const value = clean(input).replace(/^PL/i, "");
  if (!/^\d{10}$/.test(value)) return false;
  const remainder = weightedSum(value, WEIGHTS) % 11;
  return remainder !== 10 && remainder === Number(value[9]);
}

export function generateNip() {
  for (;;) {
    const firstNine = pick(TAX_OFFICE_CODES) + randomDigits(6);
    const check = weightedSum(firstNine, WEIGHTS) % 11;
    if (check !== 10) return firstNine + String(check);
  }
}

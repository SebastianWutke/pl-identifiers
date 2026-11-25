// NRB (Polish bank account number, 26 digits) and Polish IBAN (PL + NRB), ISO 13616 mod 97 check.
import { clean, pick, randomDigits } from "./random.js";

// Sort codes of real Polish banks, so generated numbers look realistic.
const BANK_CODES = ["10200003", "11402004", "10901014", "10501070", "12401037", "24900005"];
const PL_DIGITS = "2521"; // P=25, L=21

function mod97(digits) {
  let remainder = 0;
  for (const digit of digits) remainder = (remainder * 10 + Number(digit)) % 97;
  return remainder;
}

/** Validates a 26-digit NRB, with or without spaces and an optional "PL" prefix. */
export function isValidNrb(input) {
  const value = clean(input).replace(/^PL/i, "");
  if (!/^\d{26}$/.test(value)) return false;
  return mod97(value.slice(2) + PL_DIGITS + value.slice(0, 2)) === 1;
}

/** Validates a Polish IBAN: "PL" followed by a valid NRB. */
export function isValidIban(input) {
  const value = clean(input);
  return /^PL\d{26}$/i.test(value) && isValidNrb(value);
}

/** Groups an NRB/IBAN for display: "PL61 1090 1014 0000 0712 1981 2874" or "61 1090 ...". */
export function formatIban(input) {
  const value = clean(input).toUpperCase();
  const prefix = value.startsWith("PL") ? "PL" : "";
  const digits = value.slice(prefix.length);
  if (prefix) return (prefix + digits).match(/.{1,4}/g).join(" ");
  return [digits.slice(0, 2), ...(digits.slice(2).match(/.{1,4}/g) || [])].join(" ");
}

/** Generates a valid 26-digit NRB. options.formatted - group digits with spaces. */
export function generateNrb(options = {}) {
  const bban = pick(BANK_CODES) + randomDigits(16);
  const check = String(98 - mod97(bban + PL_DIGITS + "00")).padStart(2, "0");
  const nrb = check + bban;
  return options.formatted ? formatIban(nrb) : nrb;
}

/** Generates a valid Polish IBAN ("PL" + NRB). options.formatted - group in blocks of 4. */
export function generateIban(options = {}) {
  const iban = "PL" + generateNrb();
  return options.formatted ? formatIban(iban) : iban;
}

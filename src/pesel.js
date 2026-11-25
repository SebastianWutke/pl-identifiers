// PESEL structure: art. 15 sec. 2 of the Polish Act of 24 September 2010 on population records.
// The century is encoded in the month field (+80 for 1800s, +0 for 1900s, +20 for 2000s).
import { clean, randomInt, weightedSum } from "./random.js";

const WEIGHTS = [1, 3, 7, 9, 1, 3, 7, 9, 1, 3];
const CENTURIES = [
  { offset: 80, firstYear: 1800 },
  { offset: 0, firstYear: 1900 },
  { offset: 20, firstYear: 2000 }
];
const DAY_MS = 86400000;
const MIN_DATE = Date.UTC(1800, 0, 1);

function checkDigit(firstTen) {
  return (10 - (weightedSum(firstTen, WEIGHTS) % 10)) % 10;
}

function todayUtc() {
  const now = new Date();
  return new Date(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()));
}

function toUtcDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) throw new TypeError("Invalid date");
  return date;
}

/**
 * Validates a PESEL and decodes birth date and gender.
 * reason: "format" | "month" | "date" | "future" | "checksum" | null (valid).
 */
export function decodePesel(input, options = {}) {
  const value = clean(input);
  const result = { valid: false, reason: "format", value };
  if (!/^\d{11}$/.test(value)) return result;

  const encodedMonth = Number(value.slice(2, 4));
  const century = CENTURIES.find(item => encodedMonth >= item.offset + 1 && encodedMonth <= item.offset + 12);
  result.gender = Number(value[9]) % 2 === 1 ? "male" : "female";
  if (!century) return Object.assign(result, { reason: "month" });

  const year = century.firstYear + Number(value.slice(0, 2));
  const month = encodedMonth - century.offset;
  const day = Number(value.slice(4, 6));
  const birthDate = new Date(Date.UTC(year, month - 1, day));
  if (birthDate.getUTCMonth() !== month - 1 || birthDate.getUTCDate() !== day) {
    return Object.assign(result, { reason: "date" });
  }
  result.birthDate = birthDate;

  const today = options.today ? toUtcDate(options.today) : todayUtc();
  if (options.allowFuture !== true && birthDate.getTime() > today.getTime()) return Object.assign(result, { reason: "future" });
  if (checkDigit(value.slice(0, 10)) !== Number(value[10])) return Object.assign(result, { reason: "checksum" });
  return Object.assign(result, { valid: true, reason: null });
}

export function isValidPesel(input, options) {
  return decodePesel(input, options).valid;
}

/**
 * Generates a valid PESEL.
 * options.birthDate - exact date (Date or ISO string); otherwise random between options.from and options.to
 * (defaults: 1800-01-01 and today). options.gender - "male" | "female" (random when omitted).
 */
export function generatePesel(options = {}) {
  let date;
  if (options.birthDate !== undefined) {
    date = toUtcDate(options.birthDate);
  } else {
    const from = options.from !== undefined ? toUtcDate(options.from).getTime() : MIN_DATE;
    const to = options.to !== undefined ? toUtcDate(options.to).getTime() : todayUtc().getTime();
    if (from > to) throw new RangeError("'from' must not be after 'to'");
    date = new Date(from + randomInt(0, Math.floor((to - from) / DAY_MS)) * DAY_MS);
  }

  const year = date.getUTCFullYear();
  const century = CENTURIES.find(item => year >= item.firstYear && year < item.firstYear + 100);
  if (!century) throw new RangeError("PESEL supports years 1800-2099");
  const month = date.getUTCMonth() + 1 + century.offset;
  const datePart = String(year % 100).padStart(2, "0") + String(month).padStart(2, "0") + String(date.getUTCDate()).padStart(2, "0");

  const gender = options.gender;
  if (gender !== undefined && gender !== "male" && gender !== "female") throw new TypeError("gender must be 'male' or 'female'");
  const parity = gender === "male" ? 1 : gender === "female" ? 0 : randomInt(0, 1);
  const firstTen = datePart + String(randomInt(0, 999)).padStart(3, "0") + String(randomInt(0, 4) * 2 + parity);
  return firstTen + checkDigit(firstTen);
}

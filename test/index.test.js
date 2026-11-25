import { test } from "node:test";
import assert from "node:assert/strict";
import {
  decodePesel, isValidPesel, generatePesel,
  isValidNip, generateNip,
  isValidRegon, generateRegon,
  isValidNrb, isValidIban, formatIban, generateNrb, generateIban,
  isValidIdCard, generateIdCard
} from "../src/index.js";

const RUNS = 2000;

test("PESEL: known numbers", () => {
  const result = decodePesel("44051401359");
  assert.equal(result.valid, true);
  assert.equal(result.gender, "male");
  assert.equal(result.birthDate.toISOString().slice(0, 10), "1944-05-14");

  const result2000s = decodePesel("02270803624");
  assert.equal(result2000s.valid, true);
  assert.equal(result2000s.gender, "female");
  assert.equal(result2000s.birthDate.toISOString().slice(0, 10), "2002-07-08");

  assert.equal(isValidPesel("440 514 013-59"), true);
});

test("PESEL: invalid numbers report a reason", () => {
  assert.equal(decodePesel("44051401358").reason, "checksum");
  assert.equal(decodePesel("4405140135").reason, "format");
  assert.equal(decodePesel("abc").reason, "format");
  assert.equal(decodePesel(null).reason, "format");
  assert.equal(decodePesel("44150101359").reason, "month");
  assert.equal(decodePesel("01023012345").reason, "date"); // 30 February
  assert.equal(decodePesel("44051401359", { today: "1944-05-13" }).reason, "future");
  assert.equal(isValidPesel("44051401359", { today: "1944-05-13", allowFuture: true }), true);
});

test("PESEL: generator", () => {
  for (let index = 0; index < RUNS; index++) assert.equal(isValidPesel(generatePesel()), true);

  const exact = decodePesel(generatePesel({ birthDate: "1985-03-07", gender: "female" }));
  assert.equal(exact.valid, true);
  assert.equal(exact.gender, "female");
  assert.equal(exact.birthDate.toISOString().slice(0, 10), "1985-03-07");

  for (const birthDate of ["1800-01-01", "1899-12-31", "2000-02-29"]) {
    const decoded = decodePesel(generatePesel({ birthDate, gender: "male" }), { allowFuture: true });
    assert.equal(decoded.valid, true);
    assert.equal(decoded.gender, "male");
    assert.equal(decoded.birthDate.toISOString().slice(0, 10), birthDate);
  }

  const ranged = decodePesel(generatePesel({ from: "1990-01-01", to: "1990-12-31" }));
  assert.equal(ranged.birthDate.getUTCFullYear(), 1990);

  assert.throws(() => generatePesel({ birthDate: "1799-12-31" }), RangeError);
  assert.throws(() => generatePesel({ birthDate: "2100-01-01" }), RangeError);
  assert.throws(() => generatePesel({ from: "2000-01-01", to: "1999-01-01" }), RangeError);
  assert.throws(() => generatePesel({ gender: "x" }), TypeError);
});

test("NIP", () => {
  assert.equal(isValidNip("1234563218"), true);
  assert.equal(isValidNip("123-456-32-18"), true);
  assert.equal(isValidNip("PL1234563218"), true);
  assert.equal(isValidNip("1234563219"), false);
  assert.equal(isValidNip("123456321"), false);
  for (let index = 0; index < RUNS; index++) assert.equal(isValidNip(generateNip()), true);
});

test("REGON", () => {
  assert.equal(isValidRegon("123456785"), true);
  assert.equal(isValidRegon("123456786"), false);
  assert.equal(isValidRegon("12345678512347"), true);
  assert.equal(isValidRegon("12345678512348"), false);
  assert.equal(isValidRegon("12345678612347"), false); // invalid 9-digit base
  assert.equal(isValidRegon("1234567"), false);
  for (let index = 0; index < RUNS; index++) {
    assert.equal(generateRegon().length, 9);
    assert.equal(isValidRegon(generateRegon()), true);
    const long = generateRegon({ length: 14 });
    assert.equal(long.length, 14);
    assert.equal(isValidRegon(long), true);
  }
  assert.throws(() => generateRegon({ length: 10 }), RangeError);
});

test("NRB / IBAN", () => {
  assert.equal(isValidNrb("61109010140000071219812874"), true);
  assert.equal(isValidNrb("61 1090 1014 0000 0712 1981 2874"), true);
  assert.equal(isValidNrb("62109010140000071219812874"), false);
  assert.equal(isValidIban("PL61109010140000071219812874"), true);
  assert.equal(isValidIban("PL61 1090 1014 0000 0712 1981 2874"), true);
  assert.equal(isValidIban("61109010140000071219812874"), false);
  assert.equal(isValidIban("DE61109010140000071219812874"), false);

  assert.equal(formatIban("PL61109010140000071219812874"), "PL61 1090 1014 0000 0712 1981 2874");
  assert.equal(formatIban("61109010140000071219812874"), "61 1090 1014 0000 0712 1981 2874");

  for (let index = 0; index < RUNS; index++) {
    const nrb = generateNrb();
    assert.match(nrb, /^\d{26}$/);
    assert.equal(isValidNrb(nrb), true);
    assert.equal(isValidIban(generateIban()), true);
    assert.equal(isValidIban(generateIban({ formatted: true })), true);
    assert.equal(isValidNrb(generateNrb({ formatted: true })), true);
  }
});

test("ID card", () => {
  assert.equal(isValidIdCard("ABA300000"), true);
  assert.equal(isValidIdCard("aba 300000"), true);
  assert.equal(isValidIdCard("ABA300001"), false);
  assert.equal(isValidIdCard("AB3000000"), false);
  for (let index = 0; index < RUNS; index++) assert.equal(isValidIdCard(generateIdCard()), true);
  assert.match(generateIdCard({ separator: "" }), /^[A-Z]{3}\d{6}$/);
});

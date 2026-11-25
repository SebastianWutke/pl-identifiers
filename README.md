# pl-identifiers

Generate and validate Polish identifiers: **PESEL, NIP, REGON, IBAN/NRB and ID card numbers** (dowód osobisty).

- One package for all five numbers
- Zero dependencies, plain ES modules, no build step
- TypeScript types included
- Random values come from `crypto.getRandomValues` (no `Math.random`)
- Works in Node.js 20+ and modern browsers

[Polska wersja README](https://github.com/SebastianWutke/pl-identifiers/blob/main/docs/README.pl.md)

> Need numbers without writing code? The same logic runs in the free online
> **[Test data generator](https://wusebox.com/test-data-generator/)** and
> **[PESEL generator](https://wusebox.com/pesel-generator/)** on WuseBox.

Walkthrough with examples and the NIP remainder-10 pitfall: [Open-Source npm Package for Polish PESEL, NIP and REGON Numbers](https://wusebox.com/en/blog/open-source-npm-package-for-polish-pesel-nip-and-regon/).

## Install

```bash
npm install pl-identifiers
```

## Usage

```js
import {
  isValidPesel, decodePesel, generatePesel,
  isValidNip, generateNip,
  isValidRegon, generateRegon,
  isValidIban, isValidNrb, generateIban, generateNrb, formatIban,
  isValidIdCard, generateIdCard
} from "pl-identifiers";

isValidPesel("44051401359");          // true
isValidNip("123-456-32-18");          // true
isValidRegon("123456785");            // true
isValidIban("PL61 1090 1014 0000 0712 1981 2874"); // true
isValidIdCard("ABA 300000");          // true

generatePesel({ birthDate: "1990-05-14", gender: "female" }); // e.g. "90051437627"
generateNip();                        // e.g. "5260250995"
generateRegon({ length: 14 });        // e.g. "12345678512347"
generateIban({ formatted: true });    // e.g. "PL61 1090 1014 0000 0712 1981 2874"
generateIdCard();                     // e.g. "ABA 300000"
```

All validators ignore spaces and dashes and accept any input type. They return `false` and never throw.

## API

### PESEL

**`decodePesel(input, options?)`** returns the validation result and the decoded data:

```js
decodePesel("44051401359");
// {
//   valid: true,
//   reason: null,
//   value: "44051401359",
//   gender: "male",
//   birthDate: 1944-05-14T00:00:00.000Z
// }
```

`reason` explains why a number is invalid:

| reason       | meaning                                        |
|--------------|------------------------------------------------|
| `"format"`   | not 11 digits                                  |
| `"month"`    | month field does not encode a century 1800-2099 |
| `"date"`     | the day does not exist (e.g. 30 February)      |
| `"future"`   | birth date is after `options.today`            |
| `"checksum"` | wrong check digit                              |

Options: `today` (reference date, default today) and `allowFuture` (default `false`).

**`isValidPesel(input, options?)`** is a shortcut for `decodePesel(...).valid`.

**`generatePesel(options?)`** returns a valid PESEL.

| option      | default      | description                          |
|-------------|--------------|--------------------------------------|
| `birthDate` | random       | exact birth date (`Date` or ISO string) |
| `from`      | `1800-01-01` | earliest random birth date           |
| `to`        | today        | latest random birth date             |
| `gender`    | random       | `"male"` or `"female"`               |

Throws `RangeError` for years outside 1800-2099.

### NIP

- `isValidNip(input)` accepts `1234563218`, `123-456-32-18` and `PL1234563218`.
- `generateNip()` uses prefixes of real tax offices.

### REGON

- `isValidRegon(input)` validates 9- and 14-digit numbers. A 14-digit REGON must also start with a valid 9-digit one.
- `generateRegon({ length: 9 | 14 })`. The default length is 9.

### IBAN / NRB

- `isValidNrb(input)` validates a 26-digit Polish account number. A `PL` prefix is optional.
- `isValidIban(input)` validates `PL` + 26 digits.
- `generateNrb({ formatted })` and `generateIban({ formatted })` use sort codes of real Polish banks.
- `formatIban(input)` returns `"PL61 1090 1014 0000 0712 1981 2874"` or `"61 1090 1014 ..."`.

### ID card (dowód osobisty)

- `isValidIdCard(input)` takes 3 letters and 6 digits, case-insensitive, with or without a space.
- `generateIdCard({ separator })` puts `" "` between the letters and digits by default.

## Generated numbers are for testing only

Generated numbers have correct checksums but are random. They may match a real person's or company's number by chance. Use them only in test environments, and never as real personal data.

## License

MIT © [Sebastian Wutke](https://wusebox.com). Part of [WuseBox](https://wusebox.com), free browser-based tools for developers and testers.

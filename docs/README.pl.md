# pl-identifiers

Generowanie i walidacja polskich numerów: **PESEL, NIP, REGON, IBAN/NRB i numer dowodu osobistego**.

- Jeden pakiet na pięć numerów
- Bez zależności, zwykłe moduły ES, bez kroku budowania
- Typy TypeScript w zestawie
- Losowanie przez `crypto.getRandomValues` (nie `Math.random`)
- Działa w Node.js 20+ i w nowoczesnych przeglądarkach

[English README](../README.md)

> Potrzebujesz numerów bez pisania kodu? Ta sama logika działa w darmowym
> **[Generatorze danych testowych](https://wusebox.com/generator-danych-testowych/)**
> i **[Generatorze PESEL](https://wusebox.com/generator-pesel/)** na WuseBox.

## Instalacja

```bash
npm install pl-identifiers
```

## Użycie

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

generatePesel({ birthDate: "1990-05-14", gender: "female" });
generateNip();
generateRegon({ length: 14 });
generateIban({ formatted: true });
generateIdCard();
```

Walidatory ignorują spacje i myślniki i przyjmują dane dowolnego typu. Zwracają `false` i nigdy nie rzucają wyjątku.

## PESEL

`decodePesel(numer)` zwraca `valid`, `gender` (`"male"` albo `"female"`) i `birthDate`. Dla niepoprawnego numeru zwraca też `reason`, czyli powód odrzucenia:

| reason       | znaczenie                                        |
|--------------|--------------------------------------------------|
| `"format"`   | to nie jest 11 cyfr                              |
| `"month"`    | miesiąc nie koduje stulecia z zakresu 1800-2099  |
| `"date"`     | taki dzień nie istnieje (np. 30 lutego)          |
| `"future"`   | data urodzenia jest w przyszłości                |
| `"checksum"` | błędna cyfra kontrolna                           |

`generatePesel()` przyjmuje opcje `birthDate` (dokładna data), `from` i `to` (zakres losowania, domyślnie od 1800-01-01 do dziś) oraz `gender`.

## Pozostałe numery

- **NIP**: `isValidNip()` akceptuje też prefiks `PL` i myślniki. `generateNip()` używa prefiksów prawdziwych urzędów skarbowych.
- **REGON**: obsługiwane są 9 i 14 cyfr. 14-cyfrowy REGON musi zaczynać się od poprawnego 9-cyfrowego.
- **IBAN/NRB**: `isValidNrb()` sprawdza 26 cyfr, `isValidIban()` sprawdza `PL` i 26 cyfr. Generator używa numerów rozliczeniowych prawdziwych banków.
- **Dowód osobisty**: 3 litery i 6 cyfr, pierwsza cyfra jest kontrolna.

## Tylko do testów

Wygenerowane numery mają poprawne sumy kontrolne, ale są losowe. Mogą przypadkiem pokrywać się z numerem prawdziwej osoby lub firmy. Używaj ich wyłącznie w środowiskach testowych, nigdy jako prawdziwych danych osobowych.

## Licencja

MIT © [Sebastian Wutke](https://wusebox.com). Część [WuseBox](https://wusebox.com), darmowych narzędzi online dla programistów i testerów.

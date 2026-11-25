export type Gender = "male" | "female";
export type DateInput = Date | string | number;

export interface PeselResult {
  valid: boolean;
  /** Why the number is invalid; null when valid. */
  reason: "format" | "month" | "date" | "future" | "checksum" | null;
  /** Input without spaces and dashes. */
  value: string;
  gender?: Gender;
  /** Birth date at UTC midnight (present when the date part is correct). */
  birthDate?: Date;
}

export interface PeselValidationOptions {
  /** Reference date for the "future" check. Default: today. */
  today?: DateInput;
  /** Accept birth dates after `today`. Default: false. */
  allowFuture?: boolean;
}

export interface PeselGenerationOptions {
  /** Exact birth date. Overrides `from` / `to`. */
  birthDate?: DateInput;
  /** Earliest random birth date. Default: 1800-01-01. */
  from?: DateInput;
  /** Latest random birth date. Default: today. */
  to?: DateInput;
  /** Random when omitted. */
  gender?: Gender;
}

export function decodePesel(input: unknown, options?: PeselValidationOptions): PeselResult;
export function isValidPesel(input: unknown, options?: PeselValidationOptions): boolean;
export function generatePesel(options?: PeselGenerationOptions): string;

export function isValidNip(input: unknown): boolean;
export function generateNip(): string;

export function isValidRegon(input: unknown): boolean;
export function generateRegon(options?: { length?: 9 | 14 }): string;

export function isValidNrb(input: unknown): boolean;
export function isValidIban(input: unknown): boolean;
export function formatIban(input: string): string;
export function generateNrb(options?: { formatted?: boolean }): string;
export function generateIban(options?: { formatted?: boolean }): string;

export function isValidIdCard(input: unknown): boolean;
export function generateIdCard(options?: { separator?: string }): string;

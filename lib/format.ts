/** Return the value as-is with Latin (English) numerals, e.g. 1, 2, 3. */
export function toUrduDigits(value: string | number): string {
  return String(value)
}

/** Two-digit zero-padded Latin numeral, e.g. 5 -> "05". */
export function padUrdu(value: number): string {
  return String(value).padStart(2, '0')
}

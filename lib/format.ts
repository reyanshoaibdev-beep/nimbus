const URDU_DIGITS = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹']

/** Convert Latin digits in a string/number to Urdu (Eastern Arabic) numerals. */
export function toUrduDigits(value: string | number): string {
  return String(value).replace(/[0-9]/g, (d) => URDU_DIGITS[Number(d)])
}

/** Two-digit zero-padded Urdu numeral, e.g. 5 -> "۰۵". */
export function padUrdu(value: number): string {
  return toUrduDigits(String(value).padStart(2, '0'))
}

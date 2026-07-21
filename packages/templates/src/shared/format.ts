// Deterministic number formatting (no toLocaleString — that varies by locale).

/** Group an integer's digits with a separator, e.g. 10000 → "10,000". */
export function groupThousands(n: number, sep = ","): string {
  const neg = n < 0;
  const digits = Math.abs(Math.round(n)).toString();
  let out = "";
  for (let i = 0; i < digits.length; i++) {
    if (i > 0 && (digits.length - i) % 3 === 0) out += sep;
    out += digits[i];
  }
  return (neg ? "-" : "") + out;
}

/** Parse the numeric magnitude from a display string like "10,000" or "$2M". */
export function parseTargetNumber(value: string): number {
  const digits = value.replace(/[^\d]/g, "");
  return digits.length ? Number(digits) : 0;
}

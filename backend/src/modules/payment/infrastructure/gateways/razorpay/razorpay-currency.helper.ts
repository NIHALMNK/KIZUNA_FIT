/**
 * Supported currency decimal exponent mappings according to ISO 4217.
 */
const ZERO_DECIMAL_CURRENCIES = new Set(['JPY', 'KRW', 'VND', 'CLF', 'UGX', 'PYG', 'RWF']);
const THREE_DECIMAL_CURRENCIES = new Set(['BHD', 'JOD', 'KWD', 'OMR', 'TND']);

export class RazorpayCurrencyHelper {
  /**
   * Converts a major currency unit (e.g. 500.00 INR) to the provider minor unit (e.g. 50000 paise).
   */
  public static toMinorUnit(amount: number, currency: string): number {
    const curr = currency.toUpperCase().trim();

    if (ZERO_DECIMAL_CURRENCIES.has(curr)) {
      return Math.round(amount);
    }

    if (THREE_DECIMAL_CURRENCIES.has(curr)) {
      return Math.round(amount * 1000);
    }

    // Default for standard 2-decimal currencies (INR, USD, EUR, GBP, AUD, CAD, etc.)
    return Math.round(amount * 100);
  }

  /**
   * Converts a minor currency unit (e.g. 50000 paise) back to major unit (e.g. 500.00 INR).
   */
  public static toMajorUnit(amountInMinor: number, currency: string): number {
    const curr = currency.toUpperCase().trim();

    if (ZERO_DECIMAL_CURRENCIES.has(curr)) {
      return amountInMinor;
    }

    if (THREE_DECIMAL_CURRENCIES.has(curr)) {
      return amountInMinor / 1000;
    }

    return amountInMinor / 100;
  }
}

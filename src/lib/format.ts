import { format, isToday, isYesterday, parseISO } from 'date-fns'

// Each currency is shown the way it's written where it's used: KES as "Ksh 1,250.00".
export const CURRENCIES = [
  { code: 'KES', label: 'Kenyan shilling', locale: 'en-KE' },
  { code: 'UGX', label: 'Ugandan shilling', locale: 'en-UG' },
  { code: 'TZS', label: 'Tanzanian shilling', locale: 'en-TZ' },
  { code: 'USD', label: 'US dollar', locale: 'en-US' },
  { code: 'EUR', label: 'Euro', locale: 'en-IE' },
  { code: 'GBP', label: 'British pound', locale: 'en-GB' },
] as const

export type CurrencyCode = (typeof CURRENCIES)[number]['code']
export const DEFAULT_CURRENCY: CurrencyCode = 'KES'

export function isCurrencyCode(value: string): value is CurrencyCode {
  return CURRENCIES.some((c) => c.code === value)
}

function makeFormatter(code: CurrencyCode) {
  const { locale } = CURRENCIES.find((c) => c.code === code)!
  return new Intl.NumberFormat(locale, { style: 'currency', currency: code })
}

let activeCurrency: CurrencyCode = DEFAULT_CURRENCY
let currencyFormatter = makeFormatter(activeCurrency)

/** Switches the currency every formatCurrency call uses. App calls this when the setting changes. */
export function setActiveCurrency(code: CurrencyCode): void {
  if (code === activeCurrency) return
  activeCurrency = code
  currencyFormatter = makeFormatter(code)
}

/** Short form for tight spots like the donut centre: "Ksh 12.8K". */
export function formatCurrencyShort(value: number): string {
  const { locale } = CURRENCIES.find((c) => c.code === activeCurrency)!
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: activeCurrency,
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}

/** The symbol for the active currency, e.g. "Ksh" or "$", for input prefixes. */
export function currencySymbol(): string {
  return currencyFormatter.formatToParts(0).find((p) => p.type === 'currency')?.value ?? activeCurrency
}

// Axis labels: short numbers, no currency symbol (the axis is all one currency).
const compactFormatter = new Intl.NumberFormat(undefined, {
  notation: 'compact',
  maximumFractionDigits: 1,
})

export function formatCurrency(value: number): string {
  return currencyFormatter.format(value)
}

export function formatCompactCurrency(value: number): string {
  return compactFormatter.format(value)
}

export function formatDate(iso: string): string {
  try {
    return format(parseISO(iso), 'MMM d, yyyy')
  } catch {
    return iso
  }
}

/** "Today", "Yesterday", or "Mon, Nov 10" (with the year when it isn't this year). */
export function formatDayHeading(iso: string): string {
  try {
    const d = parseISO(iso)
    if (Number.isNaN(d.getTime())) return iso
    if (isToday(d)) return 'Today'
    if (isYesterday(d)) return 'Yesterday'
    return format(d, d.getFullYear() === new Date().getFullYear() ? 'EEE, MMM d' : 'EEE, MMM d, yyyy')
  } catch {
    return iso
  }
}

export function todayISO(): string {
  const d = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

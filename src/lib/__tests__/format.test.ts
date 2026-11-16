import { afterEach, describe, expect, it } from 'vitest'
import { DEFAULT_CURRENCY, currencySymbol, formatCurrency, isCurrencyCode, setActiveCurrency } from '../format'

// Intl output can contain non-breaking spaces; normalise them for readable assertions.
const plain = (s: string) => s.replace(/ | /g, ' ')

describe('currency formatting', () => {
  afterEach(() => setActiveCurrency(DEFAULT_CURRENCY))

  it('defaults to Kenyan shillings', () => {
    expect(DEFAULT_CURRENCY).toBe('KES')
    expect(plain(formatCurrency(1250))).toBe('Ksh 1,250.00')
    expect(currencySymbol()).toBe('Ksh')
  })

  it('switches currency for every later call', () => {
    setActiveCurrency('USD')
    expect(plain(formatCurrency(-45))).toBe('-$45.00')
    expect(currencySymbol()).toBe('$')
  })

  it('only accepts supported codes', () => {
    expect(isCurrencyCode('KES')).toBe(true)
    expect(isCurrencyCode('XYZ')).toBe(false)
  })
})

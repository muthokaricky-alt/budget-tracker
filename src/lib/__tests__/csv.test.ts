import { describe, expect, it } from 'vitest'
import { parseCSV, transactionsToCSV } from '../csv'
import type { Transaction } from '../../types'

const sample: Transaction[] = [
  { id: '1', description: 'Coffee, large', amount: -4.5, category: 'food', date: '2026-01-01' },
  { id: '2', description: 'Salary', amount: 1000, category: 'salary', date: '2026-01-15' },
]

describe('csv helpers', () => {
  it('quotes fields containing commas', () => {
    const csv = transactionsToCSV(sample)
    expect(csv).toContain('"Coffee, large"')
  })

  it('round-trips transactions through CSV', () => {
    const csv = transactionsToCSV(sample)
    const parsed = parseCSV(csv)

    expect(parsed).toHaveLength(2)
    expect(parsed[0]).toMatchObject({
      date: '2026-01-01',
      description: 'Coffee, large',
      category: 'food',
      amount: -4.5,
    })
    expect(parsed[1]).toMatchObject({
      date: '2026-01-15',
      description: 'Salary',
      category: 'salary',
      amount: 1000,
    })
  })

  it('ignores blank trailing lines', () => {
    const csv = transactionsToCSV(sample) + '\n\n'
    expect(parseCSV(csv)).toHaveLength(2)
  })
})

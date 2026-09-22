import { describe, expect, it } from 'vitest'
import { filterAndSortTransactions } from '../filters'
import type { Filters, Transaction } from '../../types'

const baseFilters: Filters = { search: '', category: 'all', type: 'all', sortBy: 'date-desc' }

const sample: Transaction[] = [
  { id: '1', description: 'Groceries', amount: -50, category: 'food', date: '2026-01-01' },
  { id: '2', description: 'Salary', amount: 1000, category: 'salary', date: '2026-01-15' },
  { id: '3', description: 'Movie night', amount: -20, category: 'entertainment', date: '2026-01-10' },
]

describe('filterAndSortTransactions', () => {
  it('filters by search text', () => {
    const result = filterAndSortTransactions(sample, { ...baseFilters, search: 'movie' })
    expect(result.map((t) => t.id)).toEqual(['3'])
  })

  it('filters by type', () => {
    const income = filterAndSortTransactions(sample, { ...baseFilters, type: 'income' })
    expect(income.every((t) => t.amount > 0)).toBe(true)

    const expense = filterAndSortTransactions(sample, { ...baseFilters, type: 'expense' })
    expect(expense.every((t) => t.amount < 0)).toBe(true)
  })

  it('filters by category', () => {
    const result = filterAndSortTransactions(sample, { ...baseFilters, category: 'food' })
    expect(result.map((t) => t.id)).toEqual(['1'])
  })

  it('sorts by date descending by default', () => {
    const result = filterAndSortTransactions(sample, baseFilters)
    expect(result.map((t) => t.id)).toEqual(['2', '3', '1'])
  })

  it('sorts by amount ascending', () => {
    const result = filterAndSortTransactions(sample, { ...baseFilters, sortBy: 'amount-asc' })
    expect(result.map((t) => t.id)).toEqual(['1', '3', '2'])
  })

  it('leaves the original array untouched', () => {
    const copy = [...sample]
    filterAndSortTransactions(sample, { ...baseFilters, sortBy: 'amount-asc' })
    expect(sample).toEqual(copy)
  })
})

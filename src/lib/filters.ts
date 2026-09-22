import type { Filters, Transaction } from '../types'

export function filterAndSortTransactions(
  transactions: Transaction[],
  filters: Filters
): Transaction[] {
  const search = filters.search.trim().toLowerCase()

  const filtered = transactions.filter((t) => {
    if (search && !t.description.toLowerCase().includes(search)) return false
    if (filters.category !== 'all' && t.category !== filters.category) return false
    if (filters.type === 'income' && t.amount <= 0) return false
    if (filters.type === 'expense' && t.amount >= 0) return false
    return true
  })

  return [...filtered].sort((a, b) => {
    switch (filters.sortBy) {
      case 'date-asc':
        return a.date.localeCompare(b.date)
      case 'date-desc':
        return b.date.localeCompare(a.date)
      case 'amount-asc':
        return a.amount - b.amount
      case 'amount-desc':
        return b.amount - a.amount
      case 'description-asc':
        return a.description.localeCompare(b.description)
      default:
        return 0
    }
  })
}

export type TransactionType = 'income' | 'expense'

export interface Transaction {
  id: string
  description: string
  /** Signed amount: positive for income, negative for expenses. */
  amount: number
  category: string
  /** ISO date string, yyyy-MM-dd. */
  date: string
}

export interface TransactionDraft {
  description: string
  amount: number
  category: string
  date: string
}

export type TypeFilter = 'all' | TransactionType

export type SortOption =
  | 'date-desc'
  | 'date-asc'
  | 'amount-desc'
  | 'amount-asc'
  | 'description-asc'

export interface Filters {
  search: string
  category: string
  type: TypeFilter
  sortBy: SortOption
}

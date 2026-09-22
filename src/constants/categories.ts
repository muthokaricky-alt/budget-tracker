import type { TransactionType } from '../types'

export interface Category {
  id: string
  label: string
  color: string
  type: TransactionType | 'both'
}

export const CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary', color: '#059669', type: 'income' },
  { id: 'freelance', label: 'Freelance', color: '#0891b2', type: 'income' },
  { id: 'investment', label: 'Investment', color: '#7c3aed', type: 'income' },
  { id: 'food', label: 'Food & Groceries', color: '#f59e0b', type: 'expense' },
  { id: 'transport', label: 'Transport', color: '#3b82f6', type: 'expense' },
  { id: 'housing', label: 'Housing & Bills', color: '#dc2626', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', color: '#ec4899', type: 'expense' },
  { id: 'health', label: 'Health', color: '#14b8a6', type: 'expense' },
  { id: 'shopping', label: 'Shopping', color: '#8b5cf6', type: 'expense' },
  { id: 'other', label: 'Other', color: '#6b7280', type: 'both' },
]

const FALLBACK_CATEGORY = CATEGORIES[CATEGORIES.length - 1]

export function getCategory(id: string): Category {
  return CATEGORIES.find((category) => category.id === id) ?? FALLBACK_CATEGORY
}

export function categoriesForType(type: TransactionType): Category[] {
  return CATEGORIES.filter((category) => category.type === type || category.type === 'both')
}

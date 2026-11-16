import type { TransactionType } from '../types'

export interface Category {
  id: string
  label: string
  color: string
  type: TransactionType | 'both'
}

// Earthy, distinguishable hues that sit on a warm off-white without shouting.
export const CATEGORIES: Category[] = [
  { id: 'salary', label: 'Salary', color: '#2f7d55', type: 'income' },
  { id: 'freelance', label: 'Freelance', color: '#3f8f8a', type: 'income' },
  { id: 'investment', label: 'Investment', color: '#5c7f2f', type: 'income' },
  { id: 'food', label: 'Food & Groceries', color: '#d08a2e', type: 'expense' },
  { id: 'transport', label: 'Transport', color: '#3c6e9e', type: 'expense' },
  { id: 'housing', label: 'Housing & Bills', color: '#b5543b', type: 'expense' },
  { id: 'entertainment', label: 'Entertainment', color: '#c2577a', type: 'expense' },
  { id: 'health', label: 'Health', color: '#2f8c80', type: 'expense' },
  { id: 'shopping', label: 'Shopping', color: '#8a6a3f', type: 'expense' },
  { id: 'other', label: 'Other', color: '#8b857c', type: 'both' },
]

const FALLBACK_CATEGORY = CATEGORIES[CATEGORIES.length - 1]

export function getCategory(id: string): Category {
  return CATEGORIES.find((category) => category.id === id) ?? FALLBACK_CATEGORY
}

export function categoriesForType(type: TransactionType): Category[] {
  return CATEGORIES.filter((category) => category.type === type || category.type === 'both')
}

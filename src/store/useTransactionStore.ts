import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Transaction, TransactionDraft } from '../types'
import { migrateLegacyData } from '../lib/migrateLegacyData'

migrateLegacyData()

function seedTransactions(): Transaction[] {
  const today = new Date()
  const isoDaysAgo = (daysAgo: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString().slice(0, 10)
  }

  return [
    { id: crypto.randomUUID(), description: 'Freelance Project', amount: 450, category: 'freelance', date: isoDaysAgo(6) },
    { id: crypto.randomUUID(), description: 'Groceries', amount: -82.5, category: 'food', date: isoDaysAgo(4) },
    { id: crypto.randomUUID(), description: 'Electric Bill', amount: -45, category: 'housing', date: isoDaysAgo(3) },
    { id: crypto.randomUUID(), description: 'Consulting', amount: 200, category: 'freelance', date: isoDaysAgo(1) },
  ]
}

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (draft: TransactionDraft) => void
  deleteTransaction: (id: string) => void
  clearAll: () => void
  importTransactions: (transactions: Transaction[]) => void
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set) => ({
      transactions: seedTransactions(),

      addTransaction: (draft) =>
        set((state) => ({
          transactions: [...state.transactions, { id: crypto.randomUUID(), ...draft }],
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter((t) => t.id !== id),
        })),

      clearAll: () => set({ transactions: [] }),

      importTransactions: (transactions) => set({ transactions }),
    }),
    {
      name: 'budget-tracker-storage',
      version: 1,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({ transactions: state.transactions }),
    }
  )
)

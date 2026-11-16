import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import type { Transaction, TransactionDraft } from '../types'
import { migrateLegacyData } from '../lib/migrateLegacyData'
import { DEFAULT_CURRENCY, isCurrencyCode, type CurrencyCode } from '../lib/format'

migrateLegacyData()

function seedTransactions(): Transaction[] {
  const today = new Date()
  const isoDaysAgo = (daysAgo: number) => {
    const d = new Date(today)
    d.setDate(d.getDate() - daysAgo)
    return d.toISOString().slice(0, 10)
  }

  return [
    { id: crypto.randomUUID(), description: 'Freelance Project', amount: 45000, category: 'freelance', date: isoDaysAgo(6) },
    { id: crypto.randomUUID(), description: 'Groceries', amount: -8250, category: 'food', date: isoDaysAgo(4) },
    { id: crypto.randomUUID(), description: 'Electric Bill', amount: -4500, category: 'housing', date: isoDaysAgo(3) },
    { id: crypto.randomUUID(), description: 'Consulting', amount: 20000, category: 'freelance', date: isoDaysAgo(1) },
  ]
}

interface TransactionState {
  transactions: Transaction[]
  addTransaction: (draft: TransactionDraft) => void
  deleteTransaction: (id: string) => void
  clearAll: () => void
  importTransactions: (transactions: Transaction[]) => void
  /** ISO 4217 code used to display amounts. Amounts themselves are stored as plain numbers. */
  currency: CurrencyCode
  setCurrency: (currency: CurrencyCode) => void
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

      currency: DEFAULT_CURRENCY,
      setCurrency: (currency) => set({ currency }),
    }),
    {
      name: 'budget-tracker-storage',
      version: 2,
      storage: createJSONStorage(() => window.localStorage),
      partialize: (state) => ({ transactions: state.transactions, currency: state.currency }),
      // v1 saved only transactions; keep them and start on the default currency.
      migrate: (persisted, version) => {
        const state = (persisted ?? {}) as Partial<TransactionState>
        if (version < 2 || !state.currency || !isCurrencyCode(state.currency)) {
          return { ...state, currency: DEFAULT_CURRENCY } as TransactionState
        }
        return state as TransactionState
      },
    }
  )
)

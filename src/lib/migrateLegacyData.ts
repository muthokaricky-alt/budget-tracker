const LEGACY_KEY = 'transactions'
const STORE_KEY = 'budget-tracker-storage'

interface LegacyTransaction {
  id: number
  description: string
  amount: number
}

/**
 * The original version of this app stored a bare array under the
 * "transactions" localStorage key. The new store persists a versioned
 * object under "budget-tracker-storage" via zustand's persist middleware.
 * This runs once, before the store is created, so returning users don't
 * lose their existing data.
 */
export function migrateLegacyData(): void {
  if (typeof window === 'undefined') return

  try {
    if (window.localStorage.getItem(STORE_KEY)) return

    const legacyRaw = window.localStorage.getItem(LEGACY_KEY)
    if (!legacyRaw) return

    const legacy = JSON.parse(legacyRaw) as unknown
    if (!Array.isArray(legacy)) return

    const today = new Date().toISOString().slice(0, 10)
    const migrated = (legacy as LegacyTransaction[]).map((t) => ({
      id: crypto.randomUUID(),
      description: String(t.description ?? 'Imported transaction'),
      amount: Number(t.amount) || 0,
      category: 'other',
      date: today,
    }))

    window.localStorage.setItem(
      STORE_KEY,
      JSON.stringify({ state: { transactions: migrated }, version: 1 })
    )
  } catch {
    // Malformed legacy data shouldn't block the app from starting.
  }
}

import { useEffect, useMemo, useState } from 'react'
import './App.css'
import { useTransactionStore } from './store/useTransactionStore'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import FilterBar, { SortSelect } from './components/FilterBar'
import TransactionList from './components/TransactionList'
import CategoryChart from './components/CategoryChart'
import TrendChart from './components/TrendChart'
import ImportExportBar from './components/ImportExportBar'
import Icon from './components/Icon'
import { filterAndSortTransactions } from './lib/filters'
import { CURRENCIES, isCurrencyCode, setActiveCurrency } from './lib/format'
import type { Filters, Transaction } from './types'

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date-desc',
}

interface Notice {
  id: number
  message: string
  tone: 'info' | 'error'
  undo?: Transaction[]
}

function App() {
  const transactions = useTransactionStore((s) => s.transactions)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const clearAll = useTransactionStore((s) => s.clearAll)
  const replaceAll = useTransactionStore((s) => s.importTransactions)
  const currency = useTransactionStore((s) => s.currency)
  const setCurrency = useTransactionStore((s) => s.setCurrency)

  // Formatting reads the active currency; set it before any child renders an amount.
  setActiveCurrency(currency)

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [notice, setNotice] = useState<Notice | null>(null)

  const filtered = useMemo(() => filterAndSortTransactions(transactions, filters), [transactions, filters])

  // Notices clear themselves; undo is offered for 6 seconds.
  useEffect(() => {
    if (!notice) return
    const id = window.setTimeout(() => setNotice(null), notice.undo ? 6000 : 4000)
    return () => window.clearTimeout(id)
  }, [notice])

  const notify = (message: string, tone: Notice['tone'] = 'info', undo?: Transaction[]) =>
    setNotice({ id: Date.now(), message, tone, undo })

  const handleDelete = (t: Transaction) => {
    const snapshot = transactions
    deleteTransaction(t.id)
    notify(`Deleted "${t.description}"`, 'info', snapshot)
  }

  const handleClear = () => {
    const snapshot = transactions
    clearAll()
    notify(`Deleted ${snapshot.length} transactions`, 'info', snapshot)
  }

  const monthLabel = new Intl.DateTimeFormat(undefined, { month: 'long', year: 'numeric' }).format(new Date())

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true"><Icon name="wallet" size={18} /></span>
          <div>
            <h1>Budget</h1>
            <p>{monthLabel}</p>
          </div>
        </div>
        <div className="topbar-tools">
          <select
            className="input input-sm currency-select"
            value={currency}
            onChange={(e) => {
              if (isCurrencyCode(e.target.value)) setCurrency(e.target.value)
            }}
            aria-label="Currency"
            title="Currency"
          >
            {CURRENCIES.map((c) => (
              <option key={c.code} value={c.code} title={c.label}>
                {c.code}
              </option>
            ))}
          </select>
          <ImportExportBar
            transactions={transactions}
            onImport={(next, added) => {
              const snapshot = transactions
              replaceAll(next)
              notify(`Imported ${added} ${added === 1 ? 'transaction' : 'transactions'}`, 'info', snapshot)
            }}
            onError={(m) => notify(m, 'error')}
          />
        </div>
      </header>

      <main className="layout">
        <div className="col-main">
          <Summary transactions={transactions} />
          {transactions.length > 0 && (
            <div className="charts">
              <CategoryChart transactions={transactions} />
              <TrendChart transactions={transactions} />
            </div>
          )}
          <div className="list-block">
            <FilterBar filters={filters} onChange={setFilters} />
            <TransactionList
              transactions={filtered}
              totalCount={transactions.length}
              sortedByDate={filters.sortBy.startsWith('date')}
              onDelete={handleDelete}
              onClear={handleClear}
              onResetFilters={() => setFilters(DEFAULT_FILTERS)}
              sortControl={<SortSelect filters={filters} onChange={setFilters} />}
            />
          </div>
        </div>
        <aside className="col-side">
          <TransactionForm
            onAdd={(draft) => {
              addTransaction(draft)
              notify(`Added "${draft.description}"`)
            }}
          />
        </aside>
      </main>

      <div className="toast-region" role="status" aria-live="polite">
        {notice && (
          <div key={notice.id} className={`toast${notice.tone === 'error' ? ' is-error' : ''}`}>
            <span>{notice.message}</span>
            {notice.undo && (
              <button
                type="button"
                className="toast-action"
                onClick={() => {
                  replaceAll(notice.undo!)
                  setNotice(null)
                }}
              >
                <Icon name="undo" size={16} />
                Undo
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default App

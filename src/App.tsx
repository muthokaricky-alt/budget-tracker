import { useMemo, useState } from 'react'
import './App.css'
import { useTransactionStore } from './store/useTransactionStore'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import FilterBar from './components/FilterBar'
import TransactionList from './components/TransactionList'
import CategoryChart from './components/CategoryChart'
import TrendChart from './components/TrendChart'
import ImportExportBar from './components/ImportExportBar'
import { filterAndSortTransactions } from './lib/filters'
import type { Filters } from './types'

const DEFAULT_FILTERS: Filters = {
  search: '',
  category: 'all',
  type: 'all',
  sortBy: 'date-desc',
}

function App() {
  const transactions = useTransactionStore((s) => s.transactions)
  const addTransaction = useTransactionStore((s) => s.addTransaction)
  const deleteTransaction = useTransactionStore((s) => s.deleteTransaction)
  const clearAll = useTransactionStore((s) => s.clearAll)
  const importTransactions = useTransactionStore((s) => s.importTransactions)

  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS)

  const filteredTransactions = useMemo(
    () => filterAndSortTransactions(transactions, filters),
    [transactions, filters]
  )

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Budget Tracker</h1>
        <p className="app-subtitle">Track income, expenses, and where your money goes</p>
      </header>

      <Summary transactions={transactions} />

      {transactions.length > 0 && (
        <div className="charts-grid">
          <CategoryChart transactions={transactions} />
          <TrendChart transactions={transactions} />
        </div>
      )}

      <TransactionForm onAdd={addTransaction} />

      <FilterBar filters={filters} onChange={setFilters} />

      <TransactionList
        transactions={filteredTransactions}
        totalCount={transactions.length}
        onDelete={deleteTransaction}
        onClear={clearAll}
      />

      <ImportExportBar transactions={transactions} onImport={importTransactions} />
    </div>
  )
}

export default App

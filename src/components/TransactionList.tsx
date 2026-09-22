import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'
import { formatCurrency, formatDate } from '../lib/format'
import './TransactionList.css'

interface TransactionListProps {
  transactions: Transaction[]
  totalCount: number
  onDelete: (id: string) => void
  onClear: () => void
}

function TransactionList({ transactions, totalCount, onDelete, onClear }: TransactionListProps) {
  const isFiltered = transactions.length !== totalCount

  return (
    <section className="list-section">
      <div className="list-header">
        <h2 className="section-title">Transactions</h2>
        <span className="list-count">
          {transactions.length} {transactions.length === 1 ? 'item' : 'items'}
          {isFiltered ? ` of ${totalCount}` : ''}
        </span>
      </div>

      {transactions.length === 0 ? (
        <div className="transaction-empty">
          {totalCount === 0 ? 'No transactions recorded' : 'No transactions match your filters'}
        </div>
      ) : (
        <ul className="transaction-list">
          {transactions.map((t) => {
            const isExpense = t.amount < 0
            const category = getCategory(t.category)
            return (
              <li key={t.id} className={`transaction-item ${isExpense ? 'expense' : ''}`}>
                <span className="transaction-category" style={{ backgroundColor: category.color }}>
                  {category.label}
                </span>
                <div className="transaction-main">
                  <span className="transaction-description">{t.description}</span>
                  <span className="transaction-date">{formatDate(t.date)}</span>
                </div>
                <span className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                  {isExpense ? '-' : '+'}
                  {formatCurrency(Math.abs(t.amount))}
                </span>
                <button
                  className="transaction-delete"
                  onClick={() => onDelete(t.id)}
                  aria-label={`Delete ${t.description}`}
                  title="Delete"
                >
                  ✕
                </button>
              </li>
            )
          })}
        </ul>
      )}

      {totalCount > 0 && (
        <button onClick={onClear} className="button button-secondary">
          Clear All Data
        </button>
      )}
    </section>
  )
}

export default TransactionList

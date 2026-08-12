import React from 'react'
import './TransactionList.css'

function TransactionList({ transactions, onDelete, onClear }) {
  if (transactions.length === 0) {
    return (
      <section className="list-section">
        <div className="list-header">
          <h2 className="section-title">Transactions</h2>
          <span className="list-count">0 items</span>
        </div>
        <div className="transaction-empty">
          No transactions recorded
        </div>
        <button onClick={onClear} className="button button-secondary">
          Clear All Data
        </button>
      </section>
    )
  }

  const sorted = [...transactions].sort((a, b) => b.id - a.id)

  return (
    <section className="list-section">
      <div className="list-header">
        <h2 className="section-title">Transactions</h2>
        <span className="list-count">
          {transactions.length} {transactions.length === 1 ? 'item' : 'items'}
        </span>
      </div>
      <ul className="transaction-list">
        {sorted.map((t) => {
          const isExpense = t.amount < 0
          return (
            <li key={t.id} className={`transaction-item ${isExpense ? 'expense' : ''}`}>
              <span className="transaction-description">{t.description}</span>
              <span className={`transaction-amount ${isExpense ? 'expense' : 'income'}`}>
                ${Math.abs(t.amount).toFixed(2)}
              </span>
              <button
                className="transaction-delete"
                onClick={() => onDelete(t.id)}
                aria-label="Delete transaction"
                title="Delete"
              >
                ✕
              </button>
            </li>
          )
        })}
      </ul>
      <button onClick={onClear} className="button button-secondary">
        Clear All Data
      </button>
    </section>
  )
}

export default TransactionList
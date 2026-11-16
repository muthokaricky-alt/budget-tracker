import { useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'
import { formatCurrency, formatDayHeading } from '../lib/format'
import Icon from './Icon'

interface TransactionListProps {
  transactions: Transaction[]
  totalCount: number
  sortedByDate: boolean
  onDelete: (t: Transaction) => void
  onClear: () => void
  onResetFilters: () => void
  sortControl?: ReactNode
}

function TransactionList({
  transactions,
  totalCount,
  sortedByDate,
  onDelete,
  onClear,
  onResetFilters,
  sortControl,
}: TransactionListProps) {
  const [confirming, setConfirming] = useState(false)
  const isFiltered = transactions.length !== totalCount

  // Two-step delete-all: the second press must come within 4 seconds.
  useEffect(() => {
    if (!confirming) return
    const id = window.setTimeout(() => setConfirming(false), 4000)
    return () => window.clearTimeout(id)
  }, [confirming])

  // Group by day only when the list is in date order; other sorts stay flat.
  const groups = useMemo(() => {
    if (!sortedByDate) return [{ key: 'all', label: '', items: transactions }]
    const out: { key: string; label: string; items: Transaction[] }[] = []
    for (const t of transactions) {
      const last = out[out.length - 1]
      if (last && last.key === t.date) last.items.push(t)
      else out.push({ key: t.date, label: formatDayHeading(t.date), items: [t] })
    }
    return out
  }, [transactions, sortedByDate])

  return (
    <section className="panel list-panel" aria-labelledby="list-title">
      <div className="panel-head panel-head-center">
        <h2 id="list-title" className="panel-title">Transactions</h2>
        <div className="panel-tools">
          <span className="count">
            {isFiltered ? `${transactions.length} of ${totalCount}` : `${totalCount} total`}
          </span>
          {sortControl}
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="empty">
          {totalCount === 0 ? (
            <>
              <p className="empty-title">Nothing recorded yet</p>
              <p>Add your first income or expense with the form, or import a CSV backup.</p>
            </>
          ) : (
            <>
              <p className="empty-title">No matches</p>
              <p>Nothing fits these filters.</p>
              <button type="button" className="button button-ghost" onClick={onResetFilters}>
                Clear filters
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="tx-groups">
          {groups.map((g) => (
            <div key={g.key} className="tx-group">
              {g.label && <h3 className="tx-day">{g.label}</h3>}
              <ul className="tx-list">
                {g.items.map((t) => {
                  const isExpense = t.amount < 0
                  const category = getCategory(t.category)
                  return (
                    <li key={t.id} className="tx">
                      <span className="tx-dot" style={{ background: category.color }} aria-hidden="true" />
                      <div className="tx-main">
                        <span className="tx-desc">{t.description}</span>
                        <span className="tx-cat">{category.label}</span>
                      </div>
                      <span className={`tx-amount${isExpense ? '' : ' amount-income'}`}>
                        {isExpense ? '−' : '+'}
                        {formatCurrency(Math.abs(t.amount))}
                      </span>
                      <button
                        type="button"
                        className="icon-button tx-delete"
                        onClick={() => onDelete(t)}
                        aria-label={`Delete ${t.description}`}
                      >
                        <Icon name="trash" size={17} />
                      </button>
                    </li>
                  )
                })}
              </ul>
            </div>
          ))}
        </div>
      )}

      {totalCount > 0 && (
        <div className="danger-zone">
          <button
            type="button"
            className={`button button-ghost danger${confirming ? ' is-confirming' : ''}`}
            onClick={() => {
              if (confirming) {
                setConfirming(false)
                onClear()
              } else setConfirming(true)
            }}
          >
            {confirming ? `Press again to delete all ${totalCount}` : 'Delete all transactions'}
          </button>
        </div>
      )}
    </section>
  )
}

export default TransactionList

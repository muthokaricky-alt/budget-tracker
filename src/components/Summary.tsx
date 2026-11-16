import { useMemo } from 'react'
import type { Transaction } from '../types'
import { formatCurrency } from '../lib/format'

interface SummaryProps {
  transactions: Transaction[]
}

function Summary({ transactions }: SummaryProps) {
  const metrics = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (t.amount > 0) income += t.amount
      else expense += Math.abs(t.amount)
    }
    return { balance: income - expense, income, expense }
  }, [transactions])

  const spentShare =
    metrics.income > 0 ? Math.min(1, metrics.expense / metrics.income) : metrics.expense > 0 ? 1 : 0

  return (
    <section className="summary" aria-label="Summary">
      <div className="summary-main">
        <h2 className="summary-label">Balance</h2>
        <p className={`summary-balance${metrics.balance < 0 ? ' is-negative' : ''}`}>
          {formatCurrency(metrics.balance)}
        </p>
      </div>
      <dl className="summary-split">
        <div>
          <dt>Income</dt>
          <dd className="amount-income">{formatCurrency(metrics.income)}</dd>
        </div>
        <div>
          <dt>Spent</dt>
          <dd>{formatCurrency(metrics.expense)}</dd>
        </div>
      </dl>
      <div
        className="spent-meter"
        role="meter"
        aria-label="Share of income spent"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={Math.round(spentShare * 100)}
      >
        <span style={{ transform: `scaleX(${spentShare})` }} />
      </div>
      <p className="summary-note">
        {metrics.income > 0
          ? `${Math.round(spentShare * 100)}% of income spent`
          : 'Add income to see how much of it you spend'}
      </p>
    </section>
  )
}

export default Summary

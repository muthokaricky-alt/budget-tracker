import { useMemo } from 'react'
import type { Transaction } from '../types'
import { formatCurrency } from '../lib/format'
import './Summary.css'

interface SummaryProps {
  transactions: Transaction[]
}

function Summary({ transactions }: SummaryProps) {
  const metrics = useMemo(() => {
    let income = 0
    let expense = 0
    for (const t of transactions) {
      if (t.amount > 0) income += t.amount
      else expense += t.amount
    }
    return { total: income + expense, income, expense }
  }, [transactions])

  return (
    <section className="summary" aria-label="Financial summary">
      <div className="summary-balance">
        <span className="summary-label">Balance</span>
        <span className="summary-value">{formatCurrency(metrics.total)}</span>
      </div>
      <div className="summary-metrics">
        <div className="metric">
          <span className="metric-label">Income</span>
          <span className="metric-value metric-income">{formatCurrency(metrics.income)}</span>
        </div>
        <div className="metric-divider" />
        <div className="metric">
          <span className="metric-label">Expenses</span>
          <span className="metric-value metric-expense">{formatCurrency(Math.abs(metrics.expense))}</span>
        </div>
      </div>
    </section>
  )
}

export default Summary

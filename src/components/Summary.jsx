import React, { useMemo } from 'react'
import './Summary.css'

function Summary({ transactions }) {
  const metrics = useMemo(() => {
    const amounts = transactions.map(t => t.amount)
    const total = amounts.reduce((sum, val) => sum + val, 0)
    const income = amounts.filter(val => val > 0).reduce((sum, val) => sum + val, 0)
    const expense = amounts.filter(val => val < 0).reduce((sum, val) => sum + val, 0)
    return { total, income, expense }
  }, [transactions])

  return (
    <section className="summary" aria-label="Financial summary">
      <div className="summary-balance">
        <span className="summary-label">Balance</span>
        <span className="summary-value">${metrics.total.toFixed(2)}</span>
      </div>
      <div className="summary-metrics">
        <div className="metric">
          <span className="metric-label">Income</span>
          <span className="metric-value metric-income">${metrics.income.toFixed(2)}</span>
        </div>
        <div className="metric-divider"></div>
        <div className="metric">
          <span className="metric-label">Expenses</span>
          <span className="metric-value metric-expense">${Math.abs(metrics.expense).toFixed(2)}</span>
        </div>
      </div>
    </section>
  )
}

export default Summary
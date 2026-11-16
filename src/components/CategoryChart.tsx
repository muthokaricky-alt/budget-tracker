import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'
import { formatCurrency, formatCurrencyShort } from '../lib/format'

interface CategoryChartProps {
  transactions: Transaction[]
}

interface SlicePoint {
  name: string
  value: number
  color: string
}

function CategoryChart({ transactions }: CategoryChartProps) {
  const data = useMemo<SlicePoint[]>(() => {
    const totals = new Map<string, number>()
    for (const t of transactions) {
      if (t.amount >= 0) continue
      totals.set(t.category, (totals.get(t.category) ?? 0) + Math.abs(t.amount))
    }
    return Array.from(totals.entries())
      .map(([categoryId, value]) => {
        const category = getCategory(categoryId)
        return { name: category.label, value, color: category.color }
      })
      .sort((a, b) => b.value - a.value)
  }, [transactions])

  const total = data.reduce((sum, d) => sum + d.value, 0)

  return (
    <section className="panel chart-panel" aria-labelledby="cat-title">
      <h2 id="cat-title" className="panel-title">Where it goes</h2>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses yet.</p>
      ) : (
        <div className="donut-layout">
          <div className="donut">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="value"
                  nameKey="name"
                  innerRadius="68%"
                  outerRadius="100%"
                  paddingAngle={data.length > 1 ? 2 : 0}
                  stroke="none"
                  isAnimationActive={false}
                >
                  {data.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{ borderRadius: 10, border: '1px solid #e6e0d6', boxShadow: '0 6px 16px -8px rgba(40,30,20,.25)', fontSize: 13 }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center" aria-hidden="true">
              <span>Spent</span>
              <b title={formatCurrency(total)}>{formatCurrencyShort(total)}</b>
            </div>
          </div>
          <ul className="legend">
            {data.map((d) => (
              <li key={d.name}>
                <span className="tx-dot" style={{ background: d.color }} aria-hidden="true" />
                <span className="legend-name">{d.name}</span>
                <span className="legend-value">{formatCurrency(d.value)}</span>
                <span className="legend-pct">{Math.round((d.value / total) * 100)}%</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  )
}

export default CategoryChart

import { useMemo } from 'react'
import { Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import type { Transaction } from '../types'
import { getCategory } from '../constants/categories'
import { formatCurrency } from '../lib/format'
import './Charts.css'

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

  return (
    <div className="chart-card">
      <h3 className="chart-title">Spending by Category</h3>
      {data.length === 0 ? (
        <p className="chart-empty">No expenses yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" innerRadius={50} outerRadius={80} paddingAngle={2}>
              {data.map((entry) => (
                <Cell key={entry.name} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default CategoryChart

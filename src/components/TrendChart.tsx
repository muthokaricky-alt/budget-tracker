import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { Transaction } from '../types'
import { formatCurrency } from '../lib/format'
import './Charts.css'

interface TrendChartProps {
  transactions: Transaction[]
}

interface MonthBucket {
  month: string
  income: number
  expense: number
}

function TrendChart({ transactions }: TrendChartProps) {
  const data = useMemo<MonthBucket[]>(() => {
    const buckets = new Map<string, MonthBucket>()

    for (const t of transactions) {
      const monthKey = t.date.slice(0, 7) // yyyy-MM
      const label = format(parseISO(`${monthKey}-01`), 'MMM yyyy')
      const bucket = buckets.get(monthKey) ?? { month: label, income: 0, expense: 0 }
      if (t.amount >= 0) bucket.income += t.amount
      else bucket.expense += Math.abs(t.amount)
      buckets.set(monthKey, bucket)
    }

    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([, bucket]) => bucket)
  }, [transactions])

  return (
    <div className="chart-card">
      <h3 className="chart-title">Monthly Trend</h3>
      {data.length === 0 ? (
        <p className="chart-empty">No data yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip formatter={(value: number) => formatCurrency(value)} />
            <Legend />
            <Bar dataKey="income" fill="#059669" name="Income" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="#dc2626" name="Expense" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  )
}

export default TrendChart

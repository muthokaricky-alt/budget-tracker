import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { Transaction } from '../types'
import { formatCurrency, formatCompactCurrency } from '../lib/format'

interface TrendChartProps {
  transactions: Transaction[]
}

interface MonthBucket {
  month: string
  income: number
  expense: number
}

const INCOME = '#2f7d55'
const EXPENSE = '#d9cfc1'

function TrendChart({ transactions }: TrendChartProps) {
  const data = useMemo<MonthBucket[]>(() => {
    const buckets = new Map<string, MonthBucket>()
    for (const t of transactions) {
      const monthKey = t.date.slice(0, 7) // yyyy-MM
      const label = format(parseISO(`${monthKey}-01`), 'MMM')
      const bucket = buckets.get(monthKey) ?? { month: label, income: 0, expense: 0 }
      if (t.amount >= 0) bucket.income += t.amount
      else bucket.expense += Math.abs(t.amount)
      buckets.set(monthKey, bucket)
    }
    return Array.from(buckets.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .slice(-6)
      .map(([, bucket]) => bucket)
  }, [transactions])

  return (
    <section className="panel chart-panel" aria-labelledby="trend-title">
      <div className="panel-head">
        <h2 id="trend-title" className="panel-title">By month</h2>
        <div className="key" aria-hidden="true">
          <span><i style={{ background: INCOME }} />Income</span>
          <span><i style={{ background: EXPENSE }} />Spent</span>
        </div>
      </div>
      {data.length === 0 ? (
        <p className="chart-empty">No data yet.</p>
      ) : (
        <div className="bars">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} barGap={4} margin={{ top: 8, right: 0, left: 0, bottom: 0 }}>
              <CartesianGrid vertical={false} stroke="#ece6dc" />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#7a7268' }} />
              <YAxis
                width={48}
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 12, fill: '#7a7268' }}
                tickFormatter={(v: number) => formatCompactCurrency(v)}
              />
              <Tooltip
                cursor={{ fill: 'rgba(40,30,20,.04)' }}
                formatter={(value: number, name: string) => [formatCurrency(value), name === 'income' ? 'Income' : 'Spent']}
                contentStyle={{ borderRadius: 10, border: '1px solid #e6e0d6', boxShadow: '0 6px 16px -8px rgba(40,30,20,.25)', fontSize: 13 }}
              />
              <Bar dataKey="income" fill={INCOME} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
              <Bar dataKey="expense" fill={EXPENSE} radius={[4, 4, 0, 0]} maxBarSize={28} isAnimationActive={false} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </section>
  )
}

export default TrendChart

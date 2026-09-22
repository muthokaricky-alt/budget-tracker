import type { Transaction } from '../types'

const HEADER = ['date', 'description', 'category', 'amount']

function escapeCsvField(value: string): string {
  if (/[",\n]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function transactionsToCSV(transactions: Transaction[]): string {
  const rows = transactions.map((t) => [
    t.date,
    escapeCsvField(t.description),
    t.category,
    t.amount.toString(),
  ])
  return [HEADER, ...rows].map((row) => row.join(',')).join('\n')
}

function splitCsvLine(line: string): string[] {
  const result: string[] = []
  let current = ''
  let inQuotes = false

  for (let i = 0; i < line.length; i++) {
    const char = line[i]
    if (inQuotes) {
      if (char === '"') {
        if (line[i + 1] === '"') {
          current += '"'
          i++
        } else {
          inQuotes = false
        }
      } else {
        current += char
      }
    } else if (char === '"') {
      inQuotes = true
    } else if (char === ',') {
      result.push(current)
      current = ''
    } else {
      current += char
    }
  }
  result.push(current)
  return result
}

export interface ParsedCsvRow {
  date: string
  description: string
  category: string
  amount: number
}

export function parseCSV(text: string): ParsedCsvRow[] {
  const lines = text.trim().split(/\r?\n/)
  const [, ...dataLines] = lines // skip header row

  return dataLines
    .filter((line) => line.trim().length > 0)
    .map((line) => {
      const [date, description, category, amount] = splitCsvLine(line)
      return {
        date: date ?? '',
        description: description ?? '',
        category: category ?? 'other',
        amount: parseFloat(amount ?? ''),
      }
    })
}

export function downloadCSV(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

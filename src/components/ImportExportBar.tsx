import { useRef, type ChangeEvent } from 'react'
import type { Transaction } from '../types'
import { downloadCSV, parseCSV, transactionsToCSV } from '../lib/csv'
import { CATEGORIES } from '../constants/categories'
import { todayISO } from '../lib/format'
import Icon from './Icon'

interface ImportExportBarProps {
  transactions: Transaction[]
  onImport: (transactions: Transaction[], added: number) => void
  onError: (message: string) => void
}

const KNOWN_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

function ImportExportBar({ transactions, onImport, onError }: ImportExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    downloadCSV(`budget-tracker-${todayISO()}.csv`, transactionsToCSV(transactions))
  }

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    try {
      const parsed = parseCSV(await file.text())
      const imported: Transaction[] = parsed
        .filter((row) => row.description && !Number.isNaN(row.amount))
        .map((row) => ({
          id: crypto.randomUUID(),
          description: row.description,
          amount: row.amount,
          category: KNOWN_CATEGORY_IDS.has(row.category) ? row.category : 'other',
          date: row.date || todayISO(),
        }))
      if (imported.length === 0) {
        onError(`No transactions found in ${file.name}. Check it has description and amount columns.`)
        return
      }
      onImport([...transactions, ...imported], imported.length)
    } catch {
      onError(`Couldn't read ${file.name}. Make sure it's a CSV file.`)
    }
  }

  return (
    <div className="io">
      <button
        type="button"
        className="button button-ghost"
        onClick={() => fileInputRef.current?.click()}
        aria-label="Import CSV"
      >
        <Icon name="upload" size={16} />
        <span className="io-label">Import</span>
      </button>
      <button
        type="button"
        className="button button-ghost"
        onClick={handleExport}
        disabled={transactions.length === 0}
        aria-label="Export CSV"
      >
        <Icon name="download" size={16} />
        <span className="io-label">Export CSV</span>
      </button>
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv,text/csv"
        onChange={handleFileChange}
        className="visually-hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}

export default ImportExportBar

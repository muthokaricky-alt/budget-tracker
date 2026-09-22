import { useRef, type ChangeEvent } from 'react'
import type { Transaction } from '../types'
import { downloadCSV, parseCSV, transactionsToCSV } from '../lib/csv'
import { CATEGORIES } from '../constants/categories'
import { todayISO } from '../lib/format'
import './ImportExportBar.css'

interface ImportExportBarProps {
  transactions: Transaction[]
  onImport: (transactions: Transaction[]) => void
}

const KNOWN_CATEGORY_IDS = new Set(CATEGORIES.map((c) => c.id))

function ImportExportBar({ transactions, onImport }: ImportExportBarProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleExport = () => {
    const csv = transactionsToCSV(transactions)
    downloadCSV(`budget-tracker-${todayISO()}.csv`, csv)
  }

  const handleImportClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const text = await file.text()
    const parsed = parseCSV(text)

    const imported: Transaction[] = parsed
      .filter((row) => row.description && !Number.isNaN(row.amount))
      .map((row) => ({
        id: crypto.randomUUID(),
        description: row.description,
        amount: row.amount,
        category: KNOWN_CATEGORY_IDS.has(row.category) ? row.category : 'other',
        date: row.date || todayISO(),
      }))

    onImport([...transactions, ...imported])
    e.target.value = ''
  }

  return (
    <section className="import-export" aria-label="Import or export data">
      <button type="button" className="button button-secondary" onClick={handleExport}>
        Export CSV
      </button>
      <button type="button" className="button button-secondary" onClick={handleImportClick}>
        Import CSV
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
    </section>
  )
}

export default ImportExportBar

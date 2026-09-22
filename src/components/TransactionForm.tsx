import { useRef, useState, type FormEvent } from 'react'
import type { TransactionDraft, TransactionType } from '../types'
import { categoriesForType } from '../constants/categories'
import { todayISO } from '../lib/format'
import './TransactionForm.css'

interface TransactionFormProps {
  onAdd: (draft: TransactionDraft) => void
}

function TransactionForm({ onAdd }: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState('other')
  const [date, setDate] = useState(todayISO())
  const [error, setError] = useState('')
  const descInputRef = useRef<HTMLInputElement>(null)

  const availableCategories = categoriesForType(type)

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType)
    const stillValid = categoriesForType(nextType).some((c) => c.id === category)
    if (!stillValid) {
      setCategory(nextType === 'income' ? 'salary' : 'other')
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()

    const trimmedDesc = description.trim()
    if (!trimmedDesc) {
      setError('Enter a description.')
      descInputRef.current?.focus()
      return
    }

    const numAmount = parseFloat(amount)
    if (Number.isNaN(numAmount) || numAmount <= 0) {
      setError('Enter an amount greater than zero.')
      return
    }

    onAdd({
      description: trimmedDesc,
      amount: type === 'expense' ? -numAmount : numAmount,
      category,
      date,
    })

    setDescription('')
    setAmount('')
    setError('')
    descInputRef.current?.focus()
  }

  return (
    <section className="add-section" aria-label="Add transaction">
      <h2 className="section-title">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="add-form">
        <div className="type-toggle" role="radiogroup" aria-label="Transaction type">
          <button
            type="button"
            className={`type-option expense ${type === 'expense' ? 'active' : ''}`}
            aria-pressed={type === 'expense'}
            onClick={() => handleTypeChange('expense')}
          >
            Expense
          </button>
          <button
            type="button"
            className={`type-option income ${type === 'income' ? 'active' : ''}`}
            aria-pressed={type === 'income'}
            onClick={() => handleTypeChange('income')}
          >
            Income
          </button>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="description" className="form-label">Description</label>
            <input
              ref={descInputRef}
              type="text"
              id="description"
              className="form-input"
              placeholder="Enter description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount" className="form-label">Amount</label>
            <input
              type="number"
              id="amount"
              className="form-input"
              placeholder="0.00"
              step="0.01"
              min="0"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              className="form-input"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date" className="form-label">Date</label>
            <input
              type="date"
              id="date"
              className="form-input"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
        </div>

        {error && <p className="form-error" role="alert">{error}</p>}

        <button type="submit" className="button button-primary">
          Add Transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm

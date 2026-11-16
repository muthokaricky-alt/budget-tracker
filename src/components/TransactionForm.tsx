import { useRef, useState, type FormEvent } from 'react'
import type { TransactionDraft, TransactionType } from '../types'
import { categoriesForType } from '../constants/categories'
import { todayISO } from '../lib/format'
import Icon from './Icon'

interface TransactionFormProps {
  onAdd: (draft: TransactionDraft) => void
}

type FieldErrors = Partial<Record<'description' | 'amount', string>>

function TransactionForm({ onAdd }: TransactionFormProps) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [type, setType] = useState<TransactionType>('expense')
  const [category, setCategory] = useState('food')
  const [date, setDate] = useState(todayISO())
  const [errors, setErrors] = useState<FieldErrors>({})
  const descInputRef = useRef<HTMLInputElement>(null)
  const amountInputRef = useRef<HTMLInputElement>(null)

  const availableCategories = categoriesForType(type)

  const handleTypeChange = (nextType: TransactionType) => {
    setType(nextType)
    const stillValid = categoriesForType(nextType).some((c) => c.id === category)
    if (!stillValid) setCategory(nextType === 'income' ? 'salary' : 'food')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const trimmedDesc = description.trim()
    const numAmount = parseFloat(amount)
    const next: FieldErrors = {}
    if (!trimmedDesc) next.description = 'Add a short description, like "Groceries".'
    if (Number.isNaN(numAmount) || numAmount <= 0) next.amount = 'Enter an amount above zero.'
    setErrors(next)
    if (next.description) {
      descInputRef.current?.focus()
      return
    }
    if (next.amount) {
      amountInputRef.current?.focus()
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
    descInputRef.current?.focus()
  }

  return (
    <section className="panel add-panel" aria-labelledby="add-title">
      <h2 id="add-title" className="panel-title">Add a transaction</h2>
      <form onSubmit={handleSubmit} className="add-form" noValidate>
        <div className="segmented" role="radiogroup" aria-label="Type">
          {(['expense', 'income'] as const).map((t) => (
            <button
              key={t}
              type="button"
              role="radio"
              aria-checked={type === t}
              className={`segment ${t}${type === t ? ' is-active' : ''}`}
              onClick={() => handleTypeChange(t)}
            >
              {t === 'expense' ? 'Expense' : 'Income'}
            </button>
          ))}
        </div>

        <div className="field">
          <label htmlFor="description">Description</label>
          <input
            ref={descInputRef}
            id="description"
            className="input"
            autoComplete="off"
            placeholder={type === 'expense' ? 'Groceries, rent, fare…' : 'Salary, client payment…'}
            value={description}
            aria-invalid={Boolean(errors.description)}
            aria-describedby={errors.description ? 'description-error' : undefined}
            onChange={(e) => setDescription(e.target.value)}
          />
          {errors.description && <p id="description-error" className="field-error">{errors.description}</p>}
        </div>

        <div className="field">
          <label htmlFor="amount">Amount</label>
          <div className="input-affix">
            <span aria-hidden="true">$</span>
            <input
              ref={amountInputRef}
              id="amount"
              className="input"
              inputMode="decimal"
              type="number"
              step="0.01"
              min="0"
              placeholder="0.00"
              value={amount}
              aria-invalid={Boolean(errors.amount)}
              aria-describedby={errors.amount ? 'amount-error' : undefined}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          {errors.amount && <p id="amount-error" className="field-error">{errors.amount}</p>}
        </div>

        <div className="field-row">
          <div className="field">
            <label htmlFor="category">Category</label>
            <select id="category" className="input" value={category} onChange={(e) => setCategory(e.target.value)}>
              {availableCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.label}</option>
              ))}
            </select>
          </div>
          <div className="field">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              id="date"
              className="input"
              value={date}
              max={todayISO()}
              onChange={(e) => setDate(e.target.value || todayISO())}
            />
          </div>
        </div>

        <button type="submit" className="button button-primary button-block">
          <Icon name="plus" />
          Add {type}
        </button>
      </form>
    </section>
  )
}

export default TransactionForm

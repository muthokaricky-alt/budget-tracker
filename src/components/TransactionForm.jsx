import React, { useState, useRef } from 'react'
import './TransactionForm.css'

function TransactionForm({ onAdd }) {
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const descInputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isSubmitting) return

    const trimmedDesc = description.trim()
    if (!trimmedDesc) {
      descInputRef.current?.focus()
      return
    }

    const numAmount = parseFloat(amount)
    if (isNaN(numAmount) || numAmount === 0) {
      return
    }

    setIsSubmitting(true)
    
    setTimeout(() => {
      onAdd(trimmedDesc, numAmount)
      setDescription('')
      setAmount('')
      descInputRef.current?.focus()
      setIsSubmitting(false)
    }, 300)
  }

  return (
    <section className="add-section" aria-label="Add transaction">
      <h2 className="section-title">Add Transaction</h2>
      <form onSubmit={handleSubmit} className="add-form">
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
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />
          <span className="form-hint">Positive for income, negative for expenses</span>
        </div>
        <button 
          type="submit" 
          className={`button button-primary ${isSubmitting ? 'button-loading' : ''}`}
          disabled={isSubmitting}
        >
          Add Transaction
        </button>
      </form>
    </section>
  )
}

export default TransactionForm
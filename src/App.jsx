import React, { useState, useEffect, useCallback } from 'react'
import './App.css'
import Summary from './components/Summary'
import TransactionForm from './components/TransactionForm'
import TransactionList from "/src/components/TransactionList.jsx";

const STORAGE_KEY = 'transactions'

function App() {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        setTransactions(JSON.parse(stored))
      } catch {
        setTransactions([])
      }
    } else {
      setTransactions([
        { id: 1, description: 'Freelance Project', amount: 450.00 },
        { id: 2, description: 'Groceries', amount: -82.50 },
        { id: 3, description: 'Electric Bill', amount: -45.00 },
        { id: 4, description: 'Consulting', amount: 200.00 },
      ])
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    if (!isLoading) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions))
    }
  }, [transactions, isLoading])

  const addTransaction = useCallback((description, amount) => {
    const newTransaction = {
      id: Date.now() + Math.floor(Math.random() * 1000),
      description: description.trim(),
      amount: parseFloat(amount),
    }
    setTransactions(prev => [...prev, newTransaction])
  }, [])

  const deleteTransaction = useCallback((id) => {
    setTransactions(prev => prev.filter(t => t.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    if (transactions.length === 0) return
    if (window.confirm('Delete all transactions? This cannot be undone.')) {
      setTransactions([])
    }
  }, [transactions])

  if (isLoading) {
    return (
      <div className="app">
        <div className="skeleton-header" />
        <div className="skeleton-summary" />
        <div className="skeleton-form" />
        <div className="skeleton-list" />
      </div>
    )
  }

  return (
    <div className="app">
      <header className="app-header">
        <h1 className="app-title">Budget Tracker</h1>
        <p className="app-subtitle">Track income and expenses</p>
      </header>

      <Summary transactions={transactions} />
      <TransactionForm onAdd={addTransaction} />
      <TransactionList 
        transactions={transactions} 
        onDelete={deleteTransaction}
        onClear={clearAll}
      />
    </div>
  )
}

export default App
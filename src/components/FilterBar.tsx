import type { Filters, SortOption, TypeFilter } from '../types'
import { CATEGORIES } from '../constants/categories'
import './FilterBar.css'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <section className="filter-bar" aria-label="Filter transactions">
      <input
        type="search"
        className="form-input filter-search"
        placeholder="Search descriptions..."
        value={filters.search}
        onChange={(e) => onChange({ ...filters, search: e.target.value })}
        aria-label="Search transactions"
      />
      <select
        className="form-input"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Filter by category"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
      <select
        className="form-input"
        value={filters.type}
        onChange={(e) => onChange({ ...filters, type: e.target.value as TypeFilter })}
        aria-label="Filter by type"
      >
        <option value="all">Income &amp; Expenses</option>
        <option value="income">Income only</option>
        <option value="expense">Expenses only</option>
      </select>
      <select
        className="form-input"
        value={filters.sortBy}
        onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
        aria-label="Sort transactions"
      >
        <option value="date-desc">Newest first</option>
        <option value="date-asc">Oldest first</option>
        <option value="amount-desc">Amount: high to low</option>
        <option value="amount-asc">Amount: low to high</option>
        <option value="description-asc">Description (A-Z)</option>
      </select>
    </section>
  )
}

export default FilterBar

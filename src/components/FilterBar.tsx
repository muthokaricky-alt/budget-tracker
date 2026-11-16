import type { Filters, SortOption, TypeFilter } from '../types'
import { CATEGORIES } from '../constants/categories'
import Icon from './Icon'

interface FilterBarProps {
  filters: Filters
  onChange: (filters: Filters) => void
}

const TYPES: { id: TypeFilter; label: string }[] = [
  { id: 'all', label: 'All' },
  { id: 'income', label: 'Income' },
  { id: 'expense', label: 'Expenses' },
]

function FilterBar({ filters, onChange }: FilterBarProps) {
  return (
    <div className="filters" role="search" aria-label="Filter transactions">
      <div className="search">
        <Icon name="search" size={16} />
        <input
          type="search"
          className="input"
          placeholder="Search"
          value={filters.search}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          aria-label="Search transactions"
        />
      </div>
      <div className="segmented segmented-sm" role="radiogroup" aria-label="Show">
        {TYPES.map((t) => (
          <button
            key={t.id}
            type="button"
            role="radio"
            aria-checked={filters.type === t.id}
            className={`segment${filters.type === t.id ? ' is-active' : ''}`}
            onClick={() => onChange({ ...filters, type: t.id })}
          >
            {t.label}
          </button>
        ))}
      </div>
      <select
        className="input input-sm"
        value={filters.category}
        onChange={(e) => onChange({ ...filters, category: e.target.value })}
        aria-label="Category"
      >
        <option value="all">All categories</option>
        {CATEGORIES.map((c) => (
          <option key={c.id} value={c.id}>{c.label}</option>
        ))}
      </select>
    </div>
  )
}

export function SortSelect({ filters, onChange }: FilterBarProps) {
  return (
    <select
      className="input input-sm input-quiet"
      value={filters.sortBy}
      onChange={(e) => onChange({ ...filters, sortBy: e.target.value as SortOption })}
      aria-label="Sort"
    >
      <option value="date-desc">Newest first</option>
      <option value="date-asc">Oldest first</option>
      <option value="amount-desc">Largest first</option>
      <option value="amount-asc">Smallest first</option>
      <option value="description-asc">A to Z</option>
    </select>
  )
}

export default FilterBar

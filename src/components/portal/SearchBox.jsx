import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';

/** Search field with a magnifier and a one-click clear button. */
const SearchBox = ({ value, onChange, placeholder = 'Search', label, className = '' }) => (
  <div className={`relative ${className}`}>
    <MagnifyingGlassIcon className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-ink-300" aria-hidden="true" />
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      aria-label={label || placeholder}
      className="input pl-11 pr-10"
    />
    {value && (
      <button type="button" onClick={() => onChange('')} aria-label="Clear search" className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-lg text-ink-400 hover:bg-ink-50 hover:text-ink-700">
        <XMarkIcon className="h-4 w-4" />
      </button>
    )}
  </div>
);

export default SearchBox;

import { useRef } from 'react'

export default function SearchInput({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  shortcutLabel,   // ex: "(P)rocurar"
  shortcutVariant = 'gold', // gold | green | brown
  className = '',
}) {
  const inputRef = useRef()

  const variantClass = {
    gold:  'bg-gold-dark hover:bg-gold/80 text-white',
    green: 'bg-green hover:bg-green-dark text-white',
    brown: 'bg-brown hover:bg-brown/80 text-white',
  }[shortcutVariant] ?? 'bg-gold-dark text-white'

  function handleKeyDown(e) {
    if (e.key === 'Enter') onSearch?.()
  }

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className="flex-1 bg-input-bg border border-gray-200 rounded-lg px-4 py-2.5 text-sm
                   focus:outline-none focus:ring-2 focus:ring-gold placeholder:text-gray-400"
      />
      {shortcutLabel && (
        <button
          type="button"
          onClick={onSearch}
          className={`${variantClass} font-bold text-sm px-5 py-2.5 rounded-lg transition whitespace-nowrap`}
        >
          {shortcutLabel}
        </button>
      )}
    </div>
  )
}

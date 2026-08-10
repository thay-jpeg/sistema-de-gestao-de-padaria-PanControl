export default function Input({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
  inputRef,
  onKeyDown,
}) {
  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && <label className="font-bold text-gray-800 text-sm">{label}</label>}
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={e => onChange?.(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="bg-input-bg border border-gray-200 rounded px-3 py-2 text-sm text-gray-800
                   focus:outline-none focus:ring-2 focus:ring-gold focus:border-transparent
                   disabled:opacity-50 placeholder:text-gray-400 w-full"
      />
    </div>
  )
}

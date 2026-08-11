/**
 * Variantes: green | red | brown | gold | cream
 * Tamanhos:  sm | md | lg
 * Atalho de teclado: shortcut (ex: "F9") exibido em cima do label
 */
export default function Button({
  children,
  onClick,
  variant = 'green',
  size = 'md',
  shortcut,
  disabled = false,
  className = '',
  type = 'button',
}) {
  const base = 'font-bold rounded transition active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-1'

  const variants = {
    green:  'bg-green  hover:bg-green-dark  text-white focus:ring-green',
    red:    'bg-red    hover:bg-red-dark    text-white focus:ring-red',
    brown:  'bg-brown  hover:bg-brown/80    text-white focus:ring-brown',
    gold:   'bg-gold-dark hover:bg-gold/80  text-white focus:ring-gold',
    cream:  'bg-cream  hover:bg-brown-light text-gray-800 focus:ring-gold',
  }

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-4 text-base min-w-[140px]',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={[
        base,
        variants[variant] ?? variants.green,
        sizes[size]   ?? sizes.md,
        disabled ? 'opacity-40 cursor-not-allowed' : '',
        className,
      ].join(' ')}
    >
      {shortcut && (
        <div className="text-xs font-medium opacity-80 mb-0.5 tracking-widest">{shortcut}</div>
      )}
      {children}
    </button>
  )
}

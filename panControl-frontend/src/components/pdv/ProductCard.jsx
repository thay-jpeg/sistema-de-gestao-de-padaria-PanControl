/**
 * Exibe um produto no grid estilo do protótipo:
 *  - imagem de fundo (ou placeholder)
 *  - badge dourado de preço no canto superior direito
 *  - código e nome em amarelo no rodapé do card
 */
export default function ProductCard({ product, onClick, size = 'md' }) {
  const sizes = {
    sm: 'w-[120px] h-[90px]  text-xs',
    md: 'w-[180px] h-[130px] text-xs',
    lg: 'w-[200px] h-[150px] text-sm',
  }

  const priceFormatted = product.price?.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  })

  return (
    <button
      type="button"
      onClick={() => onClick?.(product)}
      className={[
        sizes[size],
        'relative rounded-lg overflow-hidden shadow hover:shadow-md hover:scale-105 transition-transform flex-shrink-0 cursor-pointer',
      ].join(' ')}
    >
      {/* Imagem ou fundo placeholder */}
      {product.image ? (
        <img src={product.image} alt={product.name} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200" />
      )}

      {/* Overlay escuro no rodapé */}
      <div className="absolute bottom-0 left-0 right-0 bg-black/55 px-1.5 py-1 text-left">
        <p className="text-yellow-300 font-bold leading-tight">{product.code}</p>
        <p className="text-yellow-300 font-bold leading-tight truncate uppercase">{product.name}</p>
      </div>

      {/* Badge preço */}
      <div className="absolute top-1 right-1 bg-[#F1D6AB] text-yellow-700 font-bold text-[10px] px-1.5 py-0.5 rounded">
        {priceFormatted}
      </div>
    </button>
  )
}

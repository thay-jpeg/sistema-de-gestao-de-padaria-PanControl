export default function ProductCard({ product, onClick, size = 'md' }) {
  const sizes = {
    sm: 'w-[120px] h-[90px]  text-xs',
    md: 'w-[180px] h-[130px] text-xs',
    lg: 'w-[200px] h-[150px] text-sm',
  }

  const priceFormatted = product.price?.toLocaleString('pt-BR', {
    style: 'currency', currency: 'BRL',
  })

  // Mapeando os nomes exatos do seu banco de dados
  const nomeExibicao = product.nomeProduto || product.name || 'Sem Nome';
  const codigoExibicao = product.codigoBarras || product.code || 'S/C';

  // Aqui está a correção: pegando exatamente a coluna 'imagem' do seu print!
  const imagemExibicao = product.imagem || product.image;

  return (
    <button
      type="button"
      onClick={() => onClick?.(product)}
      className={[
        sizes[size],
        'relative rounded-lg overflow-hidden shadow hover:shadow-md hover:scale-105 transition-transform flex-shrink-0 cursor-pointer',
      ].join(' ')}
    >
      {/* Renderiza a imagem do banco. Se não tiver, usa o degradê */}
      {imagemExibicao ? (
        <img src={imagemExibicao} alt={nomeExibicao} className="absolute inset-0 w-full h-full object-cover" />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-br from-amber-100 to-amber-200" />
      )}

      <div className="absolute bottom-0 left-0 right-0 bg-black/60 px-1.5 py-1 text-left">
        <p className="text-yellow-300 font-bold leading-tight">{codigoExibicao}</p>
        <p className="text-yellow-300 font-bold leading-tight truncate uppercase">{nomeExibicao}</p>
      </div>

      <div className="absolute top-1 right-1 bg-[#F1D6AB] text-yellow-700 font-bold text-[10px] px-1.5 py-0.5 rounded shadow-sm">
        {priceFormatted}
      </div>
    </button>
  )
}
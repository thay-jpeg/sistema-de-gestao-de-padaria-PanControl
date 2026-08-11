/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Identidade PanControl+
        header:    '#4D3330',   // marrom escuro do topo
        brown:     '#4A3B38',   // marrom médio (cards, btns)
        'brown-light': '#ECE6D6', // creme (card Relatórios)
        gold:      '#D4A054',   // dourado (botão Procurar, scrollbar, gerenciamento card)
        'gold-dark': '#9F6619', // dourado escuro (botão Procurar)
        green:     '#307A32',   // verde (Vendas, Finalizar, Salvar)
        'green-dark': '#2F7C32',
        red:       '#C32325',   // vermelho (Catálogo, Cancelar, Excluir)
        'red-dark': '#A51E20',
        cream:     '#ECE6D6',   // fundo neutro claro
        'input-bg':'#F2F2F2',   // fundo dos inputs
        muted:     '#888888',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        fadeIn: { from: { opacity: 0, transform: 'translateY(8px)' }, to: { opacity: 1, transform: 'translateY(0)' } },
      },
      animation: {
        fadeIn: 'fadeIn 0.2s ease-out',
      },
    },
  },
  plugins: [],
}

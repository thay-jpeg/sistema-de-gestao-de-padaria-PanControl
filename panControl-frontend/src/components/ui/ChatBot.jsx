import { useState, useRef, useEffect } from 'react'
import breadImg from '@/assets/images/bread.png'
import api from '@/services/api'
import { useAuth } from '@/context/AuthContext'

export default function Chatbot() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [isTyping, setIsTyping] = useState(false)

    const { user } = useAuth()

    // msg inicial do requisito
    const [messages, setMessages] = useState([
        { sender: 'bot', text: 'Oi, eu sou o Assistente Virtual do PanControl+. Como posso te ajudar ?' }
    ])

    const messagesEndRef = useRef(null)

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages, isTyping])

    if (!user) return null;

    async function handleSend(e) {
        e?.preventDefault()
        if (!input.trim()) return

        const userText = input.trim()


        // mensagem do usuário na tela
        setMessages(prev => [...prev, { sender: 'user', text: userText }])
        setInput('')
        setIsTyping(true)

        try {
            const response = await api.post('/chatbot/perguntar', {
                texto: userText,
                sessionId: user ? String(user.codigoAcesso) : 'visitante'
            })

            setMessages(prev => [...prev, { sender: 'bot', text: response.data.resposta }])

        } catch (error) {
            console.error(error)
            setMessages(prev => [...prev, { sender: 'bot', text: "Opa, parece que perdi a conexão com o servidor. Tente novamente!" }])
        } finally {
            setIsTyping(false)
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">

            {/* ── Janela do Chat ─────────────────────────────────────────── */}
            {isOpen && (
                <div className="bg-white w-[350px] h-[450px] shadow-2xl rounded-2xl border border-gray-200 mb-4 flex flex-col overflow-hidden transition-all duration-300 transform origin-bottom-right">

                    {/* Header do Chat */}
                    <div className="bg-header p-4 flex items-center justify-between shadow-sm">
                        <div className="flex items-center gap-3">
                            <img src={breadImg} alt="Bread AI" className="w-10 h-10 rounded-full border-2 border-gold object-cover" />
                            <div>
                                <h3 className="text-white font-bold text-sm leading-tight">Bread</h3>
                                <span className="text-gold text-[10px] uppercase font-bold tracking-wider">Assistente Virtual</span>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="text-gray-300 hover:text-white transition">
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>

                    {/* Área de Mensagens */}
                    <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-3 pan-scroll">
                        {messages.map((msg, idx) => (
                            <div key={idx} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                <div className={`max-w-[85%] rounded-2xl px-4 py-2 text-sm shadow-sm whitespace-pre-line ${msg.sender === 'user'
                                    ? 'bg-gold text-gray-900 rounded-br-sm'
                                    : 'bg-white border border-gray-200 text-gray-700 rounded-bl-sm'
                                    }`}>
                                    {msg.text}
                                </div>
                            </div>
                        ))}

                        {isTyping && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex items-center gap-1">
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Área de Digitação */}
                    <form onSubmit={handleSend} className="p-3 bg-white border-t border-gray-100 flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={e => setInput(e.target.value)}
                            placeholder="Digite sua pergunta..."
                            className="flex-1 bg-input-bg border border-gray-200 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold"
                        />
                        <button
                            type="submit"
                            disabled={!input.trim() || isTyping}
                            className="bg-green text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-green-dark transition disabled:opacity-50 disabled:cursor-not-allowed flex-shrink-0"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4 ml-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}

            {/* ── Botão Flutuante (Mascote) ──────────────────────────────── */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-16 h-16 rounded-full shadow-2xl transition-transform hover:scale-110 active:scale-95 flex items-center justify-center relative ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
            >
                <img src={breadImg} alt="Abrir Chat" className="w-full h-full rounded-full object-cover border-4 border-white shadow-inner" />
                {/* Bolinha verde de status "Online" */}
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
            </button>
        </div>
    )
}
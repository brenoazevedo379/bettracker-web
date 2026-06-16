'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Historico() {
  const router = useRouter()
  const [bets, setBets] = useState([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState('TODOS')

  useEffect(() => {
    fetch('/api/bets')
      .then(res => res.json())
      .then(data => {
        setBets(data)
        setLoading(false)
      })
  }, [])

  const filtrados = filtro === 'TODOS' ? bets : bets.filter(b => b.status === filtro)

  const statusLabel = {
    PENDENTE: { label: 'Pendente', color: 'text-yellow-400 bg-yellow-400/10' },
    VENCEU: { label: 'Venceu', color: 'text-green-400 bg-green-400/10' },
    PERDEU: { label: 'Perdeu', color: 'text-red-400 bg-red-400/10' },
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
        <button onClick={() => router.push('/')} className="text-zinc-400 hover:text-white text-sm">? Voltar</button>
        <h1 className="text-xl font-bold text-green-400">Histórico de Apostas</h1>
      </header>

      <main className="p-6 max-w-2xl mx-auto space-y-4">
        <div className="flex gap-2">
          {['TODOS', 'PENDENTE', 'VENCEU', 'PERDEU'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${filtro === f ? 'bg-green-500 text-black' : 'bg-zinc-800 text-zinc-400 hover:text-white'}`}
            >
              {f === 'TODOS' ? 'Todos' : f === 'PENDENTE' ? 'Pendentes' : f === 'VENCEU' ? 'Vencidas' : 'Perdidas'}
            </button>
          ))}
        </div>

        {loading ? (
          <p className="text-zinc-500 text-sm text-center py-8">Carregando...</p>
        ) : filtrados.length === 0 ? (
          <p className="text-zinc-500 text-sm text-center py-8">Nenhuma aposta encontrada.</p>
        ) : (
          <div className="space-y-3">
            {filtrados.map(bet => (
              <div key={bet.id} className="bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-white font-medium">{bet.selecao}</p>
                  <p className="text-zinc-400 text-xs">{bet.casa} · {bet.esporte} · Odd {bet.odd}</p>
                  <p className="text-zinc-400 text-xs">Apostado: R$ {bet.valor} · Retorno: R$ {bet.retorno?.toFixed(2)}</p>
                </div>
                <span className={`text-xs font-bold px-3 py-1 rounded-full ${statusLabel[bet.status]?.color}`}>
                  {statusLabel[bet.status]?.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

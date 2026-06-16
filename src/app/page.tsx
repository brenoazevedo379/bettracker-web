'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

type Bet = {
  id: string
  selecao: string
  odd: number
  valor: number
  casa: string
  esporte: string
  status: string
  retorno: number
  telefone: string | null
  createdAt: string
}

export default function Home() {
  const router = useRouter()
  const [bets, setBets] = useState<Bet[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchBets() }, [])

  async function fetchBets() {
    const res = await fetch('/api/bets')
    const data = await res.json()
    setBets(data)
    setLoading(false)
  }

  async function updateStatus(bet: Bet, status: string) {
    await fetch(`/api/bets/${bet.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        selecao: bet.selecao,
        status,
        odd: bet.odd,
        valor: bet.valor,
        retorno: bet.retorno,
        telefone: bet.telefone,
      }),
    })

    fetchBets()
  }

  async function deleteBet(id: string) {
    await fetch(`/api/bets/${id}`, { method: 'DELETE' })
    fetchBets()
  }

  const totalApostado = bets.reduce((acc, b) => acc + b.valor, 0)
  const vencidas = bets.filter(b => b.status === 'VENCEU')
  const perdidas = bets.filter(b => b.status === 'PERDEU')
  const pendentes = bets.filter(b => b.status === 'PENDENTE')
  const lucro = vencidas.reduce((acc, b) => acc + (b.retorno - b.valor), 0) - perdidas.reduce((acc, b) => acc + b.valor, 0)
  const roi = totalApostado > 0 ? ((lucro / totalApostado) * 100).toFixed(1) : '0'
  const taxaAcerto = bets.filter(b => b.status !== 'PENDENTE').length > 0
    ? ((vencidas.length / bets.filter(b => b.status !== 'PENDENTE').length) * 100).toFixed(0) : '0'

  function getStatusLabel(status: string) {
    if (status === 'VENCEU') return { label: '✅ Venceu', color: 'text-green-400', bg: 'bg-green-500/10 border-green-500/30' }
    if (status === 'PERDEU') return { label: '❌ Perdeu', color: 'text-red-400', bg: 'bg-red-500/10 border-red-500/30' }
    if (status === 'PENDENTE') return { label: '⏳ Pendente', color: 'text-yellow-400', bg: 'bg-yellow-500/10 border-yellow-500/30' }
    return { label: status, color: 'text-zinc-400', bg: 'bg-zinc-800 border-zinc-700' }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800/50 px-6 py-4 flex items-center justify-between backdrop-blur-sm sticky top-0 z-10 bg-zinc-950/90">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎯</span>
          <h1 className="text-xl font-bold text-white">Bet<span className="text-green-400">Tracker</span> AI</h1>
        </div>
        <div className="flex gap-2">
          <button onClick={() => router.push('/historico')} className="text-zinc-400 hover:text-white text-sm px-3 py-2 rounded-lg border border-zinc-800 hover:border-zinc-600 transition-all">
            📊 Histórico
          </button>
          <button onClick={() => router.push('/ocr')} className="text-white text-sm font-bold px-3 py-2 rounded-lg border border-zinc-700 hover:border-green-500/50 hover:text-green-400 transition-all">
            📷 Ler Bilhete
          </button>
          <button onClick={() => router.push('/bets')} className="bg-green-500 hover:bg-green-400 text-black text-sm font-bold px-4 py-2 rounded-lg transition-all shadow-lg shadow-green-500/20">
            + Nova Aposta
          </button>
        </div>
      </header>

      <main className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-gradient-to-r from-green-500/10 to-zinc-900 rounded-2xl p-5 border border-green-500/20">
          <p className="text-zinc-400 text-xs uppercase tracking-widest mb-1">Resumo Geral</p>
          <div className="flex items-end gap-3">
            <p className={`text-4xl font-black ${lucro >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              R$ {lucro.toFixed(2)}
            </p>
            <p className={`text-sm font-bold mb-1 ${lucro >= 0 ? 'text-green-400/70' : 'text-red-400/70'}`}>
              {lucro >= 0 ? '▲' : '▼'} lucro total
            </p>
          </div>
          <div className="flex gap-4 mt-3">
            <span className="text-xs text-zinc-400">ROI: <span className="text-white font-bold">{roi}%</span></span>
            <span className="text-xs text-zinc-400">Acerto: <span className="text-white font-bold">{taxaAcerto}%</span></span>
            <span className="text-xs text-zinc-400">Total apostado: <span className="text-white font-bold">R$ {totalApostado.toFixed(2)}</span></span>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3">
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
            <p className="text-2xl font-black text-green-400">{vencidas.length}</p>
            <p className="text-zinc-500 text-xs mt-1">Vencidas</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
            <p className="text-2xl font-black text-red-400">{perdidas.length}</p>
            <p className="text-zinc-500 text-xs mt-1">Perdidas</p>
          </div>
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 text-center">
            <p className="text-2xl font-black text-yellow-400">{pendentes.length}</p>
            <p className="text-zinc-500 text-xs mt-1">Pendentes</p>
          </div>
        </div>

        {bets.length > 0 && (
          <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800">
            <div className="flex justify-between text-xs text-zinc-400 mb-2">
              <span>Taxa de acerto</span>
              <span className="text-white font-bold">{taxaAcerto}%</span>
            </div>
            <div className="w-full bg-zinc-800 rounded-full h-2">
              <div className="bg-green-400 h-2 rounded-full transition-all duration-500" style={{ width: `${taxaAcerto}%` }} />
            </div>
          </div>
        )}

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-zinc-300">Apostas Recentes</h2>
            <span className="text-xs text-zinc-500">{bets.length} no total</span>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 animate-pulse h-16" />
              ))}
            </div>
          ) : bets.length === 0 ? (
            <div className="bg-zinc-900 rounded-xl p-8 border border-zinc-800 text-center">
              <p className="text-4xl mb-3">🎲</p>
              <p className="text-zinc-400 text-sm">Nenhuma aposta ainda.</p>
              <button onClick={() => router.push('/bets')} className="mt-3 text-green-400 text-sm font-bold hover:underline">
                Adicionar primeira aposta →
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {bets.map(bet => {
                const s = getStatusLabel(bet.status)
                return (
                  <div key={bet.id} className={`rounded-xl px-4 py-3 border ${s.bg} space-y-2 transition-all`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{bet.selecao}</p>
                        <div className="flex gap-2 mt-0.5">
                          <span className="text-zinc-400 text-xs">{bet.casa}</span>
                          <span className="text-zinc-600 text-xs">·</span>
                          <span className="text-zinc-400 text-xs">Odd {bet.odd}</span>
                          <span className="text-zinc-600 text-xs">·</span>
                          <span className="text-zinc-400 text-xs">R$ {bet.valor}</span>
                        </div>
                      </div>
                      <span className={`text-xs font-bold ml-2 ${s.color}`}>
                        {s.label}
                      </span>
                    </div>
                    {bet.status === 'PENDENTE' && (
                      <div className="flex gap-2 pt-1">
                        <button onClick={() => updateStatus(bet, 'VENCEU')} className="flex-1 bg-green-500/20 hover:bg-green-500/40 text-green-400 text-xs font-bold py-1.5 rounded-lg transition-colors">
                          ✅ Venceu
                        </button>
                        <button onClick={() => updateStatus(bet, 'PERDEU')} className="flex-1 bg-red-500/20 hover:bg-red-500/40 text-red-400 text-xs font-bold py-1.5 rounded-lg transition-colors">
                          ❌ Perdeu
                        </button>
                        <button onClick={() => deleteBet(bet.id)} className="bg-zinc-800 hover:bg-zinc-700 text-zinc-400 text-xs font-bold px-3 py-1.5 rounded-lg transition-colors">
                          🗑️
                        </button>
                      </div>
                    )}
                    {bet.status !== 'PENDENTE' && (
                      <div className="flex justify-between items-center pt-1">
                        <span className="text-xs text-zinc-500">
                          Retorno: <span className="text-white font-bold">R$ {bet.retorno.toFixed(2)}</span>
                        </span>
                        <button onClick={() => deleteBet(bet.id)} className="text-zinc-600 hover:text-red-400 text-xs transition-colors">
                          🗑️
                        </button>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
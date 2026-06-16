'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NovaBet() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [erro, setErro] = useState('')
  const [form, setForm] = useState({
    selecao: '',
    odd: '',
    valor: '',
    casa: '',
    esporte: '',
  })

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  async function handleSubmit() {
    setErro('')
    if (!form.selecao || !form.odd || !form.valor || !form.casa || !form.esporte) {
      setErro('Preencha todos os campos.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) throw new Error()
      router.push('/')
    } catch {
      setErro('Erro ao salvar. Tente novamente.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white">
      <header className="border-b border-zinc-800 px-6 py-4 flex items-center gap-4">
        <a href="/" className="text-zinc-400 hover:text-white text-sm">← Voltar</a>
        <h1 className="text-xl font-bold text-green-400">Nova Aposta</h1>
      </header>

      <main className="p-6 max-w-lg mx-auto space-y-4">
        {erro && (
          <div className="bg-red-500/10 border border-red-500 text-red-400 px-4 py-3 rounded-lg text-sm">
            {erro}
          </div>
        )}

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Seleção</label>
          <input
            name="selecao"
            value={form.selecao}
            onChange={handleChange}
            type="text"
            placeholder="Ex: Vitória vence"
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Odd</label>
            <input
              name="odd"
              value={form.odd}
              onChange={handleChange}
              type="number"
              placeholder="Ex: 2.50"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-zinc-400">Valor (R$)</label>
            <input
              name="valor"
              value={form.valor}
              onChange={handleChange}
              type="number"
              placeholder="Ex: 50"
              className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Casa de Apostas</label>
          <input
            name="casa"
            value={form.casa}
            onChange={handleChange}
            type="text"
            placeholder="Ex: Bet365, Betano..."
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white placeholder-zinc-500 focus:outline-none focus:border-green-500"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-zinc-400">Esporte</label>
          <select
            name="esporte"
            value={form.esporte}
            onChange={handleChange}
            className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-green-500"
          >
            <option value="">Selecione...</option>
            <option value="football">Futebol</option>
            <option value="basketball">Basquete</option>
            <option value="tennis">Tênis</option>
            <option value="other">Outro</option>
          </select>
        </div>

        {form.odd && form.valor && (
          <div className="bg-zinc-900 border border-zinc-700 rounded-lg px-4 py-3 text-sm text-zinc-400">
            Retorno potencial:{' '}
            <span className="text-green-400 font-bold">
              R$ {(parseFloat(form.odd) * parseFloat(form.valor)).toFixed(2)}
            </span>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-green-500 hover:bg-green-400 disabled:bg-zinc-700 disabled:text-zinc-500 text-black font-bold py-3 rounded-lg transition-colors"
        >
          {loading ? 'Salvando...' : 'Salvar Aposta'}
        </button>
      </main>
    </div>
  )
}
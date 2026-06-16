'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function OCRPage() {
  const router = useRouter()
  const [image, setImage] = useState(null)
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [resultado, setResultado] = useState(null)
  const [erro, setErro] = useState(null)

  function handleImage(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setImage(file)
    setPreview(URL.createObjectURL(file))
    setResultado(null)
    setErro(null)
  }

  async function analisar() {
    if (!image) return
    setLoading(true)
    setErro(null)
    try {
      const formData = new FormData()
      formData.append('image', image)
      const res = await fetch('/api/ocr', { method: 'POST', body: formData })
      const data = await res.json()
      if (data.error) throw new Error(data.error)
      setResultado(data)
    } catch (e) {
      setErro(e.message)
    } finally {
      setLoading(false)
    }
  }

  async function salvar() {
    if (!resultado) return
    setLoading(true)
    try {
      await fetch('/api/bets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          selecao: resultado.selecao,
          odd: resultado.odd,
          valor: resultado.valor,
          casa: resultado.casa,
          esporte: 'football',
          status: resultado.resultado,
        }),
      })
      router.push('/')
    } catch {
      setErro('Erro ao salvar aposta')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <h1 className="text-xl font-bold text-green-400 mb-6">Ler Bilhete com IA</h1>
      <div className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 space-y-4">
        <label className="cursor-pointer bg-green-500 hover:bg-green-400 text-black font-bold px-4 py-3 rounded-lg inline-block transition-colors">
          Escolher foto do bilhete
          <input type="file" accept="image/*" onChange={handleImage} className="hidden" />
        </label>
        {preview && <img src={preview} alt="Bilhete" className="rounded-lg max-h-64 object-contain" />}
        {image && !resultado && (
          <button onClick={analisar} disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg disabled:opacity-50">
            {loading ? 'Analisando...' : 'Analisar com IA'}
          </button>
        )}
        {erro && <p className="text-red-400 text-sm">{erro}</p>}
        {resultado && (
          <div className="space-y-3">
            <div className="bg-zinc-800 rounded-lg p-3 space-y-1 text-sm">
              <p><span className="text-zinc-400">Selecao:</span> {resultado.selecao}</p>
              <p><span className="text-zinc-400">Odd:</span> {resultado.odd}</p>
              <p><span className="text-zinc-400">Valor:</span> R$ {resultado.valor}</p>
              <p><span className="text-zinc-400">Casa:</span> {resultado.casa}</p>
              <p><span className="text-zinc-400">Resultado:</span> {resultado.resultado}</p>
            </div>
            <button onClick={salvar} disabled={loading} className="w-full bg-green-500 hover:bg-green-400 text-black font-bold py-2 rounded-lg disabled:opacity-50">
              {loading ? 'Salvando...' : 'Salvar Aposta'}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
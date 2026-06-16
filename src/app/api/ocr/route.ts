import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const image = formData.get('image') as File
    if (!image) return NextResponse.json({ error: 'Imagem nao enviada' }, { status: 400 })

    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) return NextResponse.json({ error: 'Sem chave' }, { status: 500 })

    const bytes = await image.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const mimeType = image.type

    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + apiKey

    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: 'Retorne APENAS JSON com os campos: selecao, odd, valor, casa, resultado (VENCEU, PERDEU ou PENDENTE). Sem markdown.' },
            { inline_data: { mime_type: mimeType, data: base64 } }
          ]
        }]
      })
    })

    const data = await res.json()
    console.log('STATUS:', res.status)
    console.log('GEMINI FULL:', JSON.stringify(data).slice(0, 500))

    if (!res.ok) {
      return NextResponse.json({ error: 'Erro Gemini: ' + JSON.stringify(data) }, { status: 500 })
    }

    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || ''
    console.log('TEXT:', text)
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) throw new Error('Resposta invalida: ' + text)
    const parsed = JSON.parse(jsonMatch[0])
    return NextResponse.json(parsed)
  } catch (error) {
    console.error('OCR ERROR:', error)
    return NextResponse.json({ error: 'Erro ao processar imagem' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import twilio from 'twilio'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { selecao, status, odd, valor, retorno } = body

    const accountSid = process.env.TWILIO_ACCOUNT_SID
    const authToken = process.env.TWILIO_AUTH_TOKEN
    const from = process.env.TWILIO_WHATSAPP_FROM
    const to = process.env.TWILIO_WHATSAPP_TO

    if (!accountSid || !authToken || !from || !to) {
      return NextResponse.json({ error: 'Credenciais Twilio não configuradas' }, { status: 500 })
    }

    const client = twilio(accountSid, authToken)

    const emoji = status === 'VENCEU' ? '✅' : '❌'
    const mensagem = `${emoji} *BetTracker AI*\n\n*Aposta atualizada!*\n\n🎯 Seleção: ${selecao}\n📊 Odd: ${odd}\n💰 Valor: R$ ${valor}\n💵 Retorno: R$ ${retorno}\n📌 Status: ${status === 'VENCEU' ? '✅ Venceu' : '❌ Perdeu'}`

    await client.messages.create({
      from,
      to,
      body: mensagem,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('NOTIFY ERROR:', error)
    return NextResponse.json({ error: 'Erro ao enviar notificação' }, { status: 500 })
  }
}
import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { selecao, odd, valor, casa, esporte } = body

    if (!selecao || !odd || !valor || !casa || !esporte) {
      return NextResponse.json(
        { error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      )
    }

    const bet = await prisma.bet.create({
      data: {
        selecao,
        odd: parseFloat(odd),
        valor: parseFloat(valor),
        casa,
        esporte,
        retorno: parseFloat(valor) * parseFloat(odd),
      },
    })

    return NextResponse.json(bet, { status: 201 })
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao salvar aposta' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const bets = await prisma.bet.findMany({
      orderBy: { createdAt: 'desc' },
    })
    return NextResponse.json(bets)
  } catch (error) {
    return NextResponse.json(
      { error: 'Erro ao buscar apostas' },
      { status: 500 }
    )
  }
}
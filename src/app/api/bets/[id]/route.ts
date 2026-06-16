import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PATCH(
  request: Request,
  context: any
) {
  try {
    const { id } = await context.params
    const body = await request.json()
    const bet = await prisma.bet.update({
      where: { id },
      data: { status: body.status },
    })
    return NextResponse.json(bet)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar aposta' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  context: any
) {
  try {
    const { id } = await context.params
    await prisma.bet.delete({ where: { id } })
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao deletar aposta' }, { status: 500 })
  }
}

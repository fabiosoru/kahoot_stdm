import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkAdminSession } from '@/lib/session'

export async function GET(_req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const questions = await prisma.question.findMany({
      where: { quizId: id },
      include: { choices: true },
      orderBy: { order: 'asc' },
    })

    return NextResponse.json(questions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

export async function POST(req: NextRequest, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params
  try {
    const isAdmin = await checkAdminSession()
    if (!isAdmin) {
      return NextResponse.json({ error: 'Non autorisé' }, { status: 401 })
    }

    const body = await req.json()
    const { text, timeLimit, points, order, choices } = body

    if (!text || !choices || choices.length < 2) {
      return NextResponse.json(
        { error: 'Texte de question et au moins 2 réponses requises' },
        { status: 400 }
      )
    }

    if (!choices.some((c: { isCorrect: boolean }) => c.isCorrect)) {
      return NextResponse.json(
        { error: 'Au moins une réponse correcte requise' },
        { status: 400 }
      )
    }

    const question = await prisma.question.create({
      data: {
        quizId: id,
        text,
        timeLimit,
        points,
        order,
        choices: {
          create: choices.map((c: { text: string; isCorrect: boolean }) => ({
            text: c.text,
            isCorrect: c.isCorrect,
          })),
        },
      },
      include: { choices: true },
    })

    return NextResponse.json(question)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

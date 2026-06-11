import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const body = await req.json()
    const { firstName, lastName, company } = body as { firstName: string; lastName: string; company: string }

    if (!firstName || !lastName || !company) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quiz = await prisma.quiz.findUnique({
      where: { accessCode: code },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (!quiz.isActive) {
      return NextResponse.json({ error: 'Quiz is not active' }, { status: 403 })
    }

    const existing = await prisma.participant.findUnique({
      where: {
        quizId_firstName_lastName: {
          quizId: quiz.id,
          firstName,
          lastName,
        },
      },
    })

    if (existing) {
      return NextResponse.json(
        { error: 'You have already participated in this quiz' },
        { status: 409 }
      )
    }

    const participant = await prisma.participant.create({
      data: {
        quizId: quiz.id,
        firstName,
        lastName,
        company,
      },
    })

    return NextResponse.json({
      participantId: participant.id,
      token: participant.token,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

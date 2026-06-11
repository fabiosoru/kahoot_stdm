import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    await context.params
    const token = req.headers.get('x-participant-token')
    const body = await req.json()
    const { questionId, choiceId, timeSpent } = body as { questionId: string; choiceId: string | null; timeSpent: number }

    if (!token) {
      return NextResponse.json({ error: 'Participant token required' }, { status: 401 })
    }

    if (!questionId) {
      return NextResponse.json({ error: 'Missing questionId' }, { status: 400 })
    }

    const participant = await prisma.participant.findUnique({
      where: { token },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    const existingAnswer = await prisma.answer.findUnique({
      where: {
        participantId_questionId: {
          participantId: participant.id,
          questionId,
        },
      },
    })

    if (existingAnswer) {
      await prisma.answer.update({
        where: { id: existingAnswer.id },
        data: {
          choiceId: choiceId || null,
          timeSpent: timeSpent || 0,
          answeredAt: new Date(),
        },
      })
    } else {
      await prisma.answer.create({
        data: {
          participantId: participant.id,
          questionId,
          choiceId: choiceId || null,
          timeSpent: timeSpent || 0,
        },
      })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

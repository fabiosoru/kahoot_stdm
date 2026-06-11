import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getRank } from '@/lib/scoring'

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    await context.params
    const token = req.headers.get('x-participant-token')

    if (!token) {
      return NextResponse.json({ error: 'Participant token required' }, { status: 401 })
    }

    const participant = await prisma.participant.findUnique({
      where: { token },
      include: {
        answers: {
          include: {
            choice: true,
            question: true,
          },
        },
      },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    let score = 0
    for (const answer of participant.answers) {
      if (answer.choice?.isCorrect) {
        score += answer.question.points
      }
    }

    await prisma.participant.update({
      where: { id: participant.id },
      data: {
        score,
        completedAt: new Date(),
      },
    })

    const rank = await getRank(participant.id)

    return NextResponse.json({
      score,
      rank,
      totalQuestions: participant.answers.length,
      correctAnswers: participant.answers.filter((a: any) => a.choice?.isCorrect).length,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const token = req.headers.get('x-participant-token')

    if (!token) {
      return NextResponse.json({ error: 'Participant token required' }, { status: 401 })
    }

    const participant = await prisma.participant.findUnique({
      where: { token },
      include: { quiz: true },
    })

    if (!participant) {
      return NextResponse.json({ error: 'Participant not found' }, { status: 404 })
    }

    if (participant.quiz.accessCode !== code) {
      return NextResponse.json({ error: 'Invalid quiz code' }, { status: 403 })
    }

    const questions = await prisma.question.findMany({
      where: { quizId: participant.quizId },
      select: {
        id: true,
        text: true,
        imageUrl: true,
        timeLimit: true,
        order: true,
        choices: {
          select: {
            id: true,
            text: true,
          },
        },
      },
      orderBy: { order: 'asc' },
    })

    const shuffledQuestions = questions.map((q: any) => ({
      ...q,
      choices: q.choices.sort(() => Math.random() - 0.5),
    }))

    return NextResponse.json(shuffledQuestions)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

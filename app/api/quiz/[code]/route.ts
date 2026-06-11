import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const quiz = await prisma.quiz.findUnique({
      where: { accessCode: code },
      include: {
        questions: {
          select: {
            id: true,
            text: true,
            imageUrl: true,
            timeLimit: true,
            points: true,
            order: true,
          },
          orderBy: { order: 'asc' },
        },
      },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    if (!quiz.isActive) {
      return NextResponse.json({ error: 'Quiz is not active' }, { status: 403 })
    }

    return NextResponse.json({
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      questionCount: quiz.questions.length,
      questions: quiz.questions,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

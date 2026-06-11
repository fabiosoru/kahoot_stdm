import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getLeaderboard } from '@/lib/scoring'

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ code: string }> }
) {
  try {
    const { code } = await context.params
    const quiz = await prisma.quiz.findUnique({
      where: { accessCode: code },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz not found' }, { status: 404 })
    }

    const leaderboard = await getLeaderboard(quiz.id, 10)

    const total = await prisma.participant.count({
      where: {
        quizId: quiz.id,
        completedAt: { not: null },
      },
    })

    return NextResponse.json({
      leaderboard,
      total,
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

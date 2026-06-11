import { prisma } from './db'

export async function calculateScore(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
    include: {
      answers: {
        include: {
          choice: true,
          question: true,
        },
      },
    },
  })

  if (!participant) return 0

  let score = 0
  for (const answer of participant.answers) {
    if (answer.choice?.isCorrect) {
      score += answer.question.points
    }
  }

  return score
}

export async function getRank(participantId: string) {
  const participant = await prisma.participant.findUnique({
    where: { id: participantId },
  })

  if (!participant) return null

  const betterScores = await prisma.participant.count({
    where: {
      quizId: participant.quizId,
      completedAt: { not: null },
      score: { gt: participant.score },
    },
  })

  const totalCompleted = await prisma.participant.count({
    where: {
      quizId: participant.quizId,
      completedAt: { not: null },
    },
  })

  return {
    rank: betterScores + 1,
    total: totalCompleted,
  }
}

export async function getLeaderboard(quizId: string, limit: number = 10) {
  const leaderboard = await prisma.participant.findMany({
    where: {
      quizId,
      completedAt: { not: null },
    },
    orderBy: { score: 'desc' },
    take: limit,
    select: {
      id: true,
      firstName: true,
      lastName: true,
      score: true,
      completedAt: true,
    },
  })

  return leaderboard
}

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

    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    })

    if (!quiz) {
      return NextResponse.json({ error: 'Quiz non trouvé' }, { status: 404 })
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 })
  }
}

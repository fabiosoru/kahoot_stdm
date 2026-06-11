import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { checkAdminSession } from '@/lib/session'

export async function GET() {
  try {
    const isAuth = await checkAdminSession()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        description: true,
        accessCode: true,
        isActive: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    })

    return NextResponse.json(quizzes)
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const isAuth = await checkAdminSession()
    if (!isAuth) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await req.json()
    const { title, description, accessCode } = body as { title: string; description: string | undefined; accessCode: string }

    if (!title || !accessCode) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const quiz = await prisma.quiz.create({
      data: { title, description, accessCode },
    })

    return NextResponse.json(quiz, { status: 201 })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

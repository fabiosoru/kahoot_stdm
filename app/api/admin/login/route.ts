import { NextRequest, NextResponse } from 'next/server'
import { adminLogin } from '@/lib/session'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { password } = body as { password: string }

    if (!password) {
      return NextResponse.json({ error: 'Password required' }, { status: 400 })
    }

    const success = await adminLogin(password)
    if (!success) {
      return NextResponse.json({ error: 'Invalid password' }, { status: 401 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

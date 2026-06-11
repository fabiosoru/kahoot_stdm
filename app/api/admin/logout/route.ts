import { NextResponse } from 'next/server'
import { adminLogout } from '@/lib/session'

export async function POST() {
  try {
    await adminLogout()
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

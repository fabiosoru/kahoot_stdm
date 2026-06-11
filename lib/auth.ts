import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function createToken() {
  return jwt.sign({ role: 'admin' }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET)
  } catch {
    return null
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies()
  cookieStore.set('admin_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7,
  })
}

export async function getAuthToken() {
  const cookieStore = await cookies()
  return cookieStore.get('admin_token')?.value
}

export async function removeAuthCookie() {
  const cookieStore = await cookies()
  cookieStore.delete('admin_token')
}

export async function checkAdminAuth() {
  const token = await getAuthToken()
  if (!token) return false
  return verifyToken(token) !== null
}

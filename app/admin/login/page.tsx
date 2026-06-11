'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Invalid password')
      }

      router.push('/admin')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-10 right-10 w-40 h-40 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-md w-full relative z-10">
        {/* Logo area */}
        <div className="text-center mb-8 animate-bounce-in">
          <div className="text-7xl mb-4">🎯</div>
          <h1 className="text-5xl font-black text-white mb-2">KAHOOT</h1>
          <p className="text-brand-green text-xl font-bold">Journée Santé & Sécurité</p>
        </div>

        {/* Card */}
        <div className="kahoot-card p-10 animate-slide-in">
          <h2 className="text-3xl font-black text-brand-blue mb-8 text-center">Connexion Admin</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-brand-blue font-bold text-lg mb-3">
                Mot de passe
              </label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-6 py-3 border-4 border-brand-blue rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green focus:border-brand-green text-lg font-semibold"
                required
              />
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-red-500 text-red-700 px-6 py-4 rounded-xl font-bold text-center animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full kahoot-button-green text-xl py-4 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? '⏳ Vérification...' : '🔓 Se connecter'}
            </button>
          </form>

          <div className="mt-8 p-4 bg-blue-50 border-l-4 border-brand-green rounded">
            <p className="text-gray-700 text-sm font-semibold">
              💡 <strong>Mot de passe par défaut:</strong>
            </p>
            <code className="bg-brand-blue text-white px-3 py-2 rounded font-mono font-bold block mt-2 text-center">
              admin123
            </code>
          </div>
        </div>

        <p className="text-center text-white text-sm mt-8 opacity-75">
          Interface de gestion des quiz
        </p>
      </div>
    </div>
  )
}

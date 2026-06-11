'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'

export default function AdminLogin() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

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
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      <header className="app-header">
        <div className="container-base py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <IconSet.Award size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-brand-blue">Quiz Hub</h1>
              <p className="text-xs text-gray-500">Santé & Sécurité</p>
            </div>
          </Link>
        </div>
      </header>

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center animate-slide-up">
            <div className="w-16 h-16 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconSet.Settings size={32} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Panneau Admin</h1>
            <p className="text-gray-600 mt-2">Gérez vos quiz et participants</p>
          </div>

          <form onSubmit={handleSubmit} className="card p-8 space-y-6 animate-slide-up">
            {/* Password Field */}
            <div>
              <label className="label">Mot de passe</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Entrez votre mot de passe"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <IconSet.EyeOff size={18} />
                  ) : (
                    <IconSet.Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="alert alert-error flex items-start gap-3">
                <IconSet.AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Erreur</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full btn btn-primary disabled:opacity-50"
            >
              {loading ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Vérification...
                </>
              ) : (
                <>
                  <IconSet.LogOut size={16} className="rotate-180" />
                  Se connecter
                </>
              )}
            </button>

            {/* Home Link */}
            <div className="text-center">
              <Link href="/" className="text-sm text-brand-blue hover:underline">
                Retour à l&apos;accueil
              </Link>
            </div>
          </form>

          {/* Info */}
          <div className="mt-6 card p-4 bg-blue-50 border-blue-200 animate-slide-up">
            <div className="flex gap-3">
              <IconSet.Info size={18} className="text-brand-blue flex-shrink-0 mt-0.5" />
              <div className="text-xs text-brand-blue">
                <p className="font-semibold mb-1">Mode démo</p>
                <p>Mot de passe : <code className="bg-white px-2 py-0.5 rounded font-mono">admin123</code></p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6">
        <div className="container-base text-center text-sm text-gray-600">
          <p>© 2026 Groupe RATP Dev • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconSet } from '@/components/Icon'
import Image from 'next/image'

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
      <Header />

      {/* Login Form */}
      <main className="flex-1 flex items-center justify-center py-12 px-4">
        <div className="w-full max-w-md">
          <div className="mb-8 text-center animate-slide-up">
            <Image
              src="/affiche.png"
              alt="Affiche Journée Santé & Sécurité"
              width={300}
              height={300}
              className="h-auto w-full max-w-2xl"
              style={{ margin: 0, display: 'block', marginTop: '-5vh', marginBottom: '-5vh' }}
              priority
            />
            <h1 className="text-3xl font-bold text-gray-900">Accès Administrateur</h1>
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
                <p className="font-semibold mb-1">Accès Admin</p>
                <p>Mot de passe fourni par l'administrateur système</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer compact={true} />
    </div>
  )
}

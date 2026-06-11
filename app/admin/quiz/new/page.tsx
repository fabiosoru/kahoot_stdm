'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

export default function NewQuiz() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    accessCode: '',
  })

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/admin/quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to create quiz')
      }

      const quiz = await res.json()
      router.push(`/admin/quiz/${quiz.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const generateAccessCode = () => {
    const code = Math.random().toString(36).substring(2, 10).toUpperCase()
    setFormData({ ...formData, accessCode: code })
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/admin" backLabel="Dashboard" />

      {/* Main Content */}
      <main className="container-base max-w-2xl py-12 flex-1">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Créer un Quiz</h1>
          <p className="text-gray-600">Configurez les paramètres de base de votre quiz</p>
        </div>

        <div className="card p-8 animate-slide-up">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className="label">Titre du Quiz *</label>
              <input
                type="text"
                required
                placeholder="Ex: Journée Santé & Sécurité 2026"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="input"
              />
            </div>

            {/* Description */}
            <div>
              <label className="label">Description</label>
              <textarea
                placeholder="Description optionnelle du quiz..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input min-h-[100px]"
              />
            </div>

            {/* Access Code */}
            <div>
              <div className="flex justify-between items-end gap-4">
                <div className="flex-1">
                  <label className="label">Code d'Accès *</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: SANTE2026"
                    value={formData.accessCode}
                    onChange={(e) => setFormData({ ...formData, accessCode: e.target.value.toUpperCase() })}
                    className="input font-mono"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Code unique pour accéder au quiz
                  </p>
                </div>
                <button
                  type="button"
                  onClick={generateAccessCode}
                  className="btn btn-secondary btn-sm"
                >
                  <IconSet.Share2 size={16} />
                  Générer
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

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-gray-200">
              <Link href="/admin" className="flex-1">
                <button type="button" className="w-full btn btn-secondary">
                  <IconSet.X size={16} />
                  Annuler
                </button>
              </Link>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 btn btn-primary disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <span className="animate-spin">⟳</span>
                    Création...
                  </>
                ) : (
                  <>
                    <IconSet.Plus size={16} />
                    Créer le Quiz
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Info Box */}
        <div className="mt-8 card p-4 bg-blue-50 border-blue-200">
          <div className="flex gap-3">
            <IconSet.Info size={20} className="text-brand-blue flex-shrink-0" />
            <div>
              <p className="text-sm text-brand-blue font-semibold">
                Vous pourrez ajouter les questions après la création du quiz
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

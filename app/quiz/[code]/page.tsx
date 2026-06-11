'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'

interface Quiz {
  id: string
  title: string
  description?: string
  questionCount: number
}

export default function QuizLanding() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    company: 'Champagne Mobilités',
  })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${code}`)
        if (!res.ok) throw new Error('Quiz not found')
        const data = await res.json()
        setQuiz(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load quiz')
      } finally {
        setLoading(false)
      }
    }
    fetchQuiz()
  }, [code])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const res = await fetch(`/api/quiz/${code}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to join quiz')
      }

      const data = await res.json()
      localStorage.setItem('participant_token', data.token)
      localStorage.setItem('participant_id', data.participantId)
      router.push(`/quiz/${code}/play`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-gray-600 font-semibold">Chargement du quiz...</p>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-white">
        <header className="app-header">
          <div className="container-base py-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
                <IconSet.Award size={24} className="text-white" />
              </div>
              <h1 className="text-xl font-bold text-brand-blue">Quiz Hub</h1>
            </Link>
          </div>
        </header>

        <main className="container-base flex items-center justify-center py-24">
          <div className="card p-12 max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconSet.AlertCircle size={32} className="text-red-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Quiz non trouvé</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link href="/">
              <button className="btn btn-primary w-full">
                <IconSet.ChevronRight size={16} className="rotate-180" />
                Retour à l&apos;accueil
              </button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="app-header">
        <div className="container-base py-4">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <IconSet.Award size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-brand-blue">Quiz Hub</h1>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-base max-w-2xl py-12">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-gray-600">{quiz.description}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 text-center animate-slide-up">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <IconSet.Clock size={24} className="text-brand-blue" />
            </div>
            <p className="text-sm text-gray-600">Questions</p>
            <p className="text-3xl font-bold text-gray-900">{quiz.questionCount}</p>
          </div>

          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '50ms' }}>
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <IconSet.TrendingUp size={24} className="text-brand-green" />
            </div>
            <p className="text-sm text-gray-600">Points</p>
            <p className="text-3xl font-bold text-gray-900">{quiz.questionCount * 100}</p>
          </div>

          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '100ms' }}>
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
              <IconSet.Users size={24} className="text-brand-blue" />
            </div>
            <p className="text-sm text-gray-600">Participants</p>
            <p className="text-3xl font-bold text-gray-900">?</p>
          </div>
        </div>

        {/* Form Card */}
        <div className="card p-8 animate-slide-up">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Votre Profil</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* First Name */}
            <div>
              <label className="label">Prénom *</label>
              <input
                type="text"
                required
                placeholder="Ex: Marie"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="input"
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="label">Nom *</label>
              <input
                type="text"
                required
                placeholder="Ex: Dupont"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="input"
              />
            </div>

            {/* Company */}
            <div>
              <label className="label">Entreprise *</label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="input"
              >
                <option value="Champagne Mobilités">Champagne Mobilités</option>
                <option value="STDM">STDM</option>
              </select>
            </div>

            {/* Error */}
            {error && (
              <div className="alert alert-error flex items-start gap-3">
                <IconSet.AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Erreur</p>
                  <p className="text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full btn btn-primary btn-lg disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <span className="animate-spin">⟳</span>
                  Démarrage...
                </>
              ) : (
                <>
                  <IconSet.ChevronRight size={18} />
                  Commencer le Quiz
                </>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-16">
        <div className="container-base text-center text-sm text-gray-600">
          <p>© 2026 Groupe RATP Dev • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

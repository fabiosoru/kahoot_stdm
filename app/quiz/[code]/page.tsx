'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
        <div className="animate-bounce-in">
          <div className="text-white text-3xl font-black">⏳ Chargement du quiz...</div>
        </div>
      </div>
    )
  }

  if (!quiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center p-4">
        <div className="kahoot-card p-10 max-w-md w-full text-center animate-bounce-in">
          <div className="text-5xl mb-4">❌</div>
          <h1 className="text-3xl font-black text-red-600 mb-4">Quiz non trouvé</h1>
          <p className="text-gray-600 text-lg">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute top-20 right-20 w-48 h-48 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-20 left-20 w-48 h-48 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-2xl w-full relative z-10">
        {/* Quiz Header */}
        <div className="text-center mb-10 animate-slide-in">
          <div className="text-6xl mb-4">🎯</div>
          <h1 className="text-5xl font-black text-white mb-3">{quiz.title}</h1>
          {quiz.description && (
            <p className="text-brand-green text-xl font-bold">{quiz.description}</p>
          )}
        </div>

        {/* Main Card */}
        <div className="kahoot-card p-10 animate-bounce-in">
          {/* Quiz Info */}
          <div className="bg-gradient-to-r from-brand-blue to-blue-800 text-white rounded-2xl p-8 mb-10 text-center">
            <div className="text-5xl font-black mb-3">{quiz.questionCount}</div>
            <p className="text-xl font-bold">Questions à répondre</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-brand-blue font-black text-lg mb-3">
                Prénom
              </label>
              <input
                type="text"
                placeholder="Ex: Jean"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full px-6 py-4 border-4 border-brand-blue rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green text-lg font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-brand-blue font-black text-lg mb-3">
                Nom
              </label>
              <input
                type="text"
                placeholder="Ex: Dupont"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full px-6 py-4 border-4 border-brand-blue rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green text-lg font-semibold"
                required
              />
            </div>

            <div>
              <label className="block text-brand-blue font-black text-lg mb-3">
                Entreprise
              </label>
              <select
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="w-full px-6 py-4 border-4 border-brand-blue rounded-xl focus:outline-none focus:ring-4 focus:ring-brand-green text-lg font-semibold"
              >
                <option value="Champagne Mobilités">🚌 Champagne Mobilités</option>
                <option value="STDM">🚍 STDM</option>
              </select>
            </div>

            {error && (
              <div className="bg-red-100 border-4 border-red-500 text-red-700 px-6 py-4 rounded-xl font-bold text-center animate-shake">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full kahoot-button-green text-2xl py-5 font-black disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {submitting ? '⏳ Chargement...' : '🚀 Commencer le Quiz'}
            </button>
          </form>

          <p className="text-center text-gray-500 text-sm mt-8 font-semibold">
            ⏱️ Préparez-vous ! Le quiz va commencer.
          </p>
        </div>
      </div>
    </div>
  )
}

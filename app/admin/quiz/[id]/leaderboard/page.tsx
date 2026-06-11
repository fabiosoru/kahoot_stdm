'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'

interface Leaderboard {
  rank: number
  firstName: string
  lastName: string
  company: string
  score: number
  completedAt: string | null
}

interface Quiz {
  title: string
  accessCode: string
}

export default function AdminLeaderboard() {
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [leaderboard, setLeaderboard] = useState<Leaderboard[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/quiz/${quizId}`)
      if (!res.ok) throw new Error('Failed to load quiz')
      const quizData = await res.json()
      setQuiz(quizData)

      const leaderboardRes = await fetch(`/api/quiz/${quizData.accessCode}/leaderboard`)
      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json()
        setLeaderboard(data.leaderboard || [])
      }
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 5000)
    return () => clearInterval(interval)
  }, [fetchData])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-gray-600 font-semibold">Chargement du classement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="app-header">
        <div className="container-base py-4 flex justify-between items-center">
          <Link href={`/admin/quiz/${quizId}`} className="flex items-center gap-2">
            <IconSet.ChevronRight size={20} className="rotate-180 text-gray-600" />
            <span className="font-semibold text-gray-700">Retour</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-base max-w-4xl py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <IconSet.TrendingUp size={28} className="text-brand-blue" />
            Classement
          </h1>
          {quiz && (
            <p className="text-gray-600">
              Quiz: <span className="font-semibold">{quiz.title}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-6 flex items-start gap-3">
            <IconSet.AlertCircle size={20} className="flex-shrink-0" />
            <div>{error}</div>
          </div>
        )}

        {leaderboard.length === 0 ? (
          <div className="card p-12 text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconSet.Users size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun participant</h3>
            <p className="text-gray-600">
              Les participants apparaîtront ici quand ils compléteront le quiz.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {leaderboard.map((entry, idx) => (
              <div
                key={idx}
                className={`card p-4 flex items-center justify-between ${
                  idx < 3 ? 'border-l-4 border-brand-green' : ''
                } animate-slide-up`}
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex items-center gap-4 flex-1">
                  {/* Rank Badge */}
                  <div className="flex-shrink-0">
                    {idx === 0 && (
                      <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🥇</span>
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="w-12 h-12 bg-gradient-to-br from-gray-300 to-gray-400 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🥈</span>
                      </div>
                    )}
                    {idx === 2 && (
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-lg">🥉</span>
                      </div>
                    )}
                    {idx >= 3 && (
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-gray-600 font-bold">{idx + 1}</span>
                      </div>
                    )}
                  </div>

                  {/* Name & Company */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">
                      {entry.firstName} {entry.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{entry.company}</p>
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="text-2xl font-bold text-brand-blue">{entry.score}</div>
                  <p className="text-xs text-gray-500">points</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 grid sm:grid-cols-3 gap-4">
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-brand-blue mb-1">{leaderboard.length}</div>
            <p className="text-sm text-gray-600">Participants</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-brand-green mb-1">
              {leaderboard.filter((e) => e.completedAt).length}
            </div>
            <p className="text-sm text-gray-600">Complétés</p>
          </div>
          <div className="card p-6 text-center">
            <div className="text-3xl font-bold text-brand-blue mb-1">
              {leaderboard.length > 0
                ? Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length)
                : 0}
            </div>
            <p className="text-sm text-gray-600">Score moyen</p>
          </div>
        </div>
      </main>
    </div>
  )
}

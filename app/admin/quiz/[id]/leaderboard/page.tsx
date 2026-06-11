'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
      if (!res.ok) throw new Error('Impossible de charger le quiz')
      const quizData = await res.json()
      setQuiz(quizData)

      const leaderboardRes = await fetch(`/api/quiz/${quizData.accessCode}/leaderboard`)
      if (leaderboardRes.ok) {
        const data = await leaderboardRes.json()
        setLeaderboard(data.leaderboard || [])
      }
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de charger les données')
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
          <div className="animate-spin inline-block w-8 h-8 border-4 border-gray-300 border-t-brand-blue rounded-full mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement du classement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header backLink={`/admin/quiz/${quizId}`} backLabel="Retour à l'édition" />

      {/* Main Content */}
      <main className="container-base max-w-5xl py-12 flex-1">
        <div className="mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-blue mb-3 flex items-center gap-3">
            <IconSet.TrendingUp size={32} />
            Classement
          </h1>
          {quiz && (
            <p className="text-lg text-gray-600 font-medium">
              <span className="text-brand-blue font-bold">{quiz.title}</span>
            </p>
          )}
        </div>

        {error && (
          <div className="alert alert-error mb-8 flex items-start gap-3 animate-slide-up">
            <IconSet.AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {leaderboard.length === 0 ? (
          <div className="card p-16 text-center animate-slide-up">
            <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <IconSet.Users size={40} className="text-gray-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Aucun participant</h3>
            <p className="text-gray-600">
              Les participants apparaîtront ici quand ils compléteront le quiz.
            </p>
          </div>
        ) : (
          <>
            {/* Top 3 Podium */}
            <div className="grid sm:grid-cols-3 gap-6 mb-12">
              {leaderboard.slice(0, 3).map((entry, idx) => (
                <div
                  key={idx}
                  className={`card p-8 text-center transform transition-all duration-300 hover:scale-105 animate-slide-up ${
                    idx === 0 ? 'sm:scale-105 border-2 border-brand-blue' : ''
                  }`}
                  style={{ animationDelay: `${idx * 100}ms` }}
                >
                  <div className="mb-4">
                    {idx === 0 && (
                      <div className="text-5xl mb-3">1</div>
                    )}
                    {idx === 1 && (
                      <div className="text-5xl mb-3">2</div>
                    )}
                    {idx === 2 && (
                      <div className="text-5xl mb-3">3</div>
                    )}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-1">
                    {entry.firstName} {entry.lastName}
                  </h3>
                  <p className="text-sm text-gray-500 mb-4">{entry.company}</p>
                  <div className={`p-4 rounded-lg ${
                    idx === 0 ? 'bg-brand-blue text-white' :
                    idx === 1 ? 'bg-brand-green text-white' :
                    'bg-orange-500 text-white'
                  }`}>
                    <div className="text-3xl font-black">{entry.score}</div>
                    <p className="text-xs font-semibold tracking-wide">POINTS</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Rest of leaderboard */}
            {leaderboard.length > 3 && (
              <div className="mb-12">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Autres participants</h2>
                <div className="space-y-3">
                  {leaderboard.slice(3).map((entry, idx) => (
                    <div
                      key={idx + 3}
                      className="card p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 animate-slide-up"
                      style={{ animationDelay: `${(idx + 3) * 50}ms` }}
                    >
                      <div className="flex items-center gap-4 flex-1">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <span className="font-bold text-gray-600 text-sm">{idx + 4}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-gray-900">
                            {entry.firstName} {entry.lastName}
                          </h3>
                          <p className="text-xs text-gray-500">{entry.company}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-brand-blue">{entry.score}</div>
                        <p className="text-xs text-gray-500 font-medium">pts</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Stats Section */}
        {leaderboard.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gray-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Statistiques</h2>
            <div className="grid sm:grid-cols-3 gap-6">
              <div className="card p-8 text-center bg-gradient-to-br from-brand-blue/5 to-transparent border-2 border-brand-blue">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-blue text-white font-bold mx-auto mb-4">
                  <IconSet.Users size={20} />
                </div>
                <div className="text-4xl font-black text-brand-blue mb-2">{leaderboard.length}</div>
                <p className="text-gray-600 font-medium">Participants</p>
              </div>
              <div className="card p-8 text-center bg-gradient-to-br from-brand-green/5 to-transparent border-2 border-brand-green">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-brand-green text-white font-bold mx-auto mb-4">
                  <IconSet.Check size={20} />
                </div>
                <div className="text-4xl font-black text-brand-green mb-2">
                  {leaderboard.filter((e) => e.completedAt).length}
                </div>
                <p className="text-gray-600 font-medium">Complétés</p>
              </div>
              <div className="card p-8 text-center bg-gradient-to-br from-orange-500/5 to-transparent border-2 border-orange-500">
                <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-500 text-white font-bold mx-auto mb-4">
                  <IconSet.BarChart3 size={20} />
                </div>
                <div className="text-4xl font-black text-orange-600 mb-2">
                  {Math.round(leaderboard.reduce((sum, e) => sum + e.score, 0) / leaderboard.length)}
                </div>
                <p className="text-gray-600 font-medium">Score moyen</p>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}

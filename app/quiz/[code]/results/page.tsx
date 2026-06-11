'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

interface LeaderboardEntry {
  id: string
  firstName: string
  lastName: string
  score: number
}

interface ResultData {
  score: number
  rank: {
    rank: number
    total: number
  }
  totalQuestions: number
  correctAnswers: number
}

export default function QuizResults() {
  const params = useParams()
  const code = params.code as string
  const [results, setResults] = useState<ResultData | null>(null)
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('quiz_results')
    if (storedResults) {
      setResults(JSON.parse(storedResults))
    }

    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/quiz/${code}/leaderboard`)
        if (res.ok) {
          const data = await res.json()
          setLeaderboard(data.leaderboard)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()
  }, [code])

  const getRankEmoji = (rank: number) => {
    if (rank === 1) return '🥇'
    if (rank === 2) return '🥈'
    if (rank === 3) return '🥉'
    return '🎯'
  }

  const getEncouragement = (rank: number, total: number) => {
    const percentage = (rank / total) * 100
    if (percentage <= 10) return '🔥 INCROYABLE !'
    if (percentage <= 25) return '⭐ EXCELLENT !'
    if (percentage <= 50) return '👍 BON !'
    return '💪 CONTINUEZ !'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
        <div className="animate-bounce-in text-white text-3xl font-black">⏳ Calcul des résultats...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Results Header */}
        {results && (
          <div className="text-center mb-10 animate-slide-in">
            <div className="text-7xl mb-4">🎉</div>
            <h1 className="text-5xl font-black text-white mb-4">Quiz Terminé !</h1>

            {/* Score Card */}
            <div className="kahoot-card p-10 mb-8 bg-gradient-to-br from-white to-blue-50 animate-bounce-in">
              <div className="mb-6">
                <div className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green mb-3">
                  {results.score}
                </div>
                <p className="text-2xl font-black text-gray-700">points</p>
              </div>

              <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-2xl p-6 mb-6">
                <p className="text-lg font-bold mb-2">Bonnes réponses</p>
                <p className="text-4xl font-black">
                  {results.correctAnswers} / {results.totalQuestions}
                </p>
              </div>

              {results.rank && (
                <div className="bg-gradient-to-r from-brand-green to-green-500 text-white rounded-2xl p-8">
                  <p className="text-lg font-bold mb-2">Votre Classement</p>
                  <p className="text-5xl font-black mb-4">
                    {getRankEmoji(results.rank.rank)} {results.rank.rank}e
                  </p>
                  <p className="text-xl font-bold">sur {results.rank.total} participants</p>
                  <p className="text-2xl font-black mt-4">{getEncouragement(results.rank.rank, results.rank.total)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="kahoot-card p-10 mb-8 animate-slide-in">
          <h2 className="text-4xl font-black text-brand-blue mb-8 flex items-center gap-3">
            🏆 Classement en direct
          </h2>

          <div className="space-y-3">
            {leaderboard.length === 0 ? (
              <p className="text-center text-gray-500 text-lg font-semibold py-8">
                Soyez le premier à participer !
              </p>
            ) : (
              leaderboard.map((entry, idx) => (
                <div
                  key={entry.id}
                  className={`rounded-xl p-4 flex items-center justify-between transition-all duration-300 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-200 border-4 border-yellow-500 scale-105'
                      : idx === 1
                      ? 'bg-gradient-to-r from-gray-300 to-gray-200 border-4 border-gray-400'
                      : idx === 2
                      ? 'bg-gradient-to-r from-orange-300 to-orange-200 border-4 border-orange-400'
                      : 'bg-gray-100 border-4 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <span className="text-4xl font-black min-w-16 text-center">
                      {['🥇', '🥈', '🥉', ...Array(leaderboard.length - 3).fill('🎯')][idx]}
                    </span>
                    <div className="text-left">
                      <p className="font-black text-lg">
                        {entry.firstName} {entry.lastName}
                      </p>
                      <p className="text-sm font-bold opacity-75">#{idx + 1}</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-brand-blue">{entry.score} pts</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-4 justify-center mb-8 animate-slide-in">
          <Link href={`/leaderboard/${code}`}>
            <button className="kahoot-button-green text-xl px-10 py-4">
              📊 Voir le Classement Complet
            </button>
          </Link>
          <Link href="/">
            <button className="kahoot-button bg-gray-600 text-white text-xl px-10 py-4 hover:bg-gray-700">
              🏠 Accueil
            </button>
          </Link>
        </div>
      </div>
    </div>
  )
}

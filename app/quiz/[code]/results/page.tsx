'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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

  const getRankBadge = (rank: number) => {
    if (rank === 1) return '1er'
    if (rank === 2) return '2e'
    if (rank === 3) return '3e'
    return `${rank}e`
  }

  const getEncouragement = (rank: number, total: number) => {
    const percentage = (rank / total) * 100
    if (percentage <= 10) return 'INCROYABLE !'
    if (percentage <= 25) return 'EXCELLENT !'
    if (percentage <= 50) return 'BON !'
    return 'CONTINUEZ !'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-brand-blue rounded-full mb-4"></div>
          <p className="text-gray-600 font-semibold">Calcul des résultats...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header backLink={`/quiz/${code}`} showAdminButton={true} />

      <main className="flex-1 container-base py-12">
        {/* Results Header */}
        {results && (
          <div className="text-center mb-12 animate-slide-up">
            <h1 className="text-5xl sm:text-6xl font-black text-brand-blue mb-8">Quiz Terminé !</h1>

            {/* Score Card */}
            <div className="card p-10 mb-8 bg-gradient-to-br from-white to-blue-50 border-2 border-brand-blue max-w-2xl mx-auto">
              <div className="mb-8">
                <div className="text-6xl sm:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-blue to-brand-green mb-3">
                  {results.score}
                </div>
                <p className="text-xl font-semibold text-gray-600">points</p>
              </div>

              <div className="bg-gradient-to-r from-brand-blue to-blue-600 text-white rounded-xl p-6 mb-6">
                <p className="text-sm font-bold mb-2 opacity-90">Bonnes réponses</p>
                <p className="text-4xl font-black">
                  {results.correctAnswers} / {results.totalQuestions}
                </p>
              </div>

              {results.rank && (
                <div className="bg-gradient-to-r from-brand-green to-green-600 text-white rounded-xl p-8">
                  <p className="text-sm font-bold mb-2 opacity-90">Votre Classement</p>
                  <p className="text-5xl font-black mb-3">{getRankBadge(results.rank.rank)}</p>
                  <p className="text-lg font-semibold mb-3">sur {results.rank.total} participants</p>
                  <p className="text-2xl font-black">{getEncouragement(results.rank.rank, results.rank.total)}</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Leaderboard */}
        <div className="card p-8 mb-12 max-w-4xl mx-auto">
          <h2 className="text-3xl font-black text-brand-blue mb-8 flex items-center gap-3">
            <IconSet.Award size={32} />
            Classement en direct
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
                  className={`rounded-xl p-5 flex items-center justify-between transition-all duration-300 ${
                    idx === 0
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-300 border-2 border-yellow-500 scale-105 shadow-lg'
                      : idx === 1
                      ? 'bg-gradient-to-r from-gray-400 to-gray-300 border-2 border-gray-500'
                      : idx === 2
                      ? 'bg-gradient-to-r from-orange-400 to-orange-300 border-2 border-orange-500'
                      : 'bg-gray-100 border-2 border-gray-300'
                  }`}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center flex-shrink-0 shadow">
                      <span className="text-xl font-black text-gray-800">#{idx + 1}</span>
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-lg text-gray-900">
                        {entry.firstName} {entry.lastName}
                      </p>
                      <p className="text-sm font-semibold opacity-80">{entry.score} points</p>
                    </div>
                  </div>
                  <span className="text-3xl font-black text-gray-900">{entry.score}</span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8 animate-slide-up">
          <Link href={`/leaderboard/${code}`}>
            <button className="btn btn-primary px-8 py-3 text-lg">
              <IconSet.BarChart3 size={20} />
              Classement Complet
            </button>
          </Link>
          <Link href="/">
            <button className="btn btn-outline px-8 py-3 text-lg">
              <IconSet.Home size={20} />
              Accueil
            </button>
          </Link>
        </div>
      </main>

      <Footer compact={true} />
    </div>
  )
}

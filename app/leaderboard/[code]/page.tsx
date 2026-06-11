'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'

interface LeaderboardEntry {
  id: string
  firstName: string
  lastName: string
  score: number
}

interface LeaderboardData {
  leaderboard: LeaderboardEntry[]
  total: number
}

export default function Leaderboard() {
  const params = useParams()
  const code = params.code as string
  const [data, setData] = useState<LeaderboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        const res = await fetch(`/api/quiz/${code}/leaderboard`)
        if (res.ok) {
          const leaderboardData = await res.json()
          setData(leaderboardData)
        }
      } catch (err) {
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchLeaderboard()

    // Refresh every 5 seconds
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
        <div className="text-white text-4xl font-black animate-bounce">⏳ Chargement...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 p-8 flex flex-col">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="text-7xl mb-4 animate-bounce-in">🏆</div>
        <h1 className="text-6xl font-black text-white mb-2">CLASSEMENT</h1>
        <p className="text-2xl text-brand-green font-bold">En Direct</p>
      </div>

      {/* Leaderboard */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Top 3 - Special layout */}
        <div className="lg:col-span-2">
          <div className="grid grid-cols-3 gap-6">
            {/* 2nd Place */}
            {data?.leaderboard[1] && (
              <div className="flex flex-col items-center animate-slide-in" style={{ animationDelay: '0.1s' }}>
                <div className="w-full bg-gradient-to-b from-gray-400 to-gray-300 rounded-2xl p-8 text-center border-4 border-gray-500 shadow-2xl hover:shadow-3xl transition">
                  <div className="text-6xl font-black mb-4">🥈</div>
                  <div className="text-5xl font-black text-gray-800 mb-2">2</div>
                  <p className="text-2xl font-black text-gray-800 mb-4">
                    {data.leaderboard[1].firstName} {data.leaderboard[1].lastName}
                  </p>
                  <div className="bg-gray-600 text-white rounded-xl px-4 py-3">
                    <p className="text-3xl font-black">{data.leaderboard[1].score}</p>
                    <p className="text-sm font-bold">points</p>
                  </div>
                </div>
              </div>
            )}

            {/* 1st Place - Larger */}
            {data?.leaderboard[0] && (
              <div className="flex flex-col items-center animate-slide-in -mt-8">
                <div className="w-full bg-gradient-to-b from-yellow-400 to-yellow-300 rounded-2xl p-8 text-center border-4 border-yellow-500 shadow-2xl hover:shadow-3xl transition scale-110">
                  <div className="text-7xl font-black mb-4 animate-bounce">🥇</div>
                  <div className="text-6xl font-black text-yellow-800 mb-2">1</div>
                  <p className="text-2xl font-black text-yellow-800 mb-4">
                    {data.leaderboard[0].firstName} {data.leaderboard[0].lastName}
                  </p>
                  <div className="bg-yellow-600 text-white rounded-xl px-4 py-3">
                    <p className="text-4xl font-black">{data.leaderboard[0].score}</p>
                    <p className="text-sm font-bold">points</p>
                  </div>
                </div>
              </div>
            )}

            {/* 3rd Place */}
            {data?.leaderboard[2] && (
              <div className="flex flex-col items-center animate-slide-in" style={{ animationDelay: '0.2s' }}>
                <div className="w-full bg-gradient-to-b from-orange-400 to-orange-300 rounded-2xl p-8 text-center border-4 border-orange-500 shadow-2xl hover:shadow-3xl transition">
                  <div className="text-6xl font-black mb-4">🥉</div>
                  <div className="text-5xl font-black text-orange-800 mb-2">3</div>
                  <p className="text-2xl font-black text-orange-800 mb-4">
                    {data.leaderboard[2].firstName} {data.leaderboard[2].lastName}
                  </p>
                  <div className="bg-orange-600 text-white rounded-xl px-4 py-3">
                    <p className="text-3xl font-black">{data.leaderboard[2].score}</p>
                    <p className="text-sm font-bold">points</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Ranking 4+ */}
        <div className="lg:col-span-1">
          <h3 className="text-3xl font-black text-white mb-6">Suite du Classement</h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {data?.leaderboard.slice(3).map((entry, idx) => (
              <div
                key={entry.id}
                className="bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-4 flex justify-between items-center border-2 border-brand-green hover:bg-opacity-20 transition animate-slide-in"
                style={{ animationDelay: `${(idx + 3) * 0.05}s` }}
              >
                <div>
                  <p className="font-black text-white text-lg">#{idx + 4}</p>
                  <p className="text-white font-bold text-sm">
                    {entry.firstName} {entry.lastName}
                  </p>
                </div>
                <p className="text-brand-green font-black text-2xl">{entry.score}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-white text-sm mt-12 opacity-75 font-semibold">
        <p>📊 Total: {data?.total} participants | 🔄 Actualisation automatique</p>
      </div>
    </div>
  )
}

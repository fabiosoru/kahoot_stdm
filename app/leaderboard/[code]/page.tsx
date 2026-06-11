'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconSet } from '@/components/Icon'

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
    const interval = setInterval(fetchLeaderboard, 5000)
    return () => clearInterval(interval)
  }, [code])

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-brand-blue rounded-full mb-4"></div>
          <p className="text-gray-600 font-semibold">Chargement du classement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header backLink={`/quiz/${code}`} showAdminButton={true} />

      <main className="flex-1 container-base py-12">
        <div className="text-center mb-12 animate-slide-up">
          <h1 className="text-4xl sm:text-5xl font-black text-brand-blue mb-3 flex items-center justify-center gap-3">
            <IconSet.Award size={40} />
            Classement En Direct
          </h1>
          <p className="text-lg text-gray-600 font-medium">
            Participez en temps réel et voyez le classement se mettre à jour
          </p>
        </div>

        {data && data.leaderboard.length > 0 && (
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            {data.leaderboard[1] && (
              <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
                <div className="card p-8 text-center bg-gradient-to-br from-gray-300 to-gray-200 border-2 border-gray-400 h-full">
                  <div className="text-5xl mb-3">2</div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">
                    {data.leaderboard[1].firstName} {data.leaderboard[1].lastName}
                  </h3>
                  <div className="bg-gray-600 text-white rounded-lg p-4 mt-6">
                    <div className="text-3xl font-black">{data.leaderboard[1].score}</div>
                    <p className="text-xs font-semibold tracking-wide">POINTS</p>
                  </div>
                </div>
              </div>
            )}

            {data.leaderboard[0] && (
              <div className="animate-slide-up sm:scale-105" style={{ animationDelay: '0s' }}>
                <div className="card p-8 text-center bg-gradient-to-br from-brand-blue to-blue-700 text-white border-2 border-brand-blue h-full">
                  <div className="text-5xl mb-3">1</div>
                  <h3 className="font-bold text-lg mb-2">
                    {data.leaderboard[0].firstName} {data.leaderboard[0].lastName}
                  </h3>
                  <div className="bg-white text-brand-blue rounded-lg p-4 mt-6">
                    <div className="text-3xl font-black">{data.leaderboard[0].score}</div>
                    <p className="text-xs font-semibold tracking-wide">POINTS</p>
                  </div>
                </div>
              </div>
            )}

            {data.leaderboard[2] && (
              <div className="animate-slide-up" style={{ animationDelay: '0.2s' }}>
                <div className="card p-8 text-center bg-gradient-to-br from-orange-400 to-orange-300 border-2 border-orange-500 h-full">
                  <div className="text-5xl mb-3">3</div>
                  <h3 className="font-bold text-orange-900 text-lg mb-2">
                    {data.leaderboard[2].firstName} {data.leaderboard[2].lastName}
                  </h3>
                  <div className="bg-orange-600 text-white rounded-lg p-4 mt-6">
                    <div className="text-3xl font-black">{data.leaderboard[2].score}</div>
                    <p className="text-xs font-semibold tracking-wide">POINTS</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {data && data.leaderboard.length > 3 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Autres Participants</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.leaderboard.slice(3).map((entry, idx) => (
                <div
                  key={entry.id}
                  className="card p-5 flex items-center justify-between hover:shadow-md transition-all duration-200 animate-slide-up"
                  style={{ animationDelay: `${(idx + 3) * 0.05}s` }}
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="font-bold text-gray-600 text-sm">#{idx + 4}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {entry.firstName} {entry.lastName}
                      </h3>
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

        <div className="bg-blue-50 border-2 border-brand-blue rounded-xl p-6 text-center">
          <div className="flex items-center justify-center gap-2 text-gray-700 font-semibold">
            <IconSet.Users size={20} />
            <span>{data?.total} participant{data && data.total > 1 ? 's' : ''}</span>
            <span className="text-gray-400">•</span>
            <IconSet.Clock size={20} />
            <span>Actualisation toutes les 5 secondes</span>
          </div>
        </div>
      </main>

      <Footer compact={true} />
    </div>
  )
}

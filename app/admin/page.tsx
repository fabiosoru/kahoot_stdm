'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

interface Quiz {
  id: string
  title: string
  description?: string
  accessCode: string
  isActive: boolean
  createdAt: string
}

export default function AdminDashboard() {
  const router = useRouter()
  const [quizzes, setQuizzes] = useState<Quiz[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch('/api/admin/quiz')
        if (!res.ok) {
          router.push('/admin/login')
          return
        }
        const data = await res.json()
        setQuizzes(data)
      } catch (err) {
        console.error(err)
        setError('Failed to load quizzes')
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' })
    router.push('/admin/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
        <div className="animate-bounce-in">
          <div className="text-white text-2xl font-bold">Chargement...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900">
      {/* Header */}
      <nav className="bg-black bg-opacity-20 backdrop-blur-md border-b border-brand-green border-opacity-30">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-3xl font-black text-white">🎯 ADMIN</h1>
          <button
            onClick={handleLogout}
            className="kahoot-button bg-red-500 text-white hover:bg-red-600"
          >
            Déconnexion
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-6">
        <div className="flex justify-between items-center mb-8 animate-slide-in">
          <h2 className="text-4xl font-black text-white">Mes Quiz</h2>
          <Link href="/admin/quiz/new">
            <button className="kahoot-button-green text-xl animate-pulse-glow">
              ➕ Créer un Quiz
            </button>
          </Link>
        </div>

        {error && (
          <div className="kahoot-card bg-red-100 border-4 border-red-500 text-red-700 px-6 py-4 mb-6 animate-slide-in">
            {error}
          </div>
        )}

        {quizzes.length === 0 ? (
          <div className="kahoot-card bg-white text-center py-16 animate-bounce-in">
            <div className="text-5xl mb-4">📭</div>
            <p className="text-xl text-gray-500 font-semibold">Aucun quiz créé</p>
            <p className="text-gray-400 mt-2">Commencez par créer votre premier quiz !</p>
          </div>
        ) : (
          <div className="grid gap-6">
            {quizzes.map((quiz, idx) => (
              <div
                key={quiz.id}
                className="kahoot-card p-6 animate-slide-in"
                style={{ animationDelay: `${idx * 0.1}s` }}
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-3xl font-black text-brand-blue">{quiz.title}</h3>
                      <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                        quiz.isActive
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-300 text-gray-700'
                      }`}>
                        {quiz.isActive ? '✓ Actif' : '⊘ Inactif'}
                      </span>
                    </div>
                    {quiz.description && (
                      <p className="text-gray-600 text-lg mb-3">{quiz.description}</p>
                    )}
                    <div className="inline-block bg-brand-blue text-white px-4 py-2 rounded-lg font-mono font-bold">
                      Code: {quiz.accessCode}
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <Link href={`/admin/quiz/${quiz.id}`}>
                      <button className="kahoot-button bg-brand-blue text-white">
                        ✏️ Éditer
                      </button>
                    </Link>
                    <Link href={`/admin/quiz/${quiz.id}/participants`}>
                      <button className="kahoot-button bg-brand-green text-white">
                        👥 Participants
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'

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
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin text-4xl mb-4">⟳</div>
          <p className="text-gray-600 font-semibold">Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="app-header">
        <div className="container-base py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-brand-blue to-brand-green rounded-lg flex items-center justify-center">
              <IconSet.BarChart3 size={24} className="text-white" />
            </div>
            <h1 className="text-xl font-bold text-brand-blue">Dashboard Admin</h1>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-secondary btn-sm"
          >
            <IconSet.LogOut size={16} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-base py-8">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 animate-slide-up">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Mes Quiz</h2>
            <p className="text-gray-600">Gérez vos quiz et suivez les participations</p>
          </div>
          <Link href="/admin/quiz/new">
            <button className="btn btn-primary">
              <IconSet.Plus size={18} />
              Créer un Quiz
            </button>
          </Link>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="alert alert-error mb-6 flex items-start gap-3">
            <IconSet.AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Erreur</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Quiz List */}
        {quizzes.length === 0 ? (
          <div className="card p-12 text-center animate-slide-up">
            <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <IconSet.BarChart3 size={32} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aucun quiz créé</h3>
            <p className="text-gray-600 mb-6">Commencez en créant votre premier quiz</p>
            <Link href="/admin/quiz/new">
              <button className="btn btn-primary">
                <IconSet.Plus size={16} />
                Créer un Quiz
              </button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-4">
            {quizzes.map((quiz, idx) => (
              <div
                key={quiz.id}
                className="card p-6 animate-slide-up hover:shadow-md"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  {/* Quiz Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-lg font-bold text-gray-900">{quiz.title}</h3>
                      <span className={`badge ${quiz.isActive ? 'badge-green' : 'badge-gray'}`}>
                        {quiz.isActive ? 'Actif' : 'Inactif'}
                      </span>
                    </div>
                    {quiz.description && (
                      <p className="text-gray-600 text-sm mb-3">{quiz.description}</p>
                    )}
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-gray-600">Code d&apos;accès:</span>
                      <code className="bg-gray-100 px-3 py-1 rounded font-mono font-semibold text-brand-blue">
                        {quiz.accessCode}
                      </code>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(quiz.accessCode)
                        }}
                        className="text-gray-500 hover:text-gray-700 ml-2"
                        title="Copier"
                      >
                        <IconSet.Copy size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                    <Link href={`/admin/quiz/${quiz.id}`} className="flex-1 sm:flex-none">
                      <button className="w-full btn btn-primary btn-sm">
                        <IconSet.Edit size={16} />
                        Éditer
                      </button>
                    </Link>
                    <Link href={`/admin/quiz/${quiz.id}/participants`} className="flex-1 sm:flex-none">
                      <button className="w-full btn btn-secondary btn-sm">
                        <IconSet.Users size={16} />
                        Participants
                      </button>
                    </Link>
                    <Link href={`/leaderboard/${quiz.accessCode}`} className="flex-1 sm:flex-none">
                      <button className="w-full btn btn-secondary btn-sm">
                        <IconSet.TrendingUp size={16} />
                        Classement
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-6 mt-16">
        <div className="container-base text-center text-sm text-gray-600">
          <p>© 2026 SORU Fabio • Tous droits réservés</p>
        </div>
      </footer>
    </div>
  )
}

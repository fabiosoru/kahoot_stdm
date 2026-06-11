'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'

interface Question {
  id: string
  text: string
  imageUrl?: string
  timeLimit: number
  points: number
  order: number
  choices: { id: string; text: string; isCorrect: boolean }[]
}

interface Quiz {
  id: string
  title: string
  description?: string
  accessCode: string
  isActive: boolean
}

export default function EditQuiz() {
  const params = useParams()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        // Fetch quiz details would go here
        setLoading(false)
      } catch (err) {
        console.error(err)
        setError('Failed to load quiz')
        setLoading(false)
      }
    }

    fetchQuiz()
  }, [quizId])

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
          <Link href="/admin" className="flex items-center gap-2">
            <IconSet.ChevronRight size={20} className="rotate-180 text-gray-600" />
            <span className="font-semibold text-gray-700">Retour</span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="container-base max-w-4xl py-8">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Éditer le Quiz</h1>
          <p className="text-gray-600">Gérez les questions et les paramètres</p>
        </div>

        {/* Coming Soon */}
        <div className="card p-12 text-center animate-slide-up">
          <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <IconSet.Info size={32} className="text-brand-blue" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Édition en développement</h3>
          <p className="text-gray-600 mb-6">
            Cette page vous permettra d'ajouter et de gérer les questions du quiz
          </p>
          <Link href="/admin">
            <button className="btn btn-primary">
              <IconSet.ChevronRight size={16} className="rotate-180" />
              Retour au Dashboard
            </button>
          </Link>
        </div>
      </main>
    </div>
  )
}

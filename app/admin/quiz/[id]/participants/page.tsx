'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { IconSet } from '@/components/Icon'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

interface Participant {
  id: string
  firstName: string
  lastName: string
  company: string
  score: number
  completedAt?: string
}

export default function QuizParticipants() {
  const params = useParams()
  const quizId = params.id as string

  const [participants, setParticipants] = useState<Participant[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        setLoading(false)
      } catch (err) {
        console.error(err)
        setLoading(false)
      }
    }

    fetchParticipants()
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
    <div className="min-h-screen bg-white flex flex-col">
      <Header backLink="/admin" backLabel="Retour" />

      {/* Main Content */}
      <main className="container-base py-8 flex-1">
        <div className="mb-8 animate-slide-up">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Participants</h1>
          <p className="text-gray-600">Voir la liste des participants et leurs scores</p>
        </div>

        {/* Coming Soon */}
        <div className="card p-12 text-center animate-slide-up">
          <div className="w-16 h-16 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
            <IconSet.Users size={32} className="text-brand-green" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Participants en développement</h3>
          <p className="text-gray-600 mb-6">
            Vous verrez ici tous les participants du quiz et leurs scores
          </p>
          <Link href="/admin">
            <button className="btn btn-primary">
              <IconSet.ChevronRight size={16} className="rotate-180" />
              Retour au Dashboard
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  )
}

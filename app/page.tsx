'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconSet } from '@/components/Icon'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const handleCodeSubmit = () => {
    if (code.trim()) {
      router.push(`/quiz/${code.toUpperCase()}`)
    }
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header showAdminButton={true} />

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container-base max-w-3xl mx-auto text-center animate-slide-up">
          <div className="mb-4 inline-block">
            <span className="badge badge-info">2e édition 2026</span>
          </div>
          <h2 className="text-5xl sm:text-6xl font-black text-brand-blue mb-6 leading-tight">
            Journée Santé<br />& Sécurité
          </h2>
          <p className="text-xl text-gray-600 mb-12 font-medium">
            Testez vos connaissances avec un quiz interactif et amusant !
          </p>

          {/* Join Quiz Card */}
          <div className="card p-8 max-w-md mx-auto mb-16 bg-gradient-to-br from-white to-blue-50 border-2 border-brand-blue">
            <h3 className="text-xl font-bold text-brand-blue mb-6">Rejoindre un Quiz</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code d'accès"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                className="input flex-1 font-mono font-bold text-center"
              />
              <button
                onClick={handleCodeSubmit}
                className="btn btn-primary"
              >
                <IconSet.ChevronRight size={16} />
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4 font-medium">
              Exemple: <code className="bg-brand-blue text-white px-3 py-1 rounded font-mono font-bold">SANTE2026</code>
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="card p-8 border-l-4 border-brand-blue hover:border-brand-green">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-blue to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <IconSet.Clock size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Timer par Question</h4>
              <p className="text-sm text-gray-600">
                Répondez dans le temps imparti pour chaque question
              </p>
            </div>

            <div className="card p-8 border-l-4 border-brand-green hover:border-brand-blue">
              <div className="w-14 h-14 bg-gradient-to-br from-brand-green to-green-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <IconSet.TrendingUp size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Score Automatique</h4>
              <p className="text-sm text-gray-600">
                Votre score est calculé instantanément à la fin du quiz
              </p>
            </div>

            <div className="card p-8 border-l-4 border-orange-500 hover:border-brand-blue">
              <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <IconSet.BarChart3 size={28} className="text-white" />
              </div>
              <h4 className="font-bold text-gray-900 mb-2 text-lg">Classement Live</h4>
              <p className="text-sm text-gray-600">
                Voyez votre rang parmi les autres participants
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

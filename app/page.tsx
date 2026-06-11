'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
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
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="app-header">
        <div className="container-base py-4 flex justify-between items-center">
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/champagne-logo.png"
              alt="Champagne Mobilités"
              width={50}
              height={50}
              className="h-12 w-auto"
              priority
            />
            <div>
              <h1 className="text-lg font-bold text-brand-blue">Journée Santé & Sécurité</h1>
              <p className="text-xs text-gray-500">Champagne Mobilités</p>
            </div>
          </Link>
          <Link href="/admin/login">
            <button className="btn btn-outline btn-sm">
              <IconSet.Settings size={16} />
              Admin
            </button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 sm:py-24">
        <div className="container-base max-w-3xl mx-auto text-center animate-slide-up">
          <h2 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-6">
            Testez vos connaissances
          </h2>
          <p className="text-lg text-gray-600 mb-12">
            Participez à nos quiz interactifs et mesurez votre progression avec un système de scoring en temps réel.
          </p>

          {/* Join Quiz Card */}
          <div className="card p-8 max-w-md mx-auto mb-16">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Rejoindre un Quiz</h3>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Code d&apos;accès"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => e.key === 'Enter' && handleCodeSubmit()}
                className="input flex-1"
              />
              <button
                onClick={handleCodeSubmit}
                className="btn btn-primary btn-sm"
              >
                <IconSet.ChevronRight size={16} />
              </button>
            </div>
            <p className="text-sm text-gray-500 mt-4">
              Ex: <code className="bg-gray-100 px-2 py-1 rounded text-brand-blue font-mono">SANTE2026</code>
            </p>
          </div>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <IconSet.Clock size={24} className="text-brand-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Timer par Question</h4>
              <p className="text-sm text-gray-600">
                Répondez dans le temps imparti pour chaque question
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <IconSet.TrendingUp size={24} className="text-brand-green" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Score Automatique</h4>
              <p className="text-sm text-gray-600">
                Votre score est calculé instantanément à la fin du quiz
              </p>
            </div>

            <div className="card p-6">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <IconSet.BarChart3 size={24} className="text-brand-blue" />
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Classement Live</h4>
              <p className="text-sm text-gray-600">
                Voyez votre rang parmi les autres participants
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 py-8 mt-16">
        <div className="container-base text-center text-sm text-gray-600">
          <p>SORU Fabio • Journée Santé & Sécurité • 2026</p>
        </div>
      </footer>
    </div>
  )
}

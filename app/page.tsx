'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function Home() {
  const router = useRouter()
  const [code, setCode] = useState('')

  const handleCodeSubmit = () => {
    if (code.trim()) {
      router.push(`/quiz/${code}`)
    }
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute top-20 right-20 w-64 h-64 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse"></div>
      <div className="absolute bottom-32 left-20 w-56 h-56 bg-brand-green opacity-10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Hero */}
        <div className="text-center mb-16 animate-slide-in">
          <div className="text-8xl mb-6 animate-bounce-in">🎯</div>
          <h1 className="text-7xl font-black text-white mb-4">KAHOOT</h1>
          <p className="text-3xl font-bold text-brand-green mb-2">Journée Santé & Sécurité</p>
          <p className="text-xl text-white opacity-90">Champagne Mobilités & STDM</p>
        </div>

        {/* Description */}
        <div className="kahoot-card p-12 mb-12 animate-bounce-in">
          <h2 className="text-3xl font-black text-brand-blue mb-6">Bienvenue ! 👋</h2>
          <p className="text-lg text-gray-700 leading-relaxed mb-6">
            Testez vos connaissances sur la santé et la sécurité au travail. Participez au quiz, découvrez votre score et grimpez le classement !
          </p>
          <div className="grid md:grid-cols-3 gap-6 mt-8">
            <div className="bg-blue-50 rounded-xl p-6 border-l-4 border-brand-blue">
              <div className="text-4xl mb-3">❓</div>
              <p className="font-black text-brand-blue text-lg">Multiple Questions</p>
              <p className="text-gray-600 text-sm mt-2">Répondez à des questions sur la santé</p>
            </div>
            <div className="bg-green-50 rounded-xl p-6 border-l-4 border-brand-green">
              <div className="text-4xl mb-3">⏱️</div>
              <p className="font-black text-brand-green text-lg">Temps Limité</p>
              <p className="text-gray-600 text-sm mt-2">Réagissez vite pour chaque question</p>
            </div>
            <div className="bg-yellow-50 rounded-xl p-6 border-l-4 border-yellow-500">
              <div className="text-4xl mb-3">🏆</div>
              <p className="font-black text-yellow-600 text-lg">Classement Live</p>
              <p className="text-gray-600 text-sm mt-2">Comparez vos scores en temps réel</p>
            </div>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col md:flex-row gap-6 justify-center animate-slide-in">
          <Link href="/admin/login" className="flex-1">
            <button className="w-full kahoot-button-blue text-2xl py-6 font-black hover:shadow-2xl">
              🔐 Admin - Créer un Quiz
            </button>
          </Link>
          <div className="flex-1">
            <p className="text-white text-center text-sm font-bold mb-3">
              OU entrez votre code participant
            </p>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ex: SANTE2026"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleCodeSubmit()
                  }
                }}
                className="flex-1 px-6 py-4 border-4 border-brand-green rounded-xl font-black text-lg text-center bg-white text-brand-blue placeholder-gray-400 focus:outline-none focus:ring-4 focus:ring-brand-green"
              />
              <button
                onClick={handleCodeSubmit}
                className="kahoot-button-green px-6 font-black"
              >
                ▶️
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-white text-sm opacity-75 mt-12 font-semibold">
          🚌 Groupe RATP Dev | 2ème édition | 17 juin 2026
        </p>
      </div>
    </div>
  )
}

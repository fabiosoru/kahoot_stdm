'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { IconSet } from '@/components/Icon'

interface Choice {
  id: string
  text: string
}

interface Question {
  id: string
  text: string
  imageUrl?: string
  timeLimit: number
  order: number
  choices: Choice[]
}

export default function QuizPlay() {
  const router = useRouter()
  const params = useParams()
  const code = params.code as string
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [feedback, setFeedback] = useState<{ isCorrect: boolean; message: string } | null>(null)
  const [answered, setAnswered] = useState(false)
  const startTime = useRef(0)

  useEffect(() => {
    const token = localStorage.getItem('participant_token')
    if (!token) {
      router.push(`/quiz/${code}`)
      return
    }

    const fetchQuestions = async () => {
      try {
        const res = await fetch(`/api/quiz/${code}/questions`, {
          headers: { 'x-participant-token': token },
        })
        if (!res.ok) throw new Error('Failed to load questions')
        const data = await res.json()
        setQuestions(data)
        setTimeLeft(data[0]?.timeLimit || 30)
        startTime.current = Date.now()
      } catch (err) {
        console.error(err)
        router.push(`/quiz/${code}`)
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions()
  }, [code, router])

  useEffect(() => {
    if (questions.length === 0 || answered) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleNext()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [questions, answered])

  const handleAnswer = async (choiceId: string) => {
    if (answered) return

    setSelectedChoice(choiceId)
    setAnswered(true)

    const token = localStorage.getItem('participant_token')
    const question = questions[currentIndex]
    const timeSpent = Date.now() - startTime.current

    try {
      await fetch(`/api/quiz/${code}/answer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-participant-token': token!,
        },
        body: JSON.stringify({
          questionId: question.id,
          choiceId,
          timeSpent,
        }),
      })

      setFeedback({
        isCorrect: true,
        message: 'Réponse enregistrée !',
      })

      setTimeout(() => handleNext(), 1500)
    } catch (err) {
      console.error(err)
    }
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedChoice(null)
      setAnswered(false)
      setFeedback(null)
      setTimeLeft(questions[currentIndex + 1]?.timeLimit || 30)
      startTime.current = Date.now()
    } else {
      finishQuiz()
    }
  }

  const finishQuiz = async () => {
    const token = localStorage.getItem('participant_token')
    try {
      const res = await fetch(`/api/quiz/${code}/finish`, {
        method: 'POST',
        headers: {
          'x-participant-token': token!,
        },
      })
      if (res.ok) {
        const result = await res.json()
        sessionStorage.setItem('quiz_results', JSON.stringify(result))
        router.push(`/quiz/${code}/results`)
      }
    } catch (err) {
      console.error(err)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin inline-block w-12 h-12 border-4 border-gray-300 border-t-brand-blue rounded-full mb-4"></div>
          <p className="text-gray-600 font-semibold">Préparation du quiz...</p>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="card p-10 max-w-md text-center">
          <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <IconSet.AlertCircle size={32} className="text-gray-400" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Aucune question</h1>
          <p className="text-gray-600 mt-2">Ce quiz n'a pas encore de questions.</p>
        </div>
      </div>
    )
  }

  const question = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const timerColor = timeLeft <= 5 ? 'text-red-600' : timeLeft <= 10 ? 'text-orange-600' : 'text-brand-green'

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex flex-col">
      <Header backLink={`/quiz/${code}`} showAdminButton={true} />

      <main className="flex-1 container-base py-8">
        {/* Header avec progression */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm font-bold text-gray-600 uppercase tracking-wide">
              Question {currentIndex + 1} sur {questions.length}
            </span>
            <div className={`text-4xl font-black font-mono ${timerColor} transition-colors`}>
              {timeLeft}s
            </div>
          </div>
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-brand-blue to-brand-green h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="card p-8 mb-8 animate-slide-up">
          <h2 className="text-3xl font-bold text-gray-900 mb-6 leading-tight">
            {question.text}
          </h2>
          {question.imageUrl && (
            <img
              src={question.imageUrl}
              alt="Question"
              className="w-full rounded-xl mb-6 max-h-64 object-cover shadow-lg"
            />
          )}
        </div>

        {/* Choices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          {question.choices.map((choice, idx) => {
            const colors = [
              'from-brand-blue to-blue-600',
              'from-brand-green to-green-600',
              'from-orange-500 to-orange-600',
              'from-red-500 to-red-600',
            ]
            const isSelected = selectedChoice === choice.id
            const bgColor = colors[idx % 4]

            return (
              <button
                key={choice.id}
                onClick={() => handleAnswer(choice.id)}
                disabled={answered}
                className={`relative rounded-xl p-6 font-semibold text-white text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg bg-gradient-to-r ${bgColor} ${
                  isSelected ? 'ring-4 ring-white scale-105' : 'hover:shadow-xl'
                } disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100`}
              >
                <div className="text-left">{choice.text}</div>
              </button>
            )
          })}
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="text-center animate-slide-up mb-8">
            <div className="inline-flex items-center gap-3 bg-green-50 border-2 border-green-600 text-green-700 px-6 py-4 rounded-xl font-semibold">
              <IconSet.Check size={24} />
              <span>{feedback.message}</span>
            </div>
          </div>
        )}
      </main>

      <Footer compact={true} />
    </div>
  )
}

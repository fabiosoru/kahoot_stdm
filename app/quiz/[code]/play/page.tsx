'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

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
        message: '✅ Réponse enregistrée !',
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
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center">
        <div className="animate-bounce-in">
          <div className="text-white text-3xl font-black">⏳ Préparation du quiz...</div>
        </div>
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-brand-blue to-blue-900 flex items-center justify-center p-4">
        <div className="kahoot-card p-10 max-w-md text-center">
          <div className="text-5xl mb-4">❓</div>
          <h1 className="text-3xl font-black text-gray-800">Aucune question</h1>
        </div>
      </div>
    )
  }

  const question = questions[currentIndex]
  const progress = ((currentIndex + 1) / questions.length) * 100
  const timerColor = timeLeft <= 5 ? 'timer-low' : timeLeft <= 10 ? 'timer-warning' : 'timer-safe'

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-blue via-blue-800 to-blue-900 p-4 flex flex-col">
      <Header backLink={`/quiz/${code}`} showAdminButton={true} />

      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <span className="text-white font-black text-2xl">
            Question {currentIndex + 1}/{questions.length}
          </span>
          <div className={`text-4xl font-black font-mono ${timerColor}`}>
            {timeLeft}s
          </div>
        </div>
        {/* Progress Bar */}
        <div className="w-full bg-black bg-opacity-30 rounded-full h-3 overflow-hidden border-2 border-brand-green">
          <div
            className="bg-gradient-to-r from-brand-green to-green-400 h-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question Card */}
      <div className="kahoot-card p-8 mb-8 flex-shrink-0 animate-slide-in">
        <h2 className="text-3xl font-black text-brand-blue mb-6 leading-tight">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
        {question.choices.map((choice, idx) => {
          const colors = [
            'bg-blue-500', // Bleu
            'bg-red-500', // Rouge
            'bg-green-500', // Vert
            'bg-yellow-500', // Jaune
          ]
          const isSelected = selectedChoice === choice.id
          const bgColor = colors[idx % 4]

          return (
            <button
              key={choice.id}
              onClick={() => handleAnswer(choice.id)}
              disabled={answered}
              className={`relative rounded-2xl p-6 font-black text-white text-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-xl ${
                isSelected
                  ? `${bgColor} scale-105 ring-4 ring-white`
                  : `${bgColor} hover:brightness-110`
              } disabled:opacity-75 disabled:cursor-not-allowed`}
            >
              <div className="text-3xl mb-3">{['🔵', '🔴', '🟢', '🟡'][idx % 4]}</div>
              <div className="text-left">{choice.text}</div>
            </button>
          )
        })}
      </div>

      {/* Feedback */}
      {feedback && (
        <div className="mt-6 text-center animate-bounce-in">
          <div className="text-5xl mb-2">✅</div>
          <p className="text-white text-2xl font-black">{feedback.message}</p>
        </div>
      )}

      <Footer compact={true} />
    </div>
  )
}

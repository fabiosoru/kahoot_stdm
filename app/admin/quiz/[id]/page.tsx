'use client'

import { useEffect, useState, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { IconSet } from '@/components/Icon'

interface Choice {
  id: string
  text: string
  isCorrect: boolean
}

interface Question {
  id: string
  text: string
  imageUrl?: string
  timeLimit: number
  points: number
  order: number
  choices: Choice[]
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
  const router = useRouter()
  const quizId = params.id as string

  const [quiz, setQuiz] = useState<Quiz | null>(null)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [editingQuestionId, setEditingQuestionId] = useState<string | null>(null)
  const [newQuestion, setNewQuestion] = useState({
    text: '',
    timeLimit: 30,
    points: 100,
  })
  const [newChoices, setNewChoices] = useState<{ text: string; isCorrect: boolean }[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false },
  ])
  const [copied, setCopied] = useState(false)

  const shareLink = quiz
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/quiz/${quiz.accessCode}`
    : ''

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const fetchQuiz = useCallback(async () => {
    try {
      setLoading(true)
      const res = await fetch(`/api/admin/quiz/${quizId}`)
      if (!res.ok) throw new Error('Failed to load quiz')
      const data = await res.json()
      setQuiz(data)

      const questionsRes = await fetch(`/api/admin/quiz/${quizId}/questions`)
      if (questionsRes.ok) {
        const questionsData = await questionsRes.json()
        setQuestions(questionsData.sort((a: Question, b: Question) => a.order - b.order))
      }
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load quiz')
    } finally {
      setLoading(false)
    }
  }, [quizId])

  useEffect(() => {
    fetchQuiz()
  }, [fetchQuiz])

  const handleAddQuestion = async () => {
    if (!newQuestion.text.trim() || newChoices.filter((c) => c.text.trim()).length < 2) {
      setError('Question et au moins 2 réponses sont requises')
      return
    }

    if (!newChoices.some((c) => c.isCorrect)) {
      setError('Au moins une réponse doit être correcte')
      return
    }

    try {
      const res = await fetch(`/api/admin/quiz/${quizId}/questions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: newQuestion.text,
          timeLimit: newQuestion.timeLimit,
          points: newQuestion.points,
          order: questions.length + 1,
          choices: newChoices.filter((c) => c.text.trim()),
        }),
      })

      if (!res.ok) throw new Error('Failed to add question')
      await fetchQuiz()
      setNewQuestion({ text: '', timeLimit: 30, points: 100 })
      setNewChoices([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false },
      ])
      setError('')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to add question')
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette question ?')) return

    try {
      const res = await fetch(`/api/admin/questions/${questionId}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Failed to delete question')
      await fetchQuiz()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete question')
    }
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
          <Link href="/admin" className="flex items-center gap-2">
            <IconSet.ChevronRight size={20} className="rotate-180 text-gray-600" />
            <span className="font-semibold text-gray-700">Dashboard</span>
          </Link>
          {quiz && (
            <Link href={`/admin/quiz/${quizId}/leaderboard`}>
              <button className="btn btn-outline btn-sm">
                <IconSet.BarChart3 size={16} />
                Classement
              </button>
            </Link>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="container-base max-w-4xl py-8">
        {quiz && (
          <>
            <div className="mb-8 animate-slide-up">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{quiz.title}</h1>
              <p className="text-gray-600 mb-6">{quiz.description}</p>

              {/* Share Link Section */}
              <div className="card p-6 mb-8 bg-gradient-to-br from-brand-blue from-10% to-transparent border-2 border-brand-blue">
                <div className="flex flex-col gap-4">
                  <div>
                    <h3 className="text-sm font-semibold text-brand-blue mb-2 flex items-center gap-2">
                      <IconSet.Share2 size={16} />
                      Lien d'accès pour les participants
                    </h3>
                    <div className="flex gap-2 items-center bg-white rounded-lg p-3 border border-gray-200">
                      <code className="flex-1 font-mono text-sm text-gray-700 break-all">{shareLink}</code>
                      <button
                        onClick={copyToClipboard}
                        className={`btn btn-sm flex-shrink-0 ${
                          copied
                            ? 'btn-success'
                            : 'btn-outline'
                        }`}
                        title="Copier le lien"
                      >
                        {copied ? (
                          <>
                            <IconSet.Check size={14} />
                            Copié !
                          </>
                        ) : (
                          <>
                            <IconSet.Copy size={14} />
                            Copier
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-4 flex-wrap text-xs">
                    <span className="badge badge-info">
                      Code: <code className="font-mono font-bold">{quiz.accessCode}</code>
                    </span>
                    <span className="badge badge-success">{questions.length} questions</span>
                  </div>
                </div>
              </div>
            </div>

            {error && (
              <div className="alert alert-error mb-6 flex items-start gap-3 animate-slide-up">
                <IconSet.AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                <div>{error}</div>
              </div>
            )}

            {/* Questions List */}
            <div className="space-y-6 mb-8">
              {questions.map((question, idx) => (
                <div
                  key={question.id}
                  className="card p-6 border-l-4 border-brand-blue animate-slide-up"
                >
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="badge bg-gray-100 text-gray-900 font-bold">Q{idx + 1}</span>
                        <h3 className="text-lg font-semibold text-gray-900">{question.text}</h3>
                      </div>
                      <div className="flex gap-4 text-sm text-gray-600">
                        <span>⏱️ {question.timeLimit}s</span>
                        <span>⭐ {question.points} pts</span>
                        <span>📝 {question.choices.length} réponses</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleDeleteQuestion(question.id)}
                      className="text-red-600 hover:text-red-700 p-2"
                    >
                      <IconSet.Trash2 size={18} />
                    </button>
                  </div>

                  {/* Choices */}
                  <div className="space-y-2 ml-8">
                    {question.choices.map((choice) => (
                      <div key={choice.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded">
                        <div
                          className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            choice.isCorrect
                              ? 'bg-brand-green border-brand-green'
                              : 'border-gray-300'
                          }`}
                        >
                          {choice.isCorrect && <IconSet.Check size={14} className="text-white" />}
                        </div>
                        <span className="text-gray-800">{choice.text}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Add Question Form */}
            <div className="card p-6 animate-slide-up">
              <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-2">
                <IconSet.Plus size={20} className="text-brand-blue" />
                Ajouter une question
              </h3>

              <div className="space-y-6">
                {/* Question Text */}
                <div>
                  <label className="label">Texte de la question *</label>
                  <input
                    type="text"
                    placeholder="Quelle est la bonne réponse ?"
                    value={newQuestion.text}
                    onChange={(e) => setNewQuestion({ ...newQuestion, text: e.target.value })}
                    className="input"
                  />
                </div>

                {/* Time & Points */}
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label">Temps limite (secondes)</label>
                    <input
                      type="number"
                      min="10"
                      max="120"
                      value={newQuestion.timeLimit}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, timeLimit: parseInt(e.target.value) })
                      }
                      className="input"
                    />
                  </div>
                  <div>
                    <label className="label">Points</label>
                    <input
                      type="number"
                      min="10"
                      value={newQuestion.points}
                      onChange={(e) =>
                        setNewQuestion({ ...newQuestion, points: parseInt(e.target.value) })
                      }
                      className="input"
                    />
                  </div>
                </div>

                {/* Choices */}
                <div>
                  <label className="label flex items-center gap-2">
                    Réponses (min 2) *
                    <span className="text-xs text-gray-500">(cochez pour marquer correcte)</span>
                  </label>
                  <div className="space-y-3">
                    {newChoices.map((choice, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={choice.isCorrect}
                          onChange={(e) => {
                            const updated = [...newChoices]
                            updated[idx].isCorrect = e.target.checked
                            setNewChoices(updated)
                          }}
                          className="w-5 h-5 cursor-pointer"
                        />
                        <input
                          type="text"
                          placeholder={`Réponse ${idx + 1}`}
                          value={choice.text}
                          onChange={(e) => {
                            const updated = [...newChoices]
                            updated[idx].text = e.target.value
                            setNewChoices(updated)
                          }}
                          className="input flex-1"
                        />
                        {newChoices.length > 2 && (
                          <button
                            onClick={() => setNewChoices(newChoices.filter((_, i) => i !== idx))}
                            className="text-red-600 hover:text-red-700 p-2"
                          >
                            <IconSet.X size={18} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button
                    onClick={() => setNewChoices([...newChoices, { text: '', isCorrect: false }])}
                    className="text-brand-blue hover:text-brand-green text-sm font-semibold mt-3 flex items-center gap-1"
                  >
                    <IconSet.Plus size={14} />
                    Ajouter une réponse
                  </button>
                </div>

                {/* Submit */}
                <button
                  onClick={handleAddQuestion}
                  className="btn btn-primary w-full"
                  disabled={!newQuestion.text.trim()}
                >
                  <IconSet.Save size={16} />
                  Ajouter la question
                </button>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

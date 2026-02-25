'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import Link from 'next/link'

export default function Questions() {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [questions, setQuestions] = useState([])
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    supabase.from('topics').select('*').then(({ data }) => setTopics(data || []))
  }, [])

  const loadQuestions = async (topic) => {
    setSelectedTopic(topic)
    const { data } = await supabase.from('questions').select('*').eq('topic_id', topic.id)
    setQuestions(data || [])
    setCurrentQuestion(data?.[0] || null)
    setAnswer('')
    setFeedback(null)
  }

  const submitAnswer = async () => {
    if (!answer.trim()) return
    setLoading(true)
    const res = await fetch('/api/grade', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question: currentQuestion.question_text, markScheme: currentQuestion.mark_scheme, answer, marks: currentQuestion.marks })
    })
    const data = await res.json()
    setFeedback(data)
    setLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <Link href="/" className="text-emerald-400 hover:underline mb-6 block">← Back to Home</Link>
      <h1 className="text-3xl font-bold text-emerald-400 mb-6">Practice Questions</h1>

      {!selectedTopic ? (
        <div className="grid grid-cols-1 gap-4 max-w-xl">
          {topics.length === 0 && <p className="text-gray-400">No topics yet. Add some in Supabase!</p>}
          {topics.map(topic => (
            <button key={topic.id} onClick={() => loadQuestions(topic)}
              className="bg-gray-800 hover:bg-emerald-700 transition rounded-xl p-6 text-left">
              <h2 className="text-xl font-semibold">{topic.name}</h2>
            </button>
          ))}
        </div>
      ) : !currentQuestion ? (
        <div>
          <p className="text-gray-400">No questions for this topic yet.</p>
          <button onClick={() => setSelectedTopic(null)} className="mt-4 text-emerald-400 hover:underline">← Back to Topics</button>
        </div>
      ) : (
        <div className="max-w-2xl">
          <button onClick={() => { setSelectedTopic(null); setFeedback(null) }} className="text-emerald-400 hover:underline mb-4 block">← Back to Topics</button>
          <div className="bg-gray-800 rounded-2xl p-6 mb-4">
            <span className="text-emerald-400 text-sm font-semibold">{currentQuestion.marks} marks</span>
            <p className="text-lg mt-2">{currentQuestion.question_text}</p>
          </div>
          <textarea value={answer} onChange={e => setAnswer(e.target.value)}
            className="w-full bg-gray-800 rounded-xl p-4 text-white min-h-32 mb-4 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="Type your answer here..." />
          <button onClick={submitAnswer} disabled={loading}
            className="bg-emerald-600 hover:bg-emerald-500 transition rounded-xl px-6 py-3 font-semibold disabled:opacity-50">
            {loading ? 'Grading...' : 'Submit for AI Grading'}
          </button>

          {feedback && (
            <div className="mt-6 bg-gray-800 rounded-2xl p-6">
              <h3 className="text-xl font-bold text-emerald-400 mb-2">Feedback</h3>
              <p className="text-2xl font-bold mb-3">{feedback.score} / {currentQuestion.marks}</p>
              <p className="text-gray-300 whitespace-pre-wrap">{feedback.feedback}</p>
            </div>
          )}
        </div>
      )}
    </main>
  )
}
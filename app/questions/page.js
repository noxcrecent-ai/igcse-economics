'use client'
import { useState, useEffect } from 'react'
import { supabase } from '../supabase'
import { useRouter } from 'next/navigation'
import { Brain, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Questions() {
  const [topics, setTopics] = useState([])
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [currentQuestion, setCurrentQuestion] = useState(null)
  const [answer, setAnswer] = useState('')
  const [feedback, setFeedback] = useState(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    supabase.from('topics').select('*').then(({ data }) => setTopics(data || []))
  }, [])

  const loadQuestions = async (topic) => {
    setSelectedTopic(topic)
    const { data } = await supabase.from('questions').select('*').eq('topic_id', topic.id)
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
      body: JSON.stringify({
        question: currentQuestion.question_text,
        markScheme: currentQuestion.mark_scheme,
        answer,
        marks: currentQuestion.marks
      })
    })
    const data = await res.json()
    setFeedback(data)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <Brain className="w-7 h-7 text-green-600" />
          <span className="font-bold text-xl">Topic Questions</span>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {!selectedTopic ? (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <h1 className="text-3xl font-bold mb-2">Choose a Topic</h1>
            <p className="text-gray-500 mb-8">Select a topic to start practicing</p>
            <div className="grid md:grid-cols-2 gap-4">
              {topics.length === 0 && (
                <p className="text-gray-400">No topics yet. Add some in Supabase!</p>
              )}
              {topics.map((topic, i) => (
                <motion.div
                  key={topic.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: i * 0.1 }}
                  whileHover={{ y: -4, boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}
                  onClick={() => loadQuestions(topic)}
                  className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 shadow-sm"
                >
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-3">
                    <Brain className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-lg font-bold">{topic.name}</h2>
                  <p className="text-gray-400 text-sm mt-1">Click to practice</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        ) : !currentQuestion ? (
          <div>
            <p className="text-gray-500">No questions for this topic yet.</p>
            <button onClick={() => setSelectedTopic(null)} className="mt-4 text-blue-600 hover:underline">← Back to Topics</button>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <button onClick={() => { setSelectedTopic(null); setFeedback(null) }} className="flex items-center gap-1 text-blue-600 hover:underline mb-6">
              <ArrowLeft className="w-4 h-4" /> Back to Topics
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-6">
              <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">{currentQuestion.marks} marks</span>
              <p className="text-lg font-medium mt-4">{currentQuestion.question_text}</p>
            </div>

            <textarea
              value={answer}
              onChange={e => setAnswer(e.target.value)}
              className="w-full border border-gray-200 rounded-2xl p-4 bg-white min-h-36 focus:outline-none focus:ring-2 focus:ring-green-500 mb-4 shadow-sm"
              placeholder="Type your answer here..."
            />

            <motion.button
              onClick={submitAnswer}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 rounded-xl transition disabled:opacity-50"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {loading ? 'Grading...' : 'Submit for AI Grading'}
            </motion.button>

            {feedback && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="mt-6 bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
              >
                <h3 className="text-xl font-bold mb-4">Feedback</h3>
                <div className="bg-green-50 rounded-xl p-4 mb-4 text-center">
                  <span className="text-4xl font-bold text-green-600">{feedback.score}</span>
                  <span className="text-2xl text-gray-400"> / {currentQuestion.marks}</span>
                </div>
                <p className="text-gray-600 whitespace-pre-wrap">{feedback.feedback}</p>
              </motion.div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  )
}
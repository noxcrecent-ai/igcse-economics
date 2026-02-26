'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, BookOpen, CheckCircle, Loader, ChevronDown, ChevronUp, Filter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { topicQuestions } from '../data/topicQuestions'

const TYPE_COLORS = {
  define:  { bg: 'bg-blue-100',   text: 'text-blue-700',   border: 'border-blue-200',   label: 'Define',   marks: 2 },
  explain: { bg: 'bg-green-100',  text: 'text-green-700',  border: 'border-green-200',  label: 'Explain',  marks: 4 },
  analyse: { bg: 'bg-orange-100', text: 'text-orange-700', border: 'border-orange-200', label: 'Analyse',  marks: 6 },
  discuss: { bg: 'bg-purple-100', text: 'text-purple-700', border: 'border-purple-200', label: 'Discuss',  marks: 8 },
}

const TOPIC_ICONS = ['🧩', '📊', '🏢', '🏛️', '🌱', '🌍', '📝']

function QuestionCard({ q, index }) {
  const [answer, setAnswer] = useState('')
  const [showMS, setShowMS] = useState(false)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const type = TYPE_COLORS[q.type] || TYPE_COLORS.define
  const marks = type.marks

  const handleGrade = async () => {
    if (!answer.trim()) return
    setLoading(true)
    try {
      const res = await fetch('/api/grade', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q.question,
          answer,
          markScheme: q.markScheme,
          marks,
          topic: q.topic
        })
      })
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setResult({ error: 'Failed to grade. Please try again.' })
    }
    setLoading(false)
  }

  const reset = () => {
    setAnswer('')
    setResult(null)
    setShowMS(false)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4"
    >
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex items-start gap-3 flex-1">
          <span className={`${type.bg} ${type.text} text-xs font-bold px-2.5 py-1 rounded-lg flex-shrink-0`}>
            {type.label}
          </span>
          <p className="text-gray-800 font-medium leading-relaxed">{q.question}</p>
        </div>
        <span className="bg-gray-100 text-gray-500 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">
          [{marks}]
        </span>
      </div>

      {!result ? (
        <>
          <textarea
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            rows={marks <= 2 ? 3 : marks <= 4 ? 4 : marks <= 6 ? 6 : 8}
            placeholder="Write your answer here..."
            className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 resize-none text-sm mb-3"
          />
          <div className="flex items-center gap-3">
            <button
              onClick={handleGrade}
              disabled={loading || !answer.trim()}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition disabled:opacity-40 flex items-center gap-2"
            >
              {loading ? <><Loader className="w-3.5 h-3.5 animate-spin" /> Grading...</> : <><CheckCircle className="w-3.5 h-3.5" /> Grade Answer</>}
            </button>
            <button
              onClick={() => setShowMS(!showMS)}
              className="text-sm text-gray-400 hover:text-gray-600 font-semibold flex items-center gap-1 px-3 py-2 rounded-xl hover:bg-gray-50 transition"
            >
              {showMS ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {showMS ? 'Hide' : 'Show'} Mark Scheme
            </button>
          </div>
          <AnimatePresence>
            {showMS && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 bg-amber-50 border border-amber-200 rounded-xl p-4"
              >
                <p className="text-xs font-bold text-amber-700 mb-1">Mark Scheme</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{q.markScheme}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      ) : (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          {result.error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-600 text-sm">{result.error}</div>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className={`text-2xl font-black ${
                  result.score >= marks * 0.75 ? 'text-green-600' :
                  result.score >= marks * 0.5 ? 'text-orange-500' : 'text-red-500'
                }`}>
                  {result.score}/{marks}
                </div>
                <div className="flex-1 bg-gray-100 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      result.score >= marks * 0.75 ? 'bg-green-500' :
                      result.score >= marks * 0.5 ? 'bg-orange-400' : 'bg-red-400'
                    }`}
                    style={{ width: `${(result.score / marks) * 100}%` }}
                  />
                </div>
              </div>
              <div className="bg-gray-50 rounded-xl p-4 text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                {result.feedback}
              </div>
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
                <p className="text-xs font-bold text-amber-700 mb-1">Mark Scheme</p>
                <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{q.markScheme}</p>
              </div>
            </div>
          )}
          <button onClick={reset} className="mt-3 text-sm text-purple-600 hover:text-purple-800 font-semibold">
            Try again →
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}

export default function TopicQuestions() {
  const router = useRouter()
  const [selectedTopic, setSelectedTopic] = useState(null)
  const [selectedTypes, setSelectedTypes] = useState(['define', 'explain', 'analyse', 'discuss'])
  const [search, setSearch] = useState('')
  const [showFilters, setShowFilters] = useState(false)

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    )
  }

  const currentTopic = topicQuestions.find(t => t.topic === selectedTopic)

  const filteredQuestions = currentTopic?.questions.filter(q =>
    selectedTypes.includes(q.type) &&
    (!search || q.question.toLowerCase().includes(search.toLowerCase()))
  ) || []

  const typeCounts = currentTopic?.questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1
    return acc
  }, {}) || {}

  if (selectedTopic && currentTopic) {
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setSelectedTopic(null)} className="text-gray-400 hover:text-gray-600">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <BookOpen className="w-7 h-7 text-purple-600" />
            <span className="font-bold text-xl truncate">{selectedTopic}</span>
          </div>
        </motion.header>

        <main className="max-w-4xl mx-auto px-6 py-8">
          <div className="mb-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search questions..."
                className="border border-gray-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white flex-1 min-w-48"
              />
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 border border-gray-200 rounded-xl px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition"
              >
                <Filter className="w-3.5 h-3.5" />
                Filter by type
              </button>
            </div>
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex gap-2 flex-wrap pt-2"
                >
                  {Object.entries(TYPE_COLORS).map(([type, style]) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                        selectedTypes.includes(type)
                          ? `${style.bg} ${style.text} ${style.border}`
                          : 'bg-gray-100 text-gray-400 border-gray-200'
                      }`}
                    >
                      {style.label}
                      {typeCounts[type] ? <span className="opacity-70">({typeCounts[type]})</span> : null}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <p className="text-sm text-gray-500 mb-6">
            Showing <span className="font-bold text-purple-600">{filteredQuestions.length}</span> questions
          </p>

          {filteredQuestions.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p className="font-semibold">No questions match your filters</p>
            </div>
          ) : (
            filteredQuestions.map((q, i) => (
              <QuestionCard key={i} q={{ ...q, topic: selectedTopic }} index={i} />
            ))
          )}
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <BookOpen className="w-7 h-7 text-purple-600" />
          <span className="font-bold text-xl">Topic Questions</span>
        </div>
      </motion.header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Practice by Topic</h1>
          <p className="text-gray-500">701 questions with mark schemes across all 7 topics</p>
        </motion.div>

        <div className="flex gap-2 flex-wrap mb-8">
          {Object.entries(TYPE_COLORS).map(([type, style]) => (
            <span key={type} className={`${style.bg} ${style.text} text-xs font-bold px-3 py-1.5 rounded-full`}>
              {style.label} [{style.marks} marks]
            </span>
          ))}
        </div>

        <div className="grid gap-4">
          {topicQuestions.map((topic, i) => {
            const counts = topic.questions.reduce((acc, q) => {
              acc[q.type] = (acc[q.type] || 0) + 1
              return acc
            }, {})
            return (
              <motion.div
                key={topic.topic}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
                onClick={() => setSelectedTopic(topic.topic)}
                className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-4">
                  <div className="text-3xl">{TOPIC_ICONS[i]}</div>
                  <div className="flex-1">
                    <h2 className="text-lg font-bold mb-2">{topic.topic}</h2>
                    <div className="flex gap-2 flex-wrap">
                      {Object.entries(counts).map(([type, count]) => {
                        const style = TYPE_COLORS[type]
                        if (!style) return null
                        return (
                          <span key={type} className={`${style.bg} ${style.text} text-xs font-semibold px-2.5 py-1 rounded-full`}>
                            {count} {style.label}
                          </span>
                        )
                      })}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-black text-gray-700">{topic.questions.length}</div>
                    <div className="text-xs text-gray-400 font-semibold">questions</div>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
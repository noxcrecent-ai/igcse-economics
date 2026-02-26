'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { FileText, ArrowLeft, CheckCircle, Loader, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'

const availablePapers = [
  // 2024
  { id: 1, title: 'Paper 2 — May/June 2024 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2024%20Jun/0455_s24_qp_21.pdf' },
  { id: 2, title: 'Paper 2 — May/June 2024 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2024%20Jun/0455_s24_qp_22.pdf' },
  { id: 3, title: 'Paper 2 — Oct/Nov 2024 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2024%20Nov/0455_w24_qp_21.pdf' },
  { id: 4, title: 'Paper 2 — Oct/Nov 2024 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2024%20Nov/0455_w24_qp_22.pdf' },
  // 2023
  { id: 5, title: 'Paper 2 — Feb/March 2023', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2023%20Mar/0455_m23_qp_22.pdf' },
  { id: 6, title: 'Paper 2 — May/June 2023 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2023%20Jun/0455_s23_qp_21.pdf' },
  { id: 7, title: 'Paper 2 — May/June 2023 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2023%20Jun/0455_s23_qp_22.pdf' },
  { id: 8, title: 'Paper 2 — Oct/Nov 2023 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2023%20Nov/0455_w23_qp_21.pdf' },
  { id: 9, title: 'Paper 2 — Oct/Nov 2023 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2023%20Nov/0455_w23_qp_22.pdf' },
  // 2022
  { id: 10, title: 'Paper 2 — Feb/March 2022', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/papers/ECO_1.pdf' },
  { id: 11, title: 'Paper 2 — May/June 2022 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2022%20Jun/0455_s22_qp_21.pdf' },
  { id: 12, title: 'Paper 2 — May/June 2022 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2022%20Jun/0455_s22_qp_22.pdf' },
  { id: 13, title: 'Paper 2 — Oct/Nov 2022 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2022%20Nov/0455_w22_qp_21.pdf' },
  { id: 14, title: 'Paper 2 — Oct/Nov 2022 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2022%20Nov/0455_w22_qp_22.pdf' },
  // 2021
  { id: 15, title: 'Paper 2 — Feb/March 2021', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2021%20Mar/0455_m21_qp_22.pdf' },
  { id: 16, title: 'Paper 2 — May/June 2021 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2021%20Jun/0455_s21_qp_21.pdf' },
  { id: 17, title: 'Paper 2 — May/June 2021 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2021%20Jun/0455_s21_qp_22.pdf' },
  { id: 18, title: 'Paper 2 — Oct/Nov 2021 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2021%20Nov/0455_w21_qp_21.pdf' },
  { id: 19, title: 'Paper 2 — Oct/Nov 2021 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2021%20Nov/0455_w21_qp_22.pdf' },
  // 2020
  { id: 20, title: 'Paper 2 — Feb/March 2020', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2020%20Mar/0455_m20_qp_22.pdf' },
  { id: 21, title: 'Paper 2 — May/June 2020 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2020%20Jun/0455_s20_qp_21.pdf' },
  { id: 22, title: 'Paper 2 — May/June 2020 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2020%20Jun/0455_s20_qp_22.pdf' },
  { id: 23, title: 'Paper 2 — Oct/Nov 2020 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2020%20Nov/0455_w20_qp_21.pdf' },
  { id: 24, title: 'Paper 2 — Oct/Nov 2020 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2020%20Nov/0455_w20_qp_22.pdf' },
  // 2019
  { id: 25, title: 'Paper 2 — Feb/March 2019', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2019%20Mar/0455_m19_qp_22.pdf' },
  { id: 26, title: 'Paper 2 — May/June 2019 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2019%20Jun/0455_s19_qp_21.pdf' },
  { id: 27, title: 'Paper 2 — May/June 2019 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2019%20Jun/0455_s19_qp_22.pdf' },
  { id: 28, title: 'Paper 2 — Oct/Nov 2019 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2019%20Nov/0455_w19_qp_21.pdf' },
  { id: 29, title: 'Paper 2 — Oct/Nov 2019 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2019%20Nov/0455_w19_qp_22.pdf' },
  // 2018
  { id: 30, title: 'Paper 2 — Feb/March 2018', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2018%20Mar/0455_m18_qp_22.pdf' },
  { id: 31, title: 'Paper 2 — May/June 2018 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2018%20Jun/0455_s18_qp_21.pdf' },
  { id: 32, title: 'Paper 2 — May/June 2018 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2018%20Jun/0455_s18_qp_22.pdf' },
  { id: 33, title: 'Paper 2 — Oct/Nov 2018 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2018%20Nov/0455_w18_qp_21.pdf' },
  { id: 34, title: 'Paper 2 — Oct/Nov 2018 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2018%20Nov/0455_w18_qp_22.pdf' },
  // 2017
  { id: 35, title: 'Paper 2 — Feb/March 2017', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2017%20Mar/0455_m17_qp_22.pdf' },
  { id: 36, title: 'Paper 2 — May/June 2017 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2017%20Jun/0455_s17_qp_21.pdf' },
  { id: 37, title: 'Paper 2 — May/June 2017 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2017%20Jun/0455_s17_qp_22.pdf' },
  { id: 38, title: 'Paper 2 — Oct/Nov 2017 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2017%20Nov/0455_w17_qp_21.pdf' },
  { id: 39, title: 'Paper 2 — Oct/Nov 2017 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2017%20Nov/0455_w17_qp_22.pdf' },
  // 2016
  { id: 40, title: 'Paper 2 — Feb/March 2016', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2016%20Mar/0455_m16_qp_22.pdf' },
  { id: 41, title: 'Paper 2 — May/June 2016 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2016%20Jun/0455_s16_qp_21.pdf' },
  { id: 42, title: 'Paper 2 — May/June 2016 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2016%20Jun/0455_s16_qp_22.pdf' },
  { id: 43, title: 'Paper 2 — Oct/Nov 2016 Variant 1', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2016%20Nov/0455_w16_qp_21.pdf' },
  { id: 44, title: 'Paper 2 — Oct/Nov 2016 Variant 2', time: '2 hours 15 minutes', totalMarks: 90, pdfUrl: 'https://pastpapers.papacambridge.com/Cambridge%20International%20Examinations%20(CIE)/IGCSE/Economics%20(0455)/2016%20Nov/0455_w16_qp_22.pdf' },
]
export default function Papers() {
  const router = useRouter()
  const [step, setStep] = useState('list')
  const [selectedPaper, setSelectedPaper] = useState(null)
  const [extractedData, setExtractedData] = useState(null)
  const [extracting, setExtracting] = useState(false)
  const [selectedSectionB, setSelectedSectionB] = useState([])
  const [answers, setAnswers] = useState({})
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [error, setError] = useState(null)

  const handleSelectPaper = async (paper) => {
    setSelectedPaper(paper)
    setExtracting(true)
    setStep('extracting')
    setError(null)
    try {
      const res = await fetch('/api/extract-paper', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ pdfUrl: paper.pdfUrl })
      })
      const data = await res.json()
      if (data.error) {
        setError(data.error)
        setStep('list')
      } else {
        setExtractedData(data)
        setStep('choose')
      }
    } catch (e) {
      setError('Failed to extract paper. Please try again.')
      setStep('list')
    }
    setExtracting(false)
  }

  const toggleSectionB = (qNum) => {
    setSelectedSectionB(prev =>
      prev.includes(qNum) ? prev.filter(n => n !== qNum) : prev.length < 3 ? [...prev, qNum] : prev
    )
  }

  const getSelectedQuestions = () => {
    if (!extractedData) return []
    const secA = extractedData.sectionA.questions
    const secB = extractedData.sectionB.questions.filter(q => selectedSectionB.includes(q.number)).flatMap(q => q.parts)
    return [...secA, ...secB]
  }

  const handleSubmit = async () => {
    setLoading(true)
    const allQ = getSelectedQuestions()
    const res = await fetch('/api/grade-paper', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questions: allQ.map(q => ({ number: q.number, text: q.text, marks: q.marks })),
        answers: allQ.map(q => answers[q.number] || ''),
        sourceText: extractedData.sourceText
      })
    })
    const data = await res.json()
    setResults(data)
    setStep('results')
    setLoading(false)
  }

  const resetAll = () => {
    setStep('list')
    setSelectedPaper(null)
    setExtractedData(null)
    setSelectedSectionB([])
    setAnswers({})
    setResults(null)
    setError(null)
  }

  if (step === 'extracting') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-md">
          <motion.div animate={{ rotate: 360 }} transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-purple-600" />
          </motion.div>
          <h2 className="text-2xl font-bold mb-2">Reading Paper...</h2>
          <p className="text-gray-500">AI is extracting all questions from the PDF. This takes about 15 seconds.</p>
        </motion.div>
      </div>
    )
  }

  if (step === 'results' && results) {
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={resetAll} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
            <FileText className="w-7 h-7 text-purple-600" />
            <span className="font-bold text-xl">Your Results</span>
          </div>
        </motion.header>
        <main className="max-w-4xl mx-auto px-6 py-10 space-y-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl p-10 text-white text-center">
            <p className="text-lg opacity-80 mb-2">{selectedPaper.title}</p>
            <div className="text-8xl font-black mb-1">{results.totalScore}<span className="text-4xl font-normal opacity-70">/90</span></div>
            <div className="text-3xl font-bold opacity-90">{results.percentage}%</div>
          </motion.div>
          {[
            { label: '✅ Strengths', content: results.strengths, color: 'text-green-600', bg: 'bg-green-50' },
            { label: '❌ Weaknesses', content: results.weaknesses, color: 'text-red-500', bg: 'bg-red-50' },
            { label: '🚀 How to Improve', content: results.improvements, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: '📝 Detailed Feedback', content: results.detailedFeedback, color: 'text-gray-700', bg: 'bg-white' },
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
              className={`${item.bg} rounded-2xl border border-gray-100 shadow-sm p-6`}>
              <h2 className={`text-lg font-bold ${item.color} mb-3`}>{item.label}</h2>
              <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">{item.content}</p>
            </motion.div>
          ))}
        </main>
      </div>
    )
  }

  if (step === 'answer' && extractedData) {
    const secAQuestions = extractedData.sectionA.questions
    const secBSelected = extractedData.sectionB.questions.filter(q => selectedSectionB.includes(q.number))
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={() => setStep('choose')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
            <FileText className="w-7 h-7 text-purple-600" />
            <span className="font-bold text-xl">{extractedData.title}</span>
          </div>
        </motion.header>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-blue-50 border-l-4 border-blue-400 rounded-2xl p-6 mb-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-5 h-5 text-blue-600" />
              <h2 className="font-bold text-blue-700">Source Material — Read carefully before answering Section A</h2>
            </div>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap text-sm font-mono">{extractedData.sourceText}</p>
          </motion.div>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-purple-600 text-white font-bold px-4 py-1.5 rounded-full text-sm">Section A</div>
              <p className="text-gray-500 text-sm">Answer ALL parts of Question 1</p>
            </div>
            {secAQuestions.map((q, i) => (
              <motion.div key={q.number} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-start gap-3">
                    <span className="bg-purple-100 text-purple-700 font-black text-sm px-2.5 py-1 rounded-lg flex-shrink-0">Q{q.number}</span>
                    <p className="text-gray-800 font-medium leading-relaxed">{q.text}</p>
                  </div>
                  <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">[{q.marks}]</span>
                </div>
                <textarea value={answers[q.number] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.number]: e.target.value }))}
                  className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-400 bg-gray-50 resize-none text-sm"
                  rows={q.marks <= 2 ? 3 : q.marks <= 4 ? 5 : q.marks <= 6 ? 7 : 9} placeholder="Write your answer here..." />
              </motion.div>
            ))}
          </div>

          <div className="mb-10">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-blue-600 text-white font-bold px-4 py-1.5 rounded-full text-sm">Section B</div>
              <p className="text-gray-500 text-sm">Questions {selectedSectionB.join(', ')}</p>
            </div>
            {secBSelected.map((question) => (
              <div key={question.number} className="mb-8">
                <div className="bg-amber-50 border-l-4 border-amber-400 rounded-xl p-5 mb-4">
                  <p className="text-sm font-bold text-amber-700 mb-2">Question {question.number} — Source Material</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{question.stimulus}</p>
                </div>
                {question.parts.map((q, i) => (
                  <motion.div key={q.number} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-4">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-start gap-3">
                        <span className="bg-blue-100 text-blue-700 font-black text-sm px-2.5 py-1 rounded-lg flex-shrink-0">Q{q.number}</span>
                        <p className="text-gray-800 font-medium leading-relaxed">{q.text}</p>
                      </div>
                      <span className="bg-gray-100 text-gray-600 text-xs font-bold px-3 py-1.5 rounded-full flex-shrink-0">[{q.marks}]</span>
                    </div>
                    <textarea value={answers[q.number] || ''} onChange={e => setAnswers(prev => ({ ...prev, [q.number]: e.target.value }))}
                      className="w-full border border-gray-200 rounded-xl p-4 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 bg-gray-50 resize-none text-sm"
                      rows={q.marks <= 2 ? 3 : q.marks <= 4 ? 5 : q.marks <= 6 ? 7 : 9} placeholder="Write your answer here..." />
                  </motion.div>
                ))}
              </div>
            ))}
          </div>

          <motion.button onClick={handleSubmit} disabled={loading}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-5 rounded-2xl text-lg transition disabled:opacity-50 flex items-center justify-center gap-3"
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}>
            {loading ? <><Loader className="w-5 h-5 animate-spin" /> AI is grading your paper...</> : <><CheckCircle className="w-5 h-5" /> Submit Paper for AI Grading</>}
          </motion.button>
        </main>
      </div>
    )
  }

  if (step === 'choose' && extractedData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
          <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
            <button onClick={resetAll} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
            <FileText className="w-7 h-7 text-purple-600" />
            <span className="font-bold text-xl">Choose Section B Questions</span>
          </div>
        </motion.header>
        <main className="max-w-4xl mx-auto px-6 py-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <h1 className="text-3xl font-bold mb-2">Select 3 Questions</h1>
            <p className="text-gray-500">Selected: <span className="font-bold text-purple-600">{selectedSectionB.length}/3</span></p>
          </motion.div>
          <div className="grid gap-5 mb-8">
            {extractedData.sectionB.questions.map((q, i) => {
              const isSelected = selectedSectionB.includes(q.number)
              const isDisabled = !isSelected && selectedSectionB.length >= 3
              return (
                <motion.div key={q.number} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
                  onClick={() => !isDisabled && toggleSectionB(q.number)}
                  className={`rounded-2xl border-2 p-6 cursor-pointer transition ${isSelected ? 'border-purple-500 bg-purple-50' : isDisabled ? 'border-gray-100 bg-gray-50 opacity-40 cursor-not-allowed' : 'border-gray-100 bg-white hover:border-purple-300 hover:shadow-md'}`}>
                  <div className="flex items-start gap-4">
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-1 ${isSelected ? 'bg-purple-600 border-purple-600' : 'border-gray-300'}`}>
                      {isSelected && <CheckCircle className="w-5 h-5 text-white" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl mb-2">Question {q.number}</h3>
                      <p className={`text-sm leading-relaxed mb-4 ${isSelected ? 'text-purple-700' : 'text-gray-500'}`}>{q.stimulus}</p>
                      <div className="space-y-2">
                        {q.parts.map(p => (
                          <div key={p.number} className={`flex items-start gap-3 rounded-xl p-3 border ${isSelected ? 'bg-white border-purple-100' : 'bg-gray-50 border-gray-100'}`}>
                            <span className={`font-black text-xs px-2 py-1 rounded-lg flex-shrink-0 ${isSelected ? 'bg-purple-100 text-purple-700' : 'bg-gray-200 text-gray-500'}`}>({p.number.slice(-1)})</span>
                            <p className="text-gray-600 text-sm flex-1 leading-relaxed">{p.text}</p>
                            <span className="text-xs text-gray-400 flex-shrink-0 font-semibold">[{p.marks}]</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </div>
          <motion.button onClick={() => setStep('answer')} disabled={selectedSectionB.length !== 3}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-2xl text-lg transition disabled:opacity-40 disabled:cursor-not-allowed"
            whileHover={selectedSectionB.length === 3 ? { scale: 1.01 } : {}} whileTap={selectedSectionB.length === 3 ? { scale: 0.99 } : {}}>
            {selectedSectionB.length === 3 ? 'Start Paper →' : `Select ${3 - selectedSectionB.length} more question${3 - selectedSectionB.length !== 1 ? 's' : ''}`}
          </motion.button>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.header className="bg-white border-b sticky top-0 z-50 shadow-sm" initial={{ y: -100 }} animate={{ y: 0 }}>
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center gap-3">
          <button onClick={() => router.push('/dashboard')} className="text-gray-400 hover:text-gray-600"><ArrowLeft className="w-5 h-5" /></button>
          <FileText className="w-7 h-7 text-purple-600" />
          <span className="font-bold text-xl">Past Papers</span>
        </div>
      </motion.header>
      <main className="max-w-4xl mx-auto px-6 py-10">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Past Papers</h1>
          <p className="text-gray-500">Select a paper — AI reads it and creates answer boxes automatically</p>
        </motion.div>
        {error && <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-600 text-sm">{error}</div>}
        <div className="grid gap-4">
          {availablePapers.map((paper, i) => (
            <motion.div key={paper.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
              whileHover={{ y: -3, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
              onClick={() => handleSelectPaper(paper)}
              className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 shadow-sm flex items-center gap-5">
              <div className="bg-purple-100 w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0">
                <FileText className="w-7 h-7 text-purple-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-bold">{paper.title}</h2>
                <div className="flex gap-3 mt-2 flex-wrap">
                  <span className="text-xs bg-purple-100 text-purple-600 font-semibold px-3 py-1 rounded-full">{paper.time}</span>
                  <span className="text-xs bg-gray-100 text-gray-500 font-semibold px-3 py-1 rounded-full">{paper.totalMarks} marks</span>
                  <span className="text-xs bg-green-100 text-green-600 font-semibold px-3 py-1 rounded-full">AI Auto-Extract</span>
                </div>
              </div>
              <span className="text-purple-600 font-bold text-lg">→</span>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  )
}
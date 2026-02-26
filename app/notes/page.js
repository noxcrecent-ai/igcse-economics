'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { BookOpen, ArrowLeft, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const notes = [
  {
    id: 1,
    title: 'Topic 1 — The Basic Economic Problem',
    description: 'Scarcity, opportunity cost, factors of production',
    color: 'bg-blue-100',
    iconColor: 'text-blue-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/TOPIC-1-THE-BASIC-ECONOMIC-PROBLEM.pdf'
  },
  {
    id: 2,
    title: 'Topic 2 — The Allocation of Resources',
    description: 'Market systems, supply and demand, price mechanism',
    color: 'bg-green-100',
    iconColor: 'text-green-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/TOPIC-2-THE-ALLOCATION-OF-RESOURCES.pdf'
  },
  {
    id: 3,
    title: 'Topic 3 — Microeconomic Decision Makers',
    description: 'Consumers, producers, firms and their decisions',
    color: 'bg-purple-100',
    iconColor: 'text-purple-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/TOPIC-3-MICROECONOMIC-DECISION-MAKERS.pdf'
  },
  {
    id: 4,
    title: 'Topic 4 — Government & the Macroeconomy',
    description: 'Fiscal policy, monetary policy, macroeconomic objectives',
    color: 'bg-orange-100',
    iconColor: 'text-orange-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/TOPIC-4.pdf'
  },
  {
    id: 5,
    title: 'Topic 5 — Economic Development',
    description: 'Developing economies, poverty, inequality',
    color: 'bg-pink-100',
    iconColor: 'text-pink-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/TOPIC-5.pdf'
  },
  {
    id: 6,
    title: 'International Specialisation',
    description: 'Trade, comparative advantage, globalisation',
    color: 'bg-teal-100',
    iconColor: 'text-teal-600',
    url: 'https://ucfoyvjvwqubxqqyzisu.supabase.co/storage/v1/object/public/notes/61-International-Specialisation.pdf'
  }
]

export default function Notes() {
  const router = useRouter()
  const [selectedNote, setSelectedNote] = useState(null)

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
          <BookOpen className="w-7 h-7 text-blue-600" />
          <span className="font-bold text-xl">Study Notes</span>
        </div>
      </motion.header>

      <main className="max-w-6xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">Economics Notes</h1>
          <p className="text-gray-500">Click any topic to read the notes directly in your browser</p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => (
            <motion.div
              key={note.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              onClick={() => setSelectedNote(note)}
              className="bg-white rounded-2xl p-6 cursor-pointer border border-gray-100 shadow-sm"
            >
              <div className={`${note.color} w-14 h-14 rounded-full flex items-center justify-center mb-4`}>
                <BookOpen className={`w-7 h-7 ${note.iconColor}`} />
              </div>
              <h2 className="text-lg font-bold mb-2">{note.title}</h2>
              <p className="text-gray-400 text-sm mb-4">{note.description}</p>
              <span className={`text-sm font-semibold ${note.iconColor}`}>Read Notes →</span>
            </motion.div>
          ))}
        </div>
      </main>

      {/* PDF Viewer Modal */}
      <AnimatePresence>
        {selectedNote && (
          <motion.div
            className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedNote(null)}
          >
            <motion.div
              className="bg-white rounded-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={e => e.stopPropagation()}
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b">
                <h2 className="font-bold text-lg">{selectedNote.title}</h2>
                <button
                  onClick={() => setSelectedNote(null)}
                  className="text-gray-400 hover:text-gray-600 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              {/* PDF Viewer */}
              <div className="flex-1 overflow-hidden">
                <iframe
                  src={`${selectedNote.url}#toolbar=1&view=FitH`}
                  className="w-full h-full"
                  title={selectedNote.title}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
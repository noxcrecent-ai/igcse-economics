'use client'
import { useRouter } from 'next/navigation'
import { BookOpen, Brain, FileText, LogOut, User } from 'lucide-react'
import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const router = useRouter()
  const [user, setUser] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('igcse_user')
    if (!stored) router.push('/login')
    else setUser(stored)
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('igcse_user')
    router.push('/')
  }

  const cards = [
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      bg: 'bg-blue-100',
      title: 'Study Notes',
      desc: 'Access comprehensive notes organized by topic',
      btn: 'Browse Notes',
      btnColor: 'bg-blue-600 hover:bg-blue-700',
      href: '/notes',
      progress: null
    },
    {
      icon: <Brain className="w-8 h-8 text-green-600" />,
      bg: 'bg-green-100',
      title: 'Topic Questions',
      desc: 'Practice questions with instant AI-powered feedback',
      btn: 'Start Practicing',
      btnColor: 'bg-green-600 hover:bg-green-700',
      href: '/questions',
      progress: { value: 47, total: 100, color: 'bg-green-600' }
    },
    {
      icon: <FileText className="w-8 h-8 text-purple-600" />,
      bg: 'bg-purple-100',
      title: 'Past Papers',
      desc: 'Complete full past papers with AI auto-correction',
      btn: 'Take a Test',
      btnColor: 'bg-purple-600 hover:bg-purple-700',
      href: '/papers',
      progress: { value: 3, total: 12, color: 'bg-purple-600' }
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.header
        className="bg-white border-b sticky top-0 z-50 shadow-sm"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl">IGCSE Economics</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-gray-600">
              <User className="w-5 h-5" />
              <span className="text-sm font-medium">{user}</span>
            </div>
            <motion.button
              onClick={handleLogout}
              className="flex items-center gap-2 border border-gray-200 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogOut className="w-4 h-4" />
              Logout
            </motion.button>
          </div>
        </div>
      </motion.header>

      {/* Main */}
      <main className="max-w-6xl mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold mb-3">Welcome back! 👋</h1>
          <p className="text-xl text-gray-500">Choose what you'd like to work on today</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-8">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + i * 0.1 }}
              whileHover={{ y: -6, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
              className="bg-white rounded-2xl shadow-sm p-6 cursor-pointer border border-gray-100"
              onClick={() => router.push(card.href)}
            >
              <div className={`${card.bg} w-16 h-16 rounded-full flex items-center justify-center mb-4`}>
                {card.icon}
              </div>
              <h2 className="text-xl font-bold mb-2">{card.title}</h2>
              <p className="text-gray-500 mb-4">{card.desc}</p>
              {card.progress && (
                <div className="mb-4">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-500">Completed</span>
                    <span className="font-semibold">{card.progress.value}/{card.progress.total}</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <motion.div
                      className={`${card.progress.color} h-2 rounded-full`}
                      initial={{ width: 0 }}
                      animate={{ width: `${(card.progress.value / card.progress.total) * 100}%` }}
                      transition={{ duration: 1, delay: 0.5 }}
                    />
                  </div>
                </div>
              )}
              <button
                className={`w-full ${card.btnColor} text-white py-2.5 rounded-xl font-medium transition`}
                onClick={(e) => { e.stopPropagation(); router.push(card.href) }}
              >
                {card.btn}
              </button>
            </motion.div>
          ))}
        </div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.7 }}
          className="mt-12"
        >
          <h2 className="text-2xl font-bold mb-6">Recent Activity</h2>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 space-y-4">
            {[
              { icon: <Brain className="w-6 h-6 text-blue-600" />, bg: 'bg-blue-50', text: 'Completed Supply & Demand questions', sub: 'Score: 85% • 2 hours ago' },
              { icon: <FileText className="w-6 h-6 text-green-600" />, bg: 'bg-green-50', text: 'Completed 2023 Economics Paper', sub: 'Score: 92% • Yesterday' },
              { icon: <BookOpen className="w-6 h-6 text-purple-600" />, bg: 'bg-purple-50', text: 'Reviewed Market Structures notes', sub: '2 days ago' },
            ].map((item, i) => (
              <motion.div
                key={i}
                className={`flex items-center gap-4 p-4 ${item.bg} rounded-xl`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.8 + i * 0.1 }}
                whileHover={{ scale: 1.02, x: 5 }}
              >
                {item.icon}
                <div>
                  <p className="font-medium">{item.text}</p>
                  <p className="text-sm text-gray-500">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  )
}
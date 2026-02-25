'use client'
import { useRouter } from 'next/navigation'
import { BookOpen, Brain, Award, Users } from 'lucide-react'
import { motion, useInView } from 'framer-motion'
import { useRef } from 'react'

export default function About() {
  const router = useRouter()
  const featuresRef = useRef(null)
  const howItWorksRef = useRef(null)
  const aboutUsRef = useRef(null)
  const featuresInView = useInView(featuresRef, { once: true, amount: 0.3 })
  const howItWorksInView = useInView(howItWorksRef, { once: true, amount: 0.3 })
  const aboutUsInView = useInView(aboutUsRef, { once: true, amount: 0.3 })

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">

      {/* Header */}
      <motion.header
        className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-8 h-8 text-blue-600" />
            <span className="font-bold text-xl">IGCSE Economics</span>
          </div>
          <motion.button
            onClick={() => router.push('/login')}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-6 py-2.5 rounded-xl transition"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Get Started
          </motion.button>
        </div>
      </motion.header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 py-20">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Master IGCSE Economics with AI-Powered Learning
            </h1>
            <p className="text-xl text-gray-500 mb-8">
              Access comprehensive notes, practice topic-wise questions, and tackle past papers — all with instant AI feedback to accelerate your learning.
            </p>
            <motion.button
              onClick={() => router.push('/login')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-xl text-lg transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start Learning Now
            </motion.button>
          </motion.div>
          <motion.div
            className="rounded-2xl overflow-hidden shadow-2xl"
            initial={{ opacity: 0, scale: 0.9, x: 50 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <img
              src="https://images.unsplash.com/photo-1667655861998-46fe4c29a4cf?w=800&q=80"
              alt="Students studying"
              className="w-full h-96 object-cover"
            />
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section ref={featuresRef} className="py-20 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            Everything You Need to Succeed
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <BookOpen className="w-8 h-8 text-blue-600" />, bg: 'bg-blue-100', title: 'Comprehensive Notes', desc: 'Access detailed, well-organized study notes covering all topics. Perfect for revision and quick reference.' },
              { icon: <Brain className="w-8 h-8 text-green-600" />, bg: 'bg-green-100', title: 'Topic-Wise Questions', desc: 'Practice questions organized by topic with AI-powered instant feedback. Identify weak areas and improve.' },
              { icon: <Award className="w-8 h-8 text-purple-600" />, bg: 'bg-purple-100', title: 'Past Papers', desc: 'Complete full-length past papers with AI auto-correction. Get detailed feedback and scoring.' },
            ].map((f, i) => (
              <motion.div
                key={f.title}
                className="p-8 rounded-2xl border-2 border-gray-100 hover:shadow-xl transition cursor-pointer"
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -6 }}
              >
                <div className={`${f.bg} w-16 h-16 rounded-full flex items-center justify-center mb-6`}>
                  {f.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{f.title}</h3>
                <p className="text-gray-500">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={howItWorksRef} className="py-20 bg-gray-50">
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            className="text-4xl font-bold text-center mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={howItWorksInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            How It Works
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              className="rounded-2xl overflow-hidden shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.6 }}
            >
              <img
                src="https://images.unsplash.com/photo-1673515324976-edc94ae391f6?w=800&q=80"
                alt="Online learning"
                className="w-full h-96 object-cover"
              />
            </motion.div>
            <div className="space-y-6">
              {[
                { n: 1, title: 'Sign Up & Get Started', desc: 'Create your account and access all study materials instantly.' },
                { n: 2, title: 'Study & Practice', desc: 'Review notes, answer questions, and complete past papers at your own pace.' },
                { n: 3, title: 'Get AI Feedback', desc: 'Receive instant corrections and detailed explanations to improve your understanding.' },
              ].map((step, i) => (
                <motion.div
                  key={step.n}
                  className="flex gap-4"
                  initial={{ opacity: 0, x: 30 }}
                  animate={howItWorksInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.15 }}
                >
                  <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold flex-shrink-0">
                    {step.n}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold mb-1">{step.title}</h3>
                    <p className="text-gray-500">{step.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Us */}
      <section ref={aboutUsRef} className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={aboutUsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <Users className="w-16 h-16 text-blue-600 mx-auto mb-6" />
            <h2 className="text-4xl font-bold mb-6">About This Platform</h2>
            <p className="text-xl text-gray-500 mb-4">
              Built specifically for IGCSE Economics 0455 students. Practice with real past paper questions, get AI-graded feedback, and access comprehensive notes — all in one place.
            </p>
            <p className="text-gray-500 mb-12">
              Whether you're preparing for your exams or want to strengthen your understanding of economics, this platform adapts to your needs.
            </p>
            <div className="grid md:grid-cols-3 gap-8">
              {[
                { stat: '100+', label: 'Questions Available' },
                { stat: 'Free', label: 'AI Grading' },
                { stat: '0455', label: 'Cambridge Spec' },
              ].map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={aboutUsInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">{s.stat}</div>
                  <div className="text-gray-500">{s.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center">
        <motion.h2
          className="text-4xl font-bold mb-6"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          Ready to Start Studying?
        </motion.h2>
        <motion.p
          className="text-xl mb-8 max-w-2xl mx-auto opacity-90"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.15 }}
        >
          Join students who are already achieving their economics goals.
        </motion.p>
        <motion.button
          onClick={() => router.push('/login')}
          className="bg-white text-blue-600 font-bold px-8 py-4 rounded-xl text-lg hover:bg-gray-50 transition"
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Get Started for Free
        </motion.button>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 text-center">
        <p>© 2026 IGCSE Economics 0455. All rights reserved.</p>
      </footer>

    </div>
  )
}
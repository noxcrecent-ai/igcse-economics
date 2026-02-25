import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-2 text-emerald-400">IGCSE Economics</h1>
        <p className="text-gray-400 mb-12 text-lg">0455 Study Platform</p>

        <div className="grid grid-cols-1 gap-6">
          <Link href="/questions">
            <div className="bg-gray-800 hover:bg-emerald-700 transition rounded-2xl p-8 cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">📝 Practice Questions</h2>
              <p className="text-gray-300">Answer topic-wise 6 and 8 marker questions with AI grading</p>
            </div>
          </Link>

          <Link href="/papers">
            <div className="bg-gray-800 hover:bg-emerald-700 transition rounded-2xl p-8 cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">📄 Past Papers</h2>
              <p className="text-gray-300">Practice full past papers year by year</p>
            </div>
          </Link>

          <Link href="/notes">
            <div className="bg-gray-800 hover:bg-emerald-700 transition rounded-2xl p-8 cursor-pointer">
              <h2 className="text-2xl font-semibold mb-2">📚 Notes</h2>
              <p className="text-gray-300">Access your revision notes by topic</p>
            </div>
          </Link>
        </div>
      </div>
    </main>
  )
}
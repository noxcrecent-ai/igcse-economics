export async function POST(req) {
  const { question, markScheme, answer, marks } = await req.json()

  const prompt = `You are an IGCSE Economics examiner for Cambridge 0455.

Question: ${question}
Total marks: ${marks}
Mark Scheme: ${markScheme}
Student's Answer: ${answer}

Grade this answer strictly according to the mark scheme. Reply with only these two lines:
SCORE: [number]
FEEDBACK: [detailed feedback]`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  const scoreMatch = text.match(/SCORE:\s*(\d+)/)
  const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/i)

  return Response.json({
    score: scoreMatch ? scoreMatch[1] : '?',
    feedback: feedbackMatch ? feedbackMatch[1].trim() : text
  })
}
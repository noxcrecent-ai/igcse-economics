export async function POST(req) {
  const { question, answer, markScheme, marks, topic } = await req.json()

  const prompt = `You are a strict Cambridge IGCSE Economics 0455 examiner.

Topic: ${topic || 'Economics'}
Question: ${question}
Marks available: ${marks}
Mark Scheme: ${markScheme || 'Grade based on economics knowledge'}
Student Answer: ${answer}

Grade this answer strictly using the mark scheme. 
- Award marks only for correct economic points
- Be specific about what was good and what was missing
- Reference the mark scheme in your feedback

Respond in this exact format:
SCORE: X
FEEDBACK: your detailed feedback here explaining marks awarded and lost`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 1000
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  const scoreMatch = text.match(/SCORE:\s*(\d+)/)
  const feedbackMatch = text.match(/FEEDBACK:\s*([\s\S]+)/)

  return Response.json({
    score: scoreMatch ? parseInt(scoreMatch[1]) : 0,
    feedback: feedbackMatch ? feedbackMatch[1].trim() : text
  })
}
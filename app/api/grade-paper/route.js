export async function POST(req) {
  const { questions, answers, sourceText } = await req.json()

  const questionsAndAnswers = questions.map((q, i) => `
Question ${q.number} (${q.marks} marks): ${q.text}
Student's Answer: ${answers[i] || 'No answer provided'}
`).join('\n')

  const prompt = `You are an experienced IGCSE Economics examiner for Cambridge 0455.

Source Material Context:
${sourceText}

Here are all the student's answers for this past paper:
${questionsAndAnswers}

Please grade ALL answers and provide a comprehensive report in this EXACT format:

TOTAL_SCORE: [number]/90
PERCENTAGE: [number]%

QUESTION_SCORES:
${questions.map(q => `Q${q.number}: [score]/${q.marks}`).join('\n')}

STRENGTHS:
[List 3 specific strengths shown across all answers]

WEAKNESSES:
[List 3 specific areas where marks were lost]

IMPROVEMENTS:
[List 3 specific things the student should do to improve]

DETAILED_FEEDBACK:
[For each question, give 1-2 sentences of specific feedback]`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.3,
      max_tokens: 4000
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  const totalMatch = text.match(/TOTAL_SCORE:\s*(\d+)\/90/)
  const percentMatch = text.match(/PERCENTAGE:\s*(\d+)%/)
  const strengthsMatch = text.match(/STRENGTHS:\s*([\s\S]+?)(?=WEAKNESSES:)/)
  const weaknessesMatch = text.match(/WEAKNESSES:\s*([\s\S]+?)(?=IMPROVEMENTS:)/)
  const improvementsMatch = text.match(/IMPROVEMENTS:\s*([\s\S]+?)(?=DETAILED_FEEDBACK:)/)
  const feedbackMatch = text.match(/DETAILED_FEEDBACK:\s*([\s\S]+)/)

  return Response.json({
    totalScore: totalMatch ? totalMatch[1] : '?',
    percentage: percentMatch ? percentMatch[1] : '?',
    strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
    weaknesses: weaknessesMatch ? weaknessesMatch[1].trim() : '',
    improvements: improvementsMatch ? improvementsMatch[1].trim() : '',
    detailedFeedback: feedbackMatch ? feedbackMatch[1].trim() : text,
    raw: text
  })
}
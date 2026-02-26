export async function POST(req) {
  const { questions, answers, sourceText } = await req.json()

  const questionsText = questions.map((q, i) =>
    `Q${q.number} [${q.marks} marks]
Question: ${q.text}
Mark Scheme: ${q.markScheme || 'Grade based on economics knowledge'}
Student Answer: ${answers[i] || '(no answer)'}
`).join('\n')

  const prompt = `You are a strict Cambridge IGCSE Economics 0455 examiner. You must grade exactly like Cambridge does.

Here are examples of how Cambridge grades answers:

EXAMPLE 1:
Question: Define price elasticity of demand. [2 marks]
Mark Scheme: A measure of the responsiveness of quantity demanded to a change in price. Award 1 mark for responsiveness/sensitivity and 1 mark for linking quantity demanded to price change.
Student Answer: Price elasticity of demand measures how much demand changes when price changes.
Examiner Grade: 1/2 — Correct idea but lacks precise economic terminology. Gets 1 mark for linking demand to price but misses the technical definition.

EXAMPLE 2:
Question: Explain two reasons why a government may impose a maximum price. [4 marks]
Mark Scheme: Award up to 2 marks per reason: 1 mark for identifying reason + 1 mark for development.
Student Answer: A government may impose a maximum price to keep prices low for consumers. This helps poor people afford essential goods like food and housing. Another reason is to control inflation by stopping prices rising too high.
Examiner Grade: 4/4 — First reason fully developed with example. Second reason also developed. Full marks.

EXAMPLE 3:
Question: Analyse how a rise in interest rates might affect the current account of the balance of payments. [6 marks]
Mark Scheme: Award marks for chains of reasoning: interest rates → consumer spending → imports → current account. Interest rates → exchange rate → export competitiveness → current account.
Student Answer: If interest rates rise, people pay more on mortgages so they have less money to spend. This means they buy less imports which improves the current account. Also businesses have higher costs so they may raise prices making exports less competitive.
Examiner Grade: 4/6 — Good chain on consumer spending → imports (2 marks). Business costs point valid but not fully developed (2 marks). Missing exchange rate analysis entirely. Needed more developed chains for full marks.

EXAMPLE 4:
Question: Discuss whether a reduction in income tax will end a recession. [8 marks]
Mark Scheme: For full marks must argue BOTH sides AND give a reasoned conclusion. For side: disposable income → spending → AD → growth. Against: may be saved, too small, time lags, other causes of recession.
Student Answer: A reduction in income tax gives consumers more disposable income so they spend more. This increases aggregate demand and leads to growth which ends the recession. Therefore income tax cuts will end the recession.
Examiner Grade: 4/8 — Only one side argued. Good chain for disposable income → spending → AD → growth (3 marks). Simple conclusion (1 mark). Lost 4 marks for no counterarguments — people may save the extra income, recession may have other causes, tax cut may be too small, time lags exist. Never award more than 5/8 without both sides.

---

Now grade this student's paper using the same strict Cambridge approach.

Source Material:
${sourceText}

Student Answers:
${questionsText}

Grade each answer strictly using the mark scheme and the examples above as your guide. Provide:

TOTAL_SCORE: X/90
PERCENTAGE: X%
QUESTION_SCORES: Q1a: X/1, Q1b: X/2 etc
STRENGTHS: 3 specific things the student did well
WEAKNESSES: 3 specific areas where marks were lost
IMPROVEMENTS: 3 specific actionable suggestions
DETAILED_FEEDBACK: For each question state marks awarded and exactly why, referencing the mark scheme`

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
      max_tokens: 4000
    })
  })

  const data = await response.json()
  const text = data.choices?.[0]?.message?.content || ''

  const totalScoreMatch = text.match(/TOTAL_SCORE:\s*(\d+)/)
  const percentageMatch = text.match(/PERCENTAGE:\s*(\d+)/)
  const strengthsMatch = text.match(/STRENGTHS:\s*([\s\S]+?)(?=WEAKNESSES:|$)/)
  const weaknessesMatch = text.match(/WEAKNESSES:\s*([\s\S]+?)(?=IMPROVEMENTS:|$)/)
  const improvementsMatch = text.match(/IMPROVEMENTS:\s*([\s\S]+?)(?=DETAILED_FEEDBACK:|$)/)
  const detailedMatch = text.match(/DETAILED_FEEDBACK:\s*([\s\S]+)/)

  return Response.json({
    totalScore: totalScoreMatch ? totalScoreMatch[1] : '?',
    percentage: percentageMatch ? percentageMatch[1] : '?',
    strengths: strengthsMatch ? strengthsMatch[1].trim() : '',
    weaknesses: weaknessesMatch ? weaknessesMatch[1].trim() : '',
    improvements: improvementsMatch ? improvementsMatch[1].trim() : '',
    detailedFeedback: detailedMatch ? detailedMatch[1].trim() : text
  })
}
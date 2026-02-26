export async function POST(req) {
  const { pdfUrl } = await req.json()

  // Fetch the PDF
  const pdfResponse = await fetch(pdfUrl)
  const pdfBuffer = await pdfResponse.arrayBuffer()

  // Extract text using pdfjs-dist
  const pdfjsLib = await import('pdfjs-dist/legacy/build/pdf.mjs')
  pdfjsLib.GlobalWorkerOptions.workerSrc = false

  const loadingTask = pdfjsLib.getDocument({ data: pdfBuffer })
  const pdf = await loadingTask.promise

  let fullText = ''
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items.map(item => item.str).join(' ')
    fullText += pageText + '\n'
  }

  // Use Groq to extract questions from text
  const prompt = `You are an IGCSE Economics paper parser. Here is the raw extracted text from a Cambridge IGCSE Economics 0455 Paper 2:

${fullText.slice(0, 8000)}

IMPORTANT RULES:
- Section B ALWAYS has EXACTLY 4 questions: 2, 3, 4, and 5
- Each Section B question has exactly 4 parts: (a) 2 marks, (b) 4 marks, (c) 6 marks, (d) 8 marks
- You MUST include ALL 4 questions in sectionB
- Return ONLY raw JSON, no markdown, no backticks

{
  "title": "Economics 0455/XX Month/Year",
  "totalMarks": 90,
  "sourceText": "complete source material for Section A with all data and statistics",
  "sectionA": {
    "questions": [
      {"number": "1a", "text": "exact question text", "marks": 1},
      {"number": "1b", "text": "exact question text", "marks": 2},
      {"number": "1c", "text": "exact question text", "marks": 2},
      {"number": "1d", "text": "exact question text", "marks": 4},
      {"number": "1e", "text": "exact question text", "marks": 4},
      {"number": "1f", "text": "exact question text", "marks": 5},
      {"number": "1g", "text": "exact question text", "marks": 6},
      {"number": "1h", "text": "exact question text", "marks": 6}
    ]
  },
  "sectionB": {
    "questions": [
      {
        "number": 2,
        "stimulus": "full stimulus paragraph for question 2",
        "parts": [
          {"number": "2a", "text": "exact question text", "marks": 2},
          {"number": "2b", "text": "exact question text", "marks": 4},
          {"number": "2c", "text": "exact question text", "marks": 6},
          {"number": "2d", "text": "exact question text", "marks": 8}
        ]
      },
      {
        "number": 3,
        "stimulus": "full stimulus paragraph for question 3",
        "parts": [
          {"number": "3a", "text": "exact question text", "marks": 2},
          {"number": "3b", "text": "exact question text", "marks": 4},
          {"number": "3c", "text": "exact question text", "marks": 6},
          {"number": "3d", "text": "exact question text", "marks": 8}
        ]
      },
      {
        "number": 4,
        "stimulus": "full stimulus paragraph for question 4",
        "parts": [
          {"number": "4a", "text": "exact question text", "marks": 2},
          {"number": "4b", "text": "exact question text", "marks": 4},
          {"number": "4c", "text": "exact question text", "marks": 6},
          {"number": "4d", "text": "exact question text", "marks": 8}
        ]
      },
      {
        "number": 5,
        "stimulus": "full stimulus paragraph for question 5",
        "parts": [
          {"number": "5a", "text": "exact question text", "marks": 2},
          {"number": "5b", "text": "exact question text", "marks": 4},
          {"number": "5c", "text": "exact question text", "marks": 6},
          {"number": "5d", "text": "exact question text", "marks": 8}
        ]
      }
    ]
  }
}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 6000
    })
  })

  const groqData = await response.json()
  const rawText = groqData.choices?.[0]?.message?.content || ''

  const jsonMatch = rawText.match(/\{[\s\S]+\}/)
  if (!jsonMatch) {
    return Response.json({ error: 'Could not extract questions from paper' }, { status: 500 })
  }

  try {
    const parsed = JSON.parse(jsonMatch[0])
    if (!parsed.sectionB?.questions || parsed.sectionB.questions.length < 4) {
      return Response.json({ error: 'Extraction incomplete — please try again' }, { status: 500 })
    }
    return Response.json(parsed)
  } catch (e) {
    return Response.json({ error: 'Failed to parse extracted questions' }, { status: 500 })
  }
}
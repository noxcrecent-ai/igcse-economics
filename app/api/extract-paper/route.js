import { extractText } from 'unpdf'

export async function POST(req) {
  const { pdfUrl, msUrl } = await req.json()

  const qpResponse = await fetch(pdfUrl)
  const qpBuffer = await qpResponse.arrayBuffer()
  const qpText = await extractText(new Uint8Array(qpBuffer), { mergePages: true })

  const msResponse = await fetch(msUrl)
  const msBuffer = await msResponse.arrayBuffer()
  const msText = await extractText(new Uint8Array(msBuffer), { mergePages: true })

  const qpRaw = qpText.text
  const msRaw = msText.text

  const prompt = `You are an IGCSE Economics paper parser. Extract from this Cambridge IGCSE Economics 0455 Paper 2.

QUESTION PAPER:
${qpRaw.slice(0, 10000)}

MARK SCHEME:
${msRaw.slice(0, 6000)}

STRICT RULES:
- sourceText is ONLY the written passage for Section A. NO questions inside sourceText.
- CRITICAL FOR TABLES: Any fact file or statistics table MUST use pipe separators, one row per line. Example:
  Greece Fact File 2015
  Population | 10.8 million
  % Population over 60 | 27%
  Unemployment rate | 24%
  Net migration | -44905
- After the table, include the full passage text as normal paragraphs.
- For graphs/charts, extract data into the "graphs" array with labels and datasets.
- If graph data cannot be clearly extracted, use graphDescription to describe the trend.
- sectionA has ONLY questions 1a to 1h
- sectionB has EXACTLY questions 2, 3, 4, 5 — no duplicates
- For questions requiring a diagram (analyse/evaluate 6+ marks), set "requiresDiagram": true
- Return ONLY raw JSON, no markdown, no backticks

{
  "title": "Economics 0455/XX Month/Year",
  "totalMarks": 90,
  "sourceText": "Greece Fact File 2015\nPopulation | 10.8 million\n% Population over 60 | 27%\nUnemployment rate | 24%\nNet migration | -44905\n\nGreece is the country that was worst affected by the European financial crisis...",
  "graphs": [
    {
      "title": "Fig 1: Greece GDP per head and HDI value 2010-2015",
      "type": "line",
      "labels": ["2010","2011","2012","2013","2014","2015"],
      "datasets": [
        {
          "label": "GDP per head ($)",
          "data": [25000, 22000, 20000, 18000, 17000, 18000],
          "color": "#6366f1",
          "yAxis": "y"
        },
        {
          "label": "HDI Value",
          "data": [0.868, 0.862, 0.856, 0.854, 0.858, 0.862],
          "color": "#f59e0b",
          "yAxis": "y2"
        }
      ],
      "graphDescription": "GDP per head fell from $25000 in 2010 to $17000 in 2013 then slightly recovered. HDI fell from 0.868 to 0.854 then recovered to 0.862."
    }
  ],
  "sectionA": {
    "questions": [
      {"number":"1a","text":"exact question","marks":1,"markScheme":"answer","requiresDiagram":false},
      {"number":"1b","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
      {"number":"1c","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
      {"number":"1d","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
      {"number":"1e","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
      {"number":"1f","text":"exact question","marks":5,"markScheme":"answer","requiresDiagram":false},
      {"number":"1g","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true},
      {"number":"1h","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true}
    ]
  },
  "sectionB": {
    "questions": [
      {
        "number": 2,
        "stimulus": "stimulus for q2 only",
        "parts": [
          {"number":"2a","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
          {"number":"2b","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
          {"number":"2c","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true},
          {"number":"2d","text":"exact question","marks":8,"markScheme":"answer","requiresDiagram":true}
        ]
      },
      {
        "number": 3,
        "stimulus": "stimulus for q3 only",
        "parts": [
          {"number":"3a","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
          {"number":"3b","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
          {"number":"3c","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true},
          {"number":"3d","text":"exact question","marks":8,"markScheme":"answer","requiresDiagram":true}
        ]
      },
      {
        "number": 4,
        "stimulus": "stimulus for q4 only",
        "parts": [
          {"number":"4a","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
          {"number":"4b","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
          {"number":"4c","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true},
          {"number":"4d","text":"exact question","marks":8,"markScheme":"answer","requiresDiagram":true}
        ]
      },
      {
        "number": 5,
        "stimulus": "stimulus for q5 only",
        "parts": [
          {"number":"5a","text":"exact question","marks":2,"markScheme":"answer","requiresDiagram":false},
          {"number":"5b","text":"exact question","marks":4,"markScheme":"answer","requiresDiagram":false},
          {"number":"5c","text":"exact question","marks":6,"markScheme":"answer","requiresDiagram":true},
          {"number":"5d","text":"exact question","marks":8,"markScheme":"answer","requiresDiagram":true}
        ]
      }
    ]
  }
}`

  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${process.env.GROQ_API_KEY}` },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.1,
      max_tokens: 8000
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

    // Deduplicate sectionB questions
    const seen = new Set()
    parsed.sectionB.questions = parsed.sectionB.questions.filter(q => {
      if (seen.has(q.number)) return false
      seen.add(q.number)
      return true
    })

    if (!parsed.sectionB?.questions || parsed.sectionB.questions.length < 4) {
      return Response.json({ error: 'Extraction incomplete — please try again' }, { status: 500 })
    }

    return Response.json(parsed)
  } catch (e) {
    return Response.json({ error: 'Failed to parse extracted questions' }, { status: 500 })
  }
}
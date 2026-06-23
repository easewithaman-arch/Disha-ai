import { GoogleGenerativeAI } from '@google/generative-ai'

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY

if (!API_KEY) {
  console.error('⚠️ VITE_GEMINI_API_KEY is not set.')
}

const genAI = API_KEY ? new GoogleGenerativeAI(API_KEY) : null

/* ── Mentor Chat ── */

const MENTOR_SYSTEM = `You are DISHA AI Mentor — a warm, expert AI career counselor for students (ages 14-25) on the DISHA AI platform ("One Student. Many Futures.").
You help students explore career paths, analyze skill gaps, plan education, and prepare for interviews.
Rules:
- Be concise, structured, and motivating. Use **bold**, bullets, and numbered lists.
- Use emojis sparingly (📊 🎯 🚀 💡 🛠 🎓).
- Give specific, actionable advice with real tools/frameworks/salary ranges.
- End with a follow-up question to keep conversation flowing.
- Be honest about trade-offs. Never invent data.
- If asked non-career topics, politely redirect.`

let chatSession = null

export function isApiKeyConfigured() {
  return !!API_KEY
}

export function initChat() {
  if (!genAI) throw new Error('API_KEY_MISSING')
  const model = genAI.getGenerativeModel({
    model: 'gemini-2.5-flash',
    systemInstruction: MENTOR_SYSTEM,
  })
  chatSession = model.startChat({
    history: [],
    generationConfig: { temperature: 0.8, topP: 0.95, topK: 40, maxOutputTokens: 1500 },
  })
  return chatSession
}

export async function askDishaStream(message, onChunk) {
  if (!genAI) throw new Error('API_KEY_MISSING')
  if (!chatSession) initChat()
  const result = await chatSession.sendMessageStream(message)
  let fullText = ''
  for await (const chunk of result.stream) {
    fullText += chunk.text()
    if (onChunk) onChunk(fullText)
  }
  return fullText
}

export function resetChat() {
  chatSession = null
}

/* ── Helper: one-shot Gemini call returning JSON ── */

async function geminiJSON(prompt) {
  if (!genAI) throw new Error('API_KEY_MISSING')
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  const result = await model.generateContent({
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.7, maxOutputTokens: 4000, responseMimeType: 'application/json' },
  })
  const text = result.response.text()
  return JSON.parse(text)
}

/* ── Generate Career Paths from Student Profile ── */

export async function generateCareerPaths(profile) {
  const prompt = `You are a career guidance AI. A student has the following profile:

Name: ${profile.name}
Age: ${profile.age}
Education: ${profile.education}
Location: ${profile.location}
Interests: ${profile.interests.join(', ')}
Skills (rated 1-10): ${Object.entries(profile.skills).map(([k, v]) => `${k}: ${v}/10`).join(', ')}
Dream career: ${profile.dream}
Work style preference: ${profile.workStyle}
Priority: ${profile.priority}

Based on this profile, generate exactly 6 career path recommendations. Return a JSON object with this structure:
{
  "careers": [
    {
      "id": "unique-slug",
      "title": "Career Title",
      "match": 85,
      "salary": "$XXK–$XXK",
      "growth": "Rising" or "Stable" or "Emerging",
      "skills": ["Skill1", "Skill2", "Skill3"],
      "description": "One sentence about why this matches the student",
      "color": "#hexcolor"
    }
  ],
  "insight": "A 2-sentence personalized insight about the student's strongest direction",
  "totalPathsExplored": 6,
  "overallMatchScore": 88
}

Use realistic 2026 salary data. Match percentages should genuinely reflect alignment with the student's profile. Assign distinct hex colors to each career. Order by match score descending.`

  return await geminiJSON(prompt)
}

/* ── Compare Career Paths ── */

export async function compareCareerPaths(careerTitles, profile) {
  const prompt = `You are a career comparison AI. A student (interests: ${profile.interests.join(', ')}, priority: ${profile.priority}) wants to compare these careers: ${careerTitles.join(' vs ')}.

Return a JSON object with this structure:
{
  "careers": [
    {
      "title": "Career Title",
      "color": "#hexcolor",
      "matchScore": 90,
      "salary": { "min": 80, "max": 160, "avg": 115 },
      "jobGrowth": "22%",
      "education": "Bachelor's in CS + certifications",
      "timeToProficiency": "2-3 years",
      "workLifeBalance": 4,
      "remoteFriendly": "Yes",
      "topSkills": ["Skill1", "Skill2", "Skill3", "Skill4", "Skill5"],
      "dayInLife": "Brief 2-sentence description of a typical workday",
      "pros": ["Pro1", "Pro2", "Pro3"],
      "cons": ["Con1", "Con2", "Con3"],
      "radarScores": {
        "salary": 8,
        "growth": 9,
        "creativity": 6,
        "technicalDepth": 9,
        "socialImpact": 5,
        "workLifeBalance": 6
      }
    }
  ],
  "recommendation": "2-sentence personalized recommendation for this student"
}

Salary values are in thousands USD. Use realistic 2026 data. Assign distinct colors.`

  return await geminiJSON(prompt)
}

/* ── Skill Gap Analysis ── */

export async function analyzeSkillGap(careerTitle, userSkills) {
  const skillsList = Object.entries(userSkills).map(([k, v]) => `${k}: ${v}/10`).join(', ')

  const prompt = `You are a skill gap analysis AI. A student has these skill ratings (1-10 scale): ${skillsList}.

They want to pursue: ${careerTitle}.

Return a JSON object with this structure:
{
  "readiness": 72,
  "skillsMastered": 4,
  "skillsInProgress": 3,
  "skillsToLearn": 3,
  "currentSkills": [
    { "name": "Skill Name", "level": 85 }
  ],
  "requiredSkills": [
    { "name": "Skill Name", "level": 90 }
  ],
  "roadmap": [
    {
      "phase": 1,
      "title": "Foundation",
      "months": "1-3",
      "tasks": ["Task 1", "Task 2", "Task 3"]
    }
  ],
  "resources": [
    {
      "name": "Course Name",
      "platform": "Platform",
      "duration": "8 weeks",
      "difficulty": "Intermediate",
      "url": "#"
    }
  ]
}

The "currentSkills" should map the student's actual skill names to percentage levels. The "requiredSkills" should show what the target career needs. Include 8-10 skills in each. The roadmap should have 3 phases. Include 4 resources. Use realistic course names and platforms (Coursera, Udemy, edX, etc). Readiness is an overall percentage.`

  return await geminiJSON(prompt)
}

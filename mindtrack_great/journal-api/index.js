import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import fetch from 'node-fetch'
import admin from 'firebase-admin'

const app = express()
app.use(cors())
app.use(express.json())

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_PROJECT_ID,
      client_email: process.env.FIREBASE_CLIENT_EMAIL,
      private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    })
  })
}
const db = admin.firestore()

const OPENAI_URL = 'https://api.openai.com/v1/chat/completions'
const MODEL = 'gpt-4o-mini'

function extractAlerts(text) {
  const keywords = ['stress','stressed','anxious','anxiety','burnout','panic','depressed','overwhelmed','hopeless','hurt']
  const lower = text.toLowerCase()
  return keywords.filter(k => lower.includes(k))
}

app.post('/analyze', async (req, res) => {
  try {
    const { uid, text } = req.body
    if (!uid || !text) return res.status(400).json({ error: 'uid and text are required' })

    const body = {
      model: MODEL,
      messages: [
        { role: 'system', content: 'You are a supportive journaling coach. Give short, empathetic feedback (120 words max) with 2-3 actionable suggestions.' },
        { role: 'user', content: 'Journal entry: ' + text }
      ],
      temperature: 0.4
    }

    const r = await fetch(OPENAI_URL, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })

    if (!r.ok) {
      const err = await r.text()
      console.error('AI API error:', err)
      return res.status(500).json({ error: 'AI request failed' })
    }

    const data = await r.json()
    const feedback = data.choices?.[0]?.message?.content?.trim() || 'Keep going—you are doing great.'
    const alerts = extractAlerts(text + ' ' + feedback)

    const sumRef = db.collection('summaries').doc(uid)
    await db.runTransaction(async (tx) => {
      const snap = await tx.get(sumRef)
      const existing = snap.exists ? snap.data() : {}
      const newAlerts = Array.from(new Set([...(existing.alerts || []), ...alerts]))
      tx.set(sumRef, {
        ...existing,
        lastJournalAt: admin.firestore.FieldValue.serverTimestamp(),
        alerts: newAlerts
      }, { merge: true })
    })

    res.json({ feedback, alerts })
  } catch (e) {
    console.error(e)
    res.status(500).json({ error: 'Server error' })
  }
})

const port = process.env.PORT || 5050
app.listen(port, () => {
  console.log('Journal API listening on port', port)
})

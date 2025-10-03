import React from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'
import { analyzeJournal } from '../api'

export default function JournalForm({ user }) {
  const [text, setText] = React.useState('')
  const [feedback, setFeedback] = React.useState(null)
  const [loading, setLoading] = React.useState(false)

  async function submit(e) {
    e.preventDefault()
    if (!user) return alert('Please sign in')
    setLoading(true)
    try {
      const result = await analyzeJournal({ uid: user.uid, text })
      setFeedback(result.feedback)
      const ref = collection(db, 'users', user.uid, 'journals')
      await addDoc(ref, {
        text,
        feedback: result.feedback,
        alerts: result.alerts || [],
        createdAt: serverTimestamp()
      })
      setText('')
    } catch (e) {
      console.error(e)
      alert('Error analyzing journal')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold mb-2">Journaling (AI feedback)</h3>
      <form onSubmit={submit}>
        <textarea
          className="w-full h-28 p-2 border rounded-lg"
          placeholder="Write about your day..."
          value={text} onChange={e=>setText(e.target.value)}
          required
        />
        <button disabled={loading} className="mt-3 px-4 py-2 rounded bg-black text-white">
          {loading ? 'Analyzing...' : 'Get Feedback'}
        </button>
      </form>
      {feedback && (
        <div className="mt-3 p-3 border rounded-lg bg-gray-50">
          <h4 className="font-medium mb-1">Personalized feedback</h4>
          <p className="whitespace-pre-wrap text-sm">{feedback}</p>
        </div>
      )}
    </div>
  )
}

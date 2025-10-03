import React from 'react'
import { collection, addDoc, serverTimestamp } from 'firebase/firestore'
import { db } from '../firebase'

const moods = ['happy','okay','stressed','sad','anxious','excited']

export default function MoodForm({ user }) {
  const [mood, setMood] = React.useState('okay')
  const [note, setNote] = React.useState('')
  const [tags, setTags] = React.useState('')

  async function submit(e) {
    e.preventDefault()
    if (!user) return alert('Please sign in')
    const ref = collection(db, 'users', user.uid, 'moods')
    await addDoc(ref, {
      mood, note, tags: tags.split(',').map(t=>t.trim()).filter(Boolean),
      createdAt: serverTimestamp()
    })
    setNote(''); setTags('')
    alert('Mood saved')
  }

  return (
    <form onSubmit={submit} className="p-4 border rounded-xl bg-white shadow-sm">
      <h3 className="font-semibold mb-2">Track your mood</h3>
      <div className="flex gap-3 flex-wrap">
        {moods.map(m => (
          <label key={m} className={`px-3 py-1 rounded-full border cursor-pointer ${mood===m?'bg-black text-white':'bg-gray-100'}`}>
            <input type="radio" name="mood" className="hidden" checked={mood===m} onChange={()=>setMood(m)} />
            {m}
          </label>
        ))}
      </div>
      <textarea
        className="w-full mt-3 p-2 border rounded-lg"
        placeholder="Add a short note (optional)"
        value={note} onChange={e=>setNote(e.target.value)}
      />
      <input
        className="w-full mt-2 p-2 border rounded-lg"
        placeholder="tags (comma-separated)"
        value={tags} onChange={e=>setTags(e.target.value)}
      />
      <button className="mt-3 px-4 py-2 rounded bg-black text-white">Save</button>
    </form>
  )
}

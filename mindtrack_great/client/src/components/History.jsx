import React from 'react'
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

export default function History({ user }) {
  const [moods, setMoods] = React.useState([])
  const [journals, setJournals] = React.useState([])

  React.useEffect(() => {
    if (!user) return
    const mq = query(collection(db, 'users', user.uid, 'moods'), orderBy('createdAt','desc'))
    const jq = query(collection(db, 'users', user.uid, 'journals'), orderBy('createdAt','desc'))
    const unsubM = onSnapshot(mq, snap => setMoods(snap.docs.map(d => ({ id:d.id, ...d.data()}))))
    const unsubJ = onSnapshot(jq, snap => setJournals(snap.docs.map(d => ({ id:d.id, ...d.data()}))))
    return () => { unsubM(); unsubJ(); }
  }, [user])

  if (!user) return null

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div className="p-4 border rounded-xl bg-white">
        <h3 className="font-semibold mb-2">Mood history</h3>
        <ul className="space-y-2 text-sm">
          {moods.map(m => (
            <li key={m.id} className="p-2 border rounded-lg flex items-center justify-between">
              <span className="font-medium">{m.mood}</span>
              <span className="text-gray-500">{m.note}</span>
            </li>
          ))}
          {moods.length===0 && <p className="text-gray-500">No moods yet.</p>}
        </ul>
      </div>
      <div className="p-4 border rounded-xl bg-white">
        <h3 className="font-semibold mb-2">Journal entries</h3>
        <ul className="space-y-2 text-sm">
          {journals.map(j => (
            <li key={j.id} className="p-2 border rounded-lg">
              <p className="font-medium">Entry</p>
              <p className="text-gray-700 mb-1 whitespace-pre-wrap">{j.text}</p>
              {j.feedback && (
                <>
                  <p className="font-medium">Feedback</p>
                  <p className="text-gray-700 whitespace-pre-wrap">{j.feedback}</p>
                </>
              )}
              {j.alerts?.length ? <p className="text-xs text-red-600 mt-1">Alerts: {j.alerts.join(', ')}</p> : null}
            </li>
          ))}
          {journals.length===0 && <p className="text-gray-500">No journals yet.</p>}
        </ul>
      </div>
    </div>
  )
}

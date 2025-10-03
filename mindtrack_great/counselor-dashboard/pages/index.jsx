import React from 'react'
import { collection, getDocs, getFirestore } from 'firebase/firestore'
import { initFirebase } from '../utils/firebase'
import TrendChart from '../components/TrendChart'
import AlertTable from '../components/AlertTable'

initFirebase()
const db = getFirestore()

export default function Home() {
  const [users, setUsers] = React.useState([])

  React.useEffect(() => {
    async function load() {
      const summariesSnap = await getDocs(collection(db, 'summaries'))
      const rows = []
      for (const doc of summariesSnap.docs) {
        const uid = doc.id
        const moodsSnap = await getDocs(collection(db, 'users', uid, 'moods'))
        const moodCounts = {}
        moodsSnap.forEach(d => { moodCounts[d.data().mood] = (moodCounts[d.data().mood]||0)+1 })
        rows.push({ uid, summary: doc.data(), moodCounts })
      }
      setUsers(rows)
    }
    load()
  }, [])

  return (
    <div className="container">
      <h1 className="h1">Counselor Dashboard</h1>
      <p className="muted">Trends and alerts across students</p>

      <div className="grid" style={{marginTop:16}}>
        <div className="card">
          <div className="h2">Mood trends</div>
          <TrendChart users={users} />
        </div>
        <div className="card">
          <div className="h2">Alerts</div>
          <AlertTable users={users} />
        </div>
      </div>
      <footer style={{marginTop:20,fontSize:12,color:'#6b7280'}}>Built and maintained by David Okyere</footer>
    </div>
  )
}

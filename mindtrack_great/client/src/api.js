import axios from 'axios'
const base = import.meta.env.VITE_API_BASE || 'http://localhost:5050'

export async function analyzeJournal({ uid, text }) {
  const res = await axios.post(`${base}/analyze`, { uid, text })
  return res.data
}

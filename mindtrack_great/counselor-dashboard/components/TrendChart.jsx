import React from 'react'
import { Bar } from 'react-chartjs-2'
import { Chart, BarElement, CategoryScale, LinearScale, Legend, Tooltip } from 'chart.js'
Chart.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip)

export default function TrendChart({ users }) {
  const moods = ['happy','okay','stressed','sad','anxious','excited']
  const counts = moods.map(m => users.reduce((acc, u) => acc + (u.moodCounts[m] || 0), 0))

  const data = { labels: moods, datasets: [{ label: 'Total moods', data: counts }] }
  const options = { responsive: true, plugins: { legend: { position: 'top' } } }
  return <Bar data={data} options={options} />
}

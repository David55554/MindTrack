import React from 'react'
import Login from './components/Login.jsx'
import MoodForm from './components/MoodForm.jsx'
import JournalForm from './components/JournalForm.jsx'
import History from './components/History.jsx'

export default function App() {
  const [user, setUser] = React.useState(null)

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">MindTrack</h1>
        <Login user={user} setUser={setUser} />
      </header>

      <main className="space-y-4">
        <MoodForm user={user} />
        <JournalForm user={user} />
        <History user={user} />
      </main>

      <footer className="text-center text-xs text-gray-500 mt-8">
        Built and maintained by David Okyere
      </footer>
    </div>
  )
}

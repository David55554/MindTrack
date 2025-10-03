import React from 'react'
import { auth, googleLogin, logout } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'

export default function Login({ user, setUser }) {
  React.useEffect(() => {
    const unsub = onAuthStateChanged(auth, setUser)
    return () => unsub()
  }, [])

  if (user) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-700">Hi, {user.displayName || user.email}</span>
        <button onClick={logout} className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm">
          Logout
        </button>
      </div>
    )
  }
  return (
    <button onClick={googleLogin} className="px-4 py-2 rounded bg-black text-white">
      Sign in with Google
    </button>
  )
}

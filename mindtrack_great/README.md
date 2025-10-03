# MindTrack — Mood Tracking + Journaling + Counselor Dashboard

**Author:** David Okyere (amo1do@alma.edu)

This repository contains three apps:

- `client/` — React + Vite + Tailwind + Firebase (student mood & journaling)
- `journal-api/` — Node/Express backend calling an AI model and storing feedback in Firestore
- `counselor-dashboard/` — Next.js + Chart.js dashboard for counselors

---

## 1) Prerequisites
- Node.js 18+ and npm
- A Firebase project (Firestore + Authentication)
- An AI API key (e.g., OpenAI) for journaling feedback

Create the following env files (do **not** commit real keys—only the `*.example` versions are included).

**client/.env**
```
VITE_FIREBASE_API_KEY=YOUR_WEB_API_KEY
VITE_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
VITE_FIREBASE_APP_ID=YOUR_WEB_APP_ID
VITE_API_BASE=http://localhost:5050
```

**journal-api/.env**
```
OPENAI_API_KEY=sk-...your_key...
FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
FIREBASE_CLIENT_EMAIL=service-account@YOUR_PROJECT.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR\nKEY\nLINES\n-----END PRIVATE KEY-----\n"
PORT=5050
```

**counselor-dashboard/.env.local**
```
NEXT_PUBLIC_FIREBASE_API_KEY=YOUR_WEB_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_PROJECT.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=YOUR_PROJECT_ID
NEXT_PUBLIC_FIREBASE_APP_ID=YOUR_WEB_APP_ID
```

---

## 2) Install & Run

### A) Start the Journaling API
```bash
cd journal-api
cp .env.example .env   # fill values
npm install
npm run dev   # http://localhost:5050
```

### B) Start the Client
```bash
cd client
cp .env.example .env   # fill values
npm install
npm run dev   # http://localhost:5173
```

### C) Start the Counselor Dashboard
```bash
cd counselor-dashboard
cp .env.local.example .env.local   # fill values
npm install
npm run dev   # http://localhost:5174
```

---

## 3) Firestore Structure (auto-generated)
```
users/{uid}/moods/{autoId}         # { mood, note, tags[], createdAt }
users/{uid}/journals/{autoId}      # { text, feedback, createdAt, alerts[] }
summaries/{uid}                    # { lastJournalAt, alerts[] }
```

---

## 4) Security Rules (example)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{uid}/{collection=**}/{doc} {
      allow read, write: if request.auth != null && request.auth.uid == uid;
    }
    match /summaries/{uid} {
      allow read: if request.auth != null;
      allow write: if false; // server-only via Admin SDK
    }
  }
}
```

---

## 5) Notes
- `.env.example` files are included; keep your real keys local.
- You can deploy web apps to Vercel/Netlify and the API to Render/Fly/Firebase Functions.

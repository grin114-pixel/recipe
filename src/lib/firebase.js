import { initializeApp } from 'firebase/app'
import { getStorage } from 'firebase/storage'

const projectId = import.meta.env.VITE_FIREBASE_PROJECT_ID
const explicitBucket = import.meta.env.VITE_FIREBASE_STORAGE_BUCKET?.trim()
// 버킷 env 없을 때 Firebase 기본 버킷명과 동일하게 맞춤
const storageBucket =
  explicitBucket || (projectId ? `${projectId}.appspot.com` : undefined)

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId,
  storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)
export const storage = getStorage(app)

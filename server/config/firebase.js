import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import serviceAccount from './service-key.json' with { type: 'json' }

initializeApp({
    credential: cert(serviceAccount)
})

const db = getFirestore()

export default db

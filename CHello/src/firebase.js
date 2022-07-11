import { firebase, initializeApp} from 'firebase/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage"


const app = initializeApp({
    apiKey: "AIzaSyAarIycCN4Q4QZNkNvUrHViCMuTUA4U2Wc",
    authDomain: "chello-tst.firebaseapp.com",
    projectId: "chello-tst",
    storageBucket: "chello-tst.appspot.com",
    messagingSenderId: "1099499934491",
    appId: "1:1099499934491:web:e7d6a3f3518595a47c79be"
})

export const auth = getAuth(app)
export default app
export const db = getFirestore(app)
export const storage = getStorage(app)
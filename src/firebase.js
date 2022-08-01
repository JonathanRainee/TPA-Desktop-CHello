import { firebase, initializeApp} from 'firebase/app'
import 'firebase/compat/auth'
import 'firebase/compat/firestore';
import { getAuth } from "firebase/auth"
import { getFirestore } from 'firebase/firestore';
import { getStorage } from "firebase/storage"


const app = initializeApp({
    // apiKey: "AIzaSyAarIycCN4Q4QZNkNvUrHViCMuTUA4U2Wc",
    // authDomain: "chello-tst.firebaseapp.com",
    // projectId: "chello-tst",
    // storageBucket: "chello-tst.appspot.com",
    // messagingSenderId: "1099499934491",
    // appId: "1:1099499934491:web:e7d6a3f3518595a47c79be"
    apiKey: "AIzaSyD_f_INBnSYbny_5l3jPqK9UrR0TC9AqRg",
    authDomain: "chellojr-ca966.firebaseapp.com",
    projectId: "chellojr-ca966",
    storageBucket: "chellojr-ca966.appspot.com",
    messagingSenderId: "866323813307",
    appId: "1:866323813307:web:4be8cefba4f16c64e32a9e"
})

export const auth = getAuth(app)
export default app
export const db = getFirestore(app)
export const storage = getStorage(app)
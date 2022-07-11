import {createContext, useContext, useEffect, useState} from 'react'
import {createUserWithEmailAndPassword, 
        signInWithEmailAndPassword, 
        signOut, 
        onAuthStateChanged} from "firebase/auth";  
import {auth,} from '../firebase'
import { collection, query, where } from "firebase/firestore";

const UseContext = createContext()
let userID = ''

export const AuthContextProvider = ({children}) => {

    const [user, setUser] = useState({});

    const createUser = (email, password) => {
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const signIn = (email, password) => {
        signInWithEmailAndPassword(auth, email, password)
    }

    const logOut = () => {
        return signOut(auth)
    }

    useEffect(() => {
        const unsubscrice = onAuthStateChanged(auth, (currUser) => {
            // console.log(currUser)
            setUser(currUser)
        })
        return () => {
            unsubscrice();
        }
    }, []);

    return (
        <UseContext.Provider value={{createUser, user, logOut, signIn, userID}}>
            {children}
        </UseContext.Provider>
    )
}

export const UserAuth = () => {
    return useContext(UseContext)
}
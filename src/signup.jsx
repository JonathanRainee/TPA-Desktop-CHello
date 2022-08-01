import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { collection, addDoc, setDoc, doc } from "firebase/firestore"; 
import {db} from './firebase'
import { updateProfile } from 'firebase/auth';

const Signup = () => {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [username, setUsername] = useState('')
    const [err, setErr] = useState('')
    const {createUser} = UserAuth()
    const navigate = useNavigate()

    const [userID, setUserID] = useState('')
    // console.log(db)
    let ID = ""

    const handleSumbit = async (e) => {
        e.preventDefault()
        setErr("a")
        try {
            await createUser(email, password).then(async (userCreds)=>{
                await updateProfile(userCreds.user, {
                    displayName: username,
                    uid: userCreds.user.uid,
                })
                await addDoc(collection(db, 'users'), {
                    email: email,
                    displayName: username, 
                    uid: userCreds.user.uid
                })
                ID = userCreds.user.uid
            })  
            console.log(email, username)
            navigate(`/Home/${ID}`)
        } catch (e) {
            setErr(e.message)
            console.log(e.message)
            // if(error !== null){
            //     alert(e.message)
            // }
        }
        console.log(err)
    }

    return (
        <div className="flex flex-col justify-center">
            <h1 className="text-green font-sans text-center text-5xl font-bold py-20"> CHello </h1>
            <div className="mb-3">
        </div>

        <div  className="flex flex-col justify-center items-center">  
            <div className="pl-3 flex flex-col ">
                <h1 className="text-green font-sans font-bold mb-2">Simple step to make a new account</h1>
                <form onSubmit={handleSumbit}>
                    <div className="py-4">
                    <input onChange={(e) => setUsername(e.target.value)} className="border-2 rounded w-96 border-green pl-2" placeholder="Username" type="text" />
                    </div>
                    <input onChange={(e) => setEmail(e.target.value)} className="border-2 rounded w-96 border-green pl-2" placeholder="Email" type="email"/>
                    <div className="py-4">
                    <input onChange={(e) => setPassword(e.target.value)} className="border-2 rounded w-96 border-green pl-2" placeholder="Password" type="password" />
                    </div>
                    <button className="bg-green hover:bg-teal text-khaki font-bold py-2 px-4 w-96 border-b-4 border-green hover:border-teal rounded ">Sign Up</button>
                </form>
                {
                    err !== null ?( <button className="bg-red w-96 text-khaki font-bold py-2 px-4 mt-2 border-b-4 border-red rounded " disabled>{err}</button>) :
                    null
                    
                    // {if(err === null){
                    //     (<p>null</p>)
                    // }else{
                    //     <p>not null</p>
                    // }}
                    
                }
                {/* <button className="bg-green hover:bg-teal text-khaki font-bold py-2 px-4 w-96 border-b-4 border-green hover:border-teal rounded ">Sign Up</button> */}
            </div>
        </div>
        <div className="mb-3 mr-20 mt-3">
            <h1 className="text-green  text-xs font-sans text-center font-bold mr-20">Already have an account?
            <Link to="/" className='underline'> Sign in here!</Link></h1>
        </div>
    </div>
    )
}

export default Signup

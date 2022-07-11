import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from './context/authContext'

const SignIn = () => {

    const { user, signIn } = UserAuth();
    const [error, setError] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigate = useNavigate()

const handleSubmit = async (e) => {
    e.preventDefault();
    setError('')

    try {
        await signIn(email, password)
        // console.log(test,signIn.uid)
        console.log(user.uid)
        navigate(`/Home/${user.uid}`)
    } catch (e) {
        setError(e.message)
        console.log(e.message)
    }
}

return(
    <div className="flex flex-col justify-center">
        <h1 className="text-green font-sans text-center text-5xl font-bold py-20"> CHello </h1>


        <div className="mb-3">
        </div>

        <div  className="flex flex-col justify-center items-center">
        

        <div className="pl-3 flex flex-col ">
            <h1 className="text-green font-sans font-bold mb-3">Sign in to your account</h1>

            <form onSubmit={handleSubmit}>

                <input onChange={(e) => setEmail(e.target.value)} className="border-2 rounded w-96 border-green pl-2" placeholder="Email" type="email"/>
                    <div className="py-4">
                        <input onChange={(e) => setPassword(e.target.value)} className="border-2 rounded w-96 border-green pl-2" placeholder="Password" type="password" />
                    </div>
                <button className="bg-green hover:bg-teal w-96 text-khaki font-bold py-2 px-4 border-b-4 border-green hover:border-teal rounded ">Sign In</button>
            </form>

        </div>

    </div>

    <div className="mb-3 mr-20 mt-3">
        <h1 className="text-green  text-xs font-sans text-center font-bold mr-20">Don't have an account?
        <Link to="/signup" className='underline'> Sign up here!</Link></h1>
    </div>

    </div>
);
}

export default SignIn;
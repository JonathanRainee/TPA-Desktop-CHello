import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import {db, auth} from './firebase'
import nbell from './nbell.jpg'
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, onSnapshot} from "firebase/firestore";
import { useEffect } from 'react';
import { useState } from 'react';

const Notif = () => {

    const{ user, logOut } = UserAuth();
    const [ userDocID, setUserDocID ] = useState('')
    const [ userData, setUserData ] = useState({})
    const [ fetch, setFetch ] = useState(false)
    const [ dFetch, setDFetch ] = useState(false)
    const userRef = collection(db, 'users')
    const navigate = useNavigate()
    const uq = query(userRef, where('uid', '==', user.uid))
    
    function getUserDoc(){
        const currUser = getDocs(uq).then((data)=>{
            setUserDocID(data.docs[0].id)
            setFetch(true)
        })
    }
    
    useEffect(()=>{
        try {
            getUserDoc()
        } catch (error) {
            
        }
    }, [])

    async function getUserData(){
        const userD = await getDoc(doc(db, 'users', userDocID))
        setUserData(userD.data())
        setDFetch(true)
    }

    useEffect(()=>{
        try {
            getUserData()
        } catch (error) {
            
        }
    }, [userDocID])

    console.log(userData.notification)

    const handleLogout = async () => {
        try {
            await logOut()
            navigate('/')
            console.log('logged out')
        } catch (e) {
            console.log(e.message)
        }
    }

    const handleAccount = async () =>{
        try {
            navigate(`/Account/${user.uid}`)
        } catch (error) {
            
        }
    }  

    const handleBack = async () => {
        console.log("test back")
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
    }

    const handleWorkspace = async () => {
        try {
            navigate('/workspaces')
        } catch (error) {
            
        }
    }

    const handleCB = async()=>{
        try {
            navigate('/closedBoard')
        } catch (error) {
            
        }
    }

    if(fetch === false){
        return(
            <p>fetching data</p>
        )
    }
    
    if(dFetch === false){
        return(
            <p>fetching data</p>
        )
    }

    return (
        <div className="h-screen flex overflow-hidden bg-gray-100">
    <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">

    <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>


    <div className="relative flex-1 flex flex-col max-w-xs w-full pt-4 pb-2 bg-gray-800">

        <div className="absolute top-0 right-0 -mr-12 pt-2">
        <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                <span className="sr-only">Close sidebar</span>
                <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
            </button>
        </div>

        <div onClick={handleBack} className="flex-shrink-0 flex items-center px-4">
            <h1 >Chello</h1>
        </div>
        <div className="mt-5 flex-1 h-0 overflow-y-auto">
            <nav className="px-2 space-y-1">
            </nav>
        </div>
    </div>

    <div className="flex-shrink-0 w-14" aria-hidden="true">
    </div>
    </div>

    <div className="hidden md:flex md:flex-shrink-0">
        <div className="flex flex-col w-64">
            <div className="flex flex-col h-0 flex-1">
                <div className="flex items-center h-16 flex-shrink-0 px-3 bg-khaki">
                    <h1 className = "text-green font-sans text-center text-5xl ml-2 font-bold py-20">Chello</h1>
                </div>
            <div className="flex-1 flex flex-col overflow-y-auto">
        <nav className="flex-1 px-4 py-4 bg-khaki space-y-3 spacex-2">
            <a  onClick={handleWorkspace} className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
                Workspaces
            </a>


            <a className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Boards
            </a>

            <a onClick={handleCB} className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Closed Boards
            </a>

        </nav>
        </div>
    </div>
    </div>
    </div>
    <div className="flex flex-col w-0 flex-1 overflow-hidden">
        <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
        <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
            <span className="sr-only">Open sidebar</span>
            <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
            </svg>
        </button>
        <div className="flex-1 px-4 flex justify-between bg-cream">
            <div className="flex-1 flex">
            <form className="w-full flex md:ml-0 " action="#" method="GET">
                <label for="search_field" className="sr-only ">Search</label>
                <div className="relative w-full text-gray-400 focus-within:text-gray-600">
                <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
                    </svg>
                </div>
                <input id="search_field" className=" w-full h-full pl-8 pr-3 py-2 border-transparent bg-cream placeholder-white focus:outline-none focus:placeholder-white focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search"></input>
                </div>
            </form>
            </div>
            <div className="flex items-center md:ml-2 gap-2">
                <Link to = '/notification'>
                    <img src={nbell} alt='bell' className='w-7'></img>
                </Link>
                <button onClick={handleAccount} className='bg-khaki h-8 px-4  text-xl rounded-md'>{user && user.displayName}</button>
            {/* <h1 className='text-xl'>{user && user.displayName}</h1> */}
            

            <div className="ml-3 relative">
                <div>
                
                <button onClick={handleLogout} className='bg-khaki h-8 px-3  text-xl rounded-md'>Logout</button>
                    {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img> */}
                
                </div>

            
            
            </div>
            </div>
        </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-cream pt-4 pl-4">
            <h1 className="text-4xl font-semibold text-gray-900 pl-2">Notification</h1>
            <div className='pl-2'>
                {
                    userData.notification.map((value)=>{
                        return(
                            <button className="bg-green text-cream rounded-md w-3/4 justify-left h-10 mt-4 pl-4 pr-4" disabled>{value}</button>
                        )
                    })
                }
            </div>
        </main>
    </div>
    {/* <button onClick={handleBack}>back</button> */}
    </div>
    )
}

export default Notif
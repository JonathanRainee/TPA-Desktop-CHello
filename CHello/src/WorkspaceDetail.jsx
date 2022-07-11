import userEvent from '@testing-library/user-event'
import React, { useEffect, useState, createContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { addDoc, collection, query, setDoc, deleteDoc , getDoc, where, doc, getDocs, updateDoc, arrayUnion, getFirestore} from "firebase/firestore";
import {db, auth} from './firebase'
import { async } from '@firebase/util';


const WorkspaceDetail = () => {

    const { id } = useParams()
    const[ boardName, setName ] = useState('')
    const[ boardDesc, setDesc ] = useState('')
    const[ boardType, setType ] = useState('')
    const [ memberlist, setMemberList ] = useState([])
    const{ user, logOut } = UserAuth();
    const navigate = useNavigate()
    const currUser = auth.currentUser

    // getDoc(doc(db,'workspaces',doc(id))).then(e => {
    //     console.log(e.data())
    // })
    // var currDoc = 


    function createBoard(e){
        e.preventDefault()
        let temArr = [user.uid]
        setMemberList(temArr)
        console.log(boardName,boardDesc,boardType)
        console.log(id)
    }

    useEffect(()=>{
        if(memberlist.length == 1){
            const colls = collection(db, 'workspaces', id, 'board')
            const docRef = addDoc(colls, {
                title : boardName,
                description: boardDesc,
                adminID: user.uid,
                member: memberlist
            }).then(console.log("dari createWS",user.uid))

            console.log("docref if",docRef.id)

            const membersColl = setDoc(doc(db, "workspaces/" + id + "/board/" + docRef.id + "/Members", currUser.uid), {
                Name: currUser.displayName,
                Admin: true
            }).then(console.log("dari createcol2",user.uid))
        }

    }, [memberlist])

    const delWorkspace = async () => {
        console.log('start del')
        await deleteDoc(doc(db, "workspaces", id))
        navigate('/workspaces')
        console.log('end del')
    }

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

    const handleWorkspace = async () => {
        console.log("wekseoes")
        try {
            navigate('/workspaces')
        } catch (error) {
            
        }
    }

    const handleBack = async () => {
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
    }

    const handleBoard = async () => {
        try {
            navigate(`/board/${id}`)
        } catch (error) {
            
        }
    }

    

    return (
        // <div>workspaceDetail</div>
        <div className="h-screen flex overflow-hidden bg-gray-100" >
            
            <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true" >
                
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2" >
                    <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
                        <span className="sr-only">Close sidebar</span>
                        <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
                <div className="flex-shrink-0 flex items-center px-4">
                    <h1 onClick={handleBack}>Chello</h1>
                </div>
                <div className="mt-5 flex-1 h-0 overflow-y-auto">
                    <nav className="px-2 space-y-1"></nav>
                </div>
            </div>

            <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
        </div>

        <div className="hidden md:flex md:flex-shrink-0">
            <div className="flex flex-col w-64">
                <div className="flex flex-col h-0 flex-1">
                    <div className="flex items-center h-16 flex-shrink-0 px-3 bg-khaki">
                        <h1 className = "text-green font-sans text-center text-5xl ml-2 font-bold py-20">Chello</h1>
                    </div>
                <div className="flex-1 flex flex-col overflow-y-auto">
                <nav className="flex-1 px-4 py-4 bg-khaki space-y-3 spacex-2">
                    <a onClick={handleBoard} className="bg-green text-2xl hover:bg-teal text-cream group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
                        Boards
                    </a>
                    <a href="#" className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                        View member
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
            <div className="ml-4 flex items-center md:ml-6">
            <button onClick={handleAccount} className='bg-khaki h-8 px-4 m-2 text-xl rounded-md'>{user && user.displayName}</button>
            {/* <h1 className='text-xl'>{user && user.displayName}</h1> */}
            

            <div className="ml-3 relative">
                <div>
                
                <button onClick={handleLogout} className='bg-khaki h-8 px-4 m-2 text-xl rounded-md'>Logout</button>
                    {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img> */}
                
                </div>

            
            
            </div>
            </div>
        </div>
        </div>

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-cream" >
        <div className="py-8 px-5"> 
            <div className="max-w-7xl space-x-4">
            <h1 className="text-4xl font-semibold text-gray-900 pl-4">Create Board</h1>
            <form onSubmit={createBoard} className="max-w-4xl space-x-4 flex-col space-y-3">
                <input onChange={(e) => setName(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Name' type="text" />
                <input onChange={(e) => setDesc(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Description' type="text" />
                <select onChange={(e) => setType(e.target.value)} placeholder='Type' className="text-gray-900 form-select form-select-lg mb-3 w-30 h-10 mt-6 pl-4 pr-4 bg-khaki rounded-md">
                    <option className='text-gray-900' value="Public">Public</option>
                    <option className='text-gray-900' value="Private">Private</option>
                </select>
            <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-6 justify-self-center">Create</button>

            </form>
            <button onClick={delWorkspace} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Delete</button>
        

            </div>

        </div>
        <div>
            
        </div>
        </main>

        
        <button onClick={handleBack}>back</button>
    </div>
    </div>
    )
}

export default WorkspaceDetail

// async function createBoard(e){
//     e.preventDefault()
//     let arrMembers = [currUser.uid];
    
//     try {
//       const coll = collection(db, 'Workspace', workspaceID, 'Board')
//       const docRef = await addDoc(coll,{
//         Title: e.target.boardTitle.value,
//         Visibility: e.target.visibilityOption.value,
//         Members: arrMembers,
//       })
//       const membersColl = await setDoc(doc(db, "Workspace/" + workspaceID + "/Board/" + docRef.id + "/Members", currUser.uid), {
//         Name: currUser.displayName,
//         Admin: true
//       })
//       // setMembersID(membersColl.id)
//       // alert("New board created!")
//     } catch (error) {
//       alert(error)
//     }

//   }
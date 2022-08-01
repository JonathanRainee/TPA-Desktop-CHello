import React, { useEffect, useState, createContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { addDoc, collection, query, where, orderBy, onSnapshot, doc, getDocs, updateDoc, arrayRemove, arrayUnion, getFirestore, getDoc, deleteDoc} from "firebase/firestore";
import {db, auth} from './firebase'
import axios from "axios"

const MemberComponent = ({memberUID})=>{
    const { id, boardid } = useParams()
    const{ user, logOut } = UserAuth();
    const [member, setMember] = useState()
    const [getData, setGetData] = useState(false)
    const [ boardCurr, setBoardCurr ] = useState({})
    const [ fetch, setFetch ] = useState(false)

    const ref = collection(db, 'users')
    const boardRef = doc(db, 'board', boardid)
    const q = query(ref, where('uid', '==', memberUID))
    // console.log(boardRef)
    
    // console.log(wsCurr)
    // console.log(currWs)
    
    useEffect(()=>{
        try {
            const currBoard = getDoc(boardRef).then((data)=>{
                // console.log(data)
                setBoardCurr(data._document.data.value.mapValue.fields)
                setFetch(true)
            })
            
        } catch (error) {
            
        }
    })

    const handleRemove = async ()=>{
        await updateDoc(boardRef,  {
            member: arrayRemove(memberUID)
        })
        alert("member have been removed")
    }
    // console.log(wsCurr.admins)

    const handleGrant = async()=>{
        await updateDoc(boardRef, {
            admins: arrayUnion(memberUID)
        })
        alert("Member has been granted the admin role")
    }
    
    const handleRevoke = async()=>{
        await updateDoc(boardRef, {
            admins: arrayRemove(memberUID)
        })
        alert("Member role has been revoked")
    }
    
    useEffect(()=>{
        // console.log("testt use")
        try {
            const users = getDocs(q).then((data)=>{
                setMember(data.docs[0]._document.data.value.mapValue.fields)
                setGetData(true)
            })
        } catch (error) {
            
        }
    }, [])

    if(!getData) return(
        <p>fetching data</p>
    )

    if(!fetch) return(
        <p>fetching data</p>
    )
    // console.log(wsCurr)

    return (
        <>
        {boardCurr.admins.arrayValue.values.map((value)=>{
            return value.stringValue
        }).includes(user.uid) ? 
                    (<table className='table-fixed'>
                        <tbody>
                            <tr className='bg-khaki border-solid border-2 border-grey'>
                                <td className='w-96 h-1 pl-2'>{member.displayName.stringValue}</td>
                                <td className='w-32 h-1 '><button onClick={handleGrant} className='bg-teal pr-4 pl-1'>Grant</button></td>
                                <td className='w-32 h-1 '><button onClick={handleRevoke} className='bg-cream pr-4 pl-1'>Revoke</button></td>
                                <td className='w-32 h-1 '><button onClick={handleRemove} className='bg-crimson hover:bg-red pr-4 pl-1 text-cream'>Remove</button></td>
                            </tr>
                        </tbody>
                    </table> ):
                    <table className='table-fixed'>
                        <tbody>
                            <tr className='bg-khaki border-solid border-2 border-grey'>
                                <td className='w-96 h-1 pl-2'>{member.displayName.stringValue}</td>
                            </tr>
                        </tbody>
                    </table> 
        }
        </>
        )
}

const BoardDetail = () => {

    const navigate = useNavigate()
    const { id, boardid } = useParams()
    const{ user, logOut } = UserAuth();
    const [ docID, setDocID ] = useState('');
    const[ updateType, setUpdateType ] = useState('')
    const [ boardData, setBoardData ] = useState(null)
    const [ fetch, setfetch] = useState(false)
    const ref = collection(db, 'users')
    const q = query(ref, where('uid', '==', user.uid))
    const[ memberlist, setMemberList ] = useState([])
    const [ endDate, setEndDate ] = useState('')
    const [ listName, setListName ] = useState('')
    const [ ws, setWs ] = useState([])
    const [ wsID, setWsID ] = useState('')
    const boardRef = doc(db, "board", boardid)
    const [ email, setEmail ] = useState([])
    const [ wsFetch, setWsFetch ] = useState(false)
    const link = `http://localhost:3000/signInInviteB/${id}/${boardid}`
    let currDate = new Date()
    let date = currDate.getDate() + 10
    let month = currDate.getMonth() + 1
    let year = currDate.getFullYear()
    const wsRef = collection(db, "workspaces")

    async function sendEmail(type, title, to, link, expired){
        try {
            await axios({
                method: "post",
                url: "http://localhost:3001/sendemail",
                data: {
                    type,
                    title,
                    to,
                    link,
                    expired
                }
            })
        } catch (error) {
            alert(error)
        }
    }

    useEffect(()=>{
        let q = query(wsRef)
        const tempWs = []
        onSnapshot(q, (snapShot)=>{
            snapShot.docs.forEach((doc)=>{
                tempWs.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            setWs(tempWs)
            setWsFetch(true)
        })
    }, [])

    // console.log(ws)

    const handleSendEmail = async e=> {
        e.preventDefault()
        await sendEmail("board", boardData.title, email, link, boardData.endDate)
        alert("Invitation has been send to the user email")
    }


    const workspaceRef = doc(db, "workspaces", id);
    
    if(date > 31){
        date -= 31
        month += 1
    }
    
    if(month > 12){
        month = 1
        year += 1
    }
    let currDateFormat = `${year}-${month}-${date}`
    

    useEffect(()=>{
        try {
            const currBoard = getDoc(boardRef).then((data)=>{
                // console.log(data)
                // setBoardData(data._document.data.value.mapValue.fields)
                setBoardData(data.data())
                setfetch(true)
            })
            
        } catch (error) {
            
        }
    }, [])

    // console.log(boardData)

    useEffect(()=>{
        try {
            const wsSnap = getDoc(boardRef).then(data=>{
                setBoardData(data.data())
                // wsData = data.data()
                // console.log(wsData)
                // console.log(data.data())
                setfetch(true)
            })   
            // console.log(wsSnap)
            // if(wsSnap.exists()){
            // }else{
            //     console.log("no data")
            // }
        } catch (error) {
            
        }
    }, [])

    const handleUpdate = async()=>{
        await updateDoc(boardRef, {
                visibility: updateType
        })
        alert("Update success")
    }  

    // console.log(user)

    const handleJoin = async()=>{
        const boardRef = doc(db, 'board', boardid)
        await updateDoc(boardRef, {
            member: arrayUnion(user.uid)
        }).then(console.log("done"))
        alert("join success")
    }
    
    const handleLeave = async ()=>{
        const boardRef = doc(db, 'board', boardid)
        await updateDoc(boardRef,  {
            member: arrayRemove(user.uid)
        })
        alert("Hope you have a good time here")
        navigate(`/Home/${user.uid}`)
    }

    const handleClose = async ()=>{
        const boardRef = doc(db, 'board', boardid)
        await updateDoc(boardRef,  {
            status: "closed"
        })
        alert("Successfuly closed the board")
        navigate(`/Home/${user.uid}`)
    }
    
    const handleOpen = async ()=>{
        const boardRef = doc(db, 'board', boardid)
        await updateDoc(boardRef,  {
            status: "open"
        })
        alert("Successfuly open the board")
        navigate(`/Home/${user.uid}`)
    }
    
    
    // console.log(id, boardid)
    
    const Curruser = getDocs(q).then((data)=>{
        // console.log(data.docs[0].id)
        setDocID(data.docs[0].id)
    })

    // const userRef = doc(db, 'users', docID)
    
    // console.log(Curruser)

    const handleBack = async () => {
        // console.log("backk")
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
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

    const handleFav = async () =>{
        await updateDoc(doc(db, 'board', boardid), {
            favBy: arrayUnion(user.uid)
        })
        alert("Added to favourite")
    }

    const handleMove = async () => {
        await updateDoc(doc(db, 'board', boardid), {
            workspaceID: wsID
        })
        alert("Board successfuly moved")
    }

    const delBoard = async () => {
        // console.log('start del')
        await deleteDoc(doc(db, "board", boardid))
        console.log("Board successfuly deleted")
        navigate(`/Home/${user.uid}`)
        // console.log('end del')
    }

    const handleList = async () =>{
        try {
            navigate(`/list/${boardid}`)
        } catch (error) {
            
        }
    }

    const handleCal = async ()=>{
        try {
            navigate(`/calendar/${boardid}`)
        } catch (error) {
            
        }
    }

    const handleCopy = e => {
        e.preventDefault();
        navigator.clipboard.writeText(link)
        alert("link coppied to clipboard")
    }

    const genLink = async e => {
        e.preventDefault()
        const boardRef = doc(db, 'board', boardid)
        
        await updateDoc(boardRef, {
            endDate: currDateFormat
        })
        alert("End date has been updated")
    }

    function createList(e){
        e.preventDefault()
        const colls = collection(db, 'list')
        const docRef = addDoc(colls, {
            title: listName,
            owner: user.uid,
            boardID: boardid
        })
        alert("Successfuly created a new list")
    }


    if(!fetch) return(
        <p>fetching data</p>
    )

    if(!wsFetch) return(
        <p>fetching data</p>
    )

return (
    <>
        {boardData.admins.map((value)=>{
            return value
        }).includes(user.uid) ?
            (
            <div className="h-screen flex overflow-hidden bg-gray-100">
            <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
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
                    <a className="bg-green text-2xl hover:bg-teal text-cream group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
                        Workspaces
                    </a>
                    <a onClick={handleList} className="bg-green text-2xl hover:bg-teal text-cream group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
                        List
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
        <div className="py-4 px-5"> 
            <div className="max-w-7xl space-x-4">
            <h1 className="text-3xl font-semibold text-gray-900 pl-4">Create list</h1>
            <form  className="max-w-4xl space-x-4 flex-col space-y-3">
                {/* sini */}
                <input onChange={(e) => setListName(e.target.value)} className='bg-khaki rounded-md w-80 h-10 pl-4 ' placeholder='Name' type="text" />
                <button onClick={createList} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 pl-4 pr-4 justify-self-center">Create</button>
            </form>

            <h1 className="text-2xl font-semibold text-gray-900 pt-4">Board Settings</h1>
            <button onClick={handleFav} className="bg-green hover:bg-teal text-cream rounded-md w-40 h-10 justify-self-center">Add to favourite</button>
            <select onChange={(e) => setUpdateType(e.target.value)} placeholder='Type' className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10  justify-self-center pl-2 pr-2">
                    <option className='text-gray-900' value="Public">Public</option>
                    <option className='text-gray-900' value="Private">Private</option>
            </select>
            {
                boardData.member.map((value)=>{
                    return value
                }).includes(user.uid) ? (<button className="bg-teal hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center" disabled>Joined</button>) :
                <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center" disabled>Join</button>
            } 
            <button onClick={handleLeave} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Leave</button>
            <button onClick={handleUpdate} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Update</button>
            <button onClick={handleCal} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Calendar</button>

            {
                boardData.status == 'open' ? (<button onClick={handleClose} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Close</button>) : 
                <button onClick={handleOpen} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">open</button>
            }
            <button onClick={handleClose} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Delete</button>
            <div className='flex space-x-4 pt-4'>
                <p className='pt-2 font-semibold text-gray-900 text-m'>Move to</p>
                <select onChange={(e) => setWsID(e.target.value)} className="text-gray-900 form-select form-select-lg mb-3 w-30 h-10 pt-1 pl-2 pr-2 bg-khaki rounded-md" name="" id="">
                    {
                        // ws.forEach((e)=>{
                        //     <option className='text-gray-900 bg-khaki' value={e.id}>{e.title}</option>
                        //     console.log(e.title)
                        // })
                        ws.map((item)=>{
                            return <option className='text-gray-900 bg-khaki' value={item.id}>{item.title}</option>
                        })
                    }
                </select>
                <button onClick={handleMove} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 justify-self-center">Move</button>
                
            </div>
            <input className='bg-khaki text-grey rounded-md w-2/5 h-10 mt-2 justify-self-center pl-1' type="text" disabled placeholder='Your link' value={link}/>
            <button onClick={genLink} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Change</button>
            <button onClick={handleCopy} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Copy</button>
            <br />
            <input onChange={(e)=>setEmail(e.target.value)} className='bg-khaki text-grey rounded-md w-64 h-10 mt-4 justify-self-center pl-2 pr-2' type="email" name="" id="" placeholder='Input email'/>
            <button onClick={handleSendEmail} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Send</button>
            </div>
        </div>
        <div className="py-2 px-5"> 
            <div className="max-w-7xl space-x-4">
            
            <h1 className="text-2xl font-semibold text-gray-900 pl-4 pt-4 pb-2">Board member</h1>
            {boardData.member.map((item)=>{
                return(<MemberComponent memberUID={item}></MemberComponent>)
            })}
            </div>
        </div>
        <div>
            
        </div>
        </main>
        
        <button onClick={handleBack}>back</button>
    </div>
    </div>
            ) :
            <div className="h-screen flex overflow-hidden bg-gray-100">
            <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true">
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
                <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
                <div className="absolute top-0 right-0 -mr-12 pt-2">
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
                    <a className="bg-green text-2xl hover:bg-teal text-cream group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
                        Workspaces
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
        <div className="py-4 pl-4"> 
            <div className="max-w-7xl space-x-4">
                {/* <h1 className="text-4xl font-semibold text-gray-900 pl-4">{boardData.title}</h1> */}
            {
                boardData.member.map((value)=>{
                    return value
                }).includes(user.uid) ?
                <>
                    <h1 className="text-3xl font-semibold text-gray-900 pt-4">Create list</h1>
                    <h1 className="text-2xl font-semibold text-gray-900 pt-4 ">Board Settings</h1>
                    <button onClick={handleFav} className="bg-green hover:bg-teal text-cream rounded-md w-40 h-10 mt-2 justify-self-center">Add to favourite</button>
                    <button onClick={handleLeave} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-2 justify-self-center">Leave</button>
                    
                    <h1 className="text-2xl font-semibold text-gray-900 pl-0 pt-4">Board member</h1>
                    <div className='pt-2'>
                        {boardData.member.map((item)=>{
                            return(<MemberComponent memberUID={item}></MemberComponent>)
                        })}
                    </div>
                </>
                :
                <button onClick={handleJoin} className="bg-green hover:bg-teal text-cream rounded-md w-40 h-10 mt-4">Join</button>
            }

            </div>
        </div>
        <div>
            
        </div>
        </main>
        
        <button onClick={handleBack}>back</button>
    </div>
    </div>
        }
    </>
    
  )
}

export default BoardDetail
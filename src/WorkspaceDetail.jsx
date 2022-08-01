import userEvent from '@testing-library/user-event'
import React, { useEffect, useState, createContext, useContext } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { addDoc, collection, query, setDoc, deleteDoc , getDoc, where, doc, getDocs, updateDoc, arrayUnion, arrayRemove, update, getFirestore, onSnapshot, Firestore, FieldValue} from "firebase/firestore";
import {db, auth} from './firebase'
import { async } from '@firebase/util';
import axios from "axios"

const MemberComponent = ({memberUID})=>{
    const { id } = useParams()
    const{ user, logOut } = UserAuth();
    const [member, setMember] = useState()
    const [getData, setGetData] = useState(false)
    const [ wsCurr, setWsCurr ] = useState({})
    const [ fetch, setFetch ] = useState(false)
    //     admins: Array,
        
    // }>({
    //     admins: [],
    //     description: "",
    //     member: [],
    //     title: "",
    //     visibility: ""
    // })
    const ref = collection(db, 'users')
    const workspaceRef = doc(db, 'workspaces', id)
    const q = query(ref, where('uid', '==', memberUID))
    
    // console.log(wsCurr)
    // console.log(currWs)
    
    useEffect(()=>{
        try {
            const currWs = getDoc(workspaceRef).then((data)=>{
                // console.log(data)
                setWsCurr(data._document.data.value.mapValue.fields)
                setFetch(true)
            })
            
        } catch (error) {
            
        }
    }, [])
    
    const handleRemove = async ()=>{
        await updateDoc(workspaceRef,  {
            member: arrayRemove(memberUID)
        })
        alert("member have been removed")
    }
    // console.log(wsCurr.admins)

    const handleGrant = async()=>{
        await updateDoc(workspaceRef, {
            admins: arrayUnion(memberUID)
        })
        alert("Member has been granted the admin role")
    }
    
    const handleRevoke = async()=>{
        await updateDoc(workspaceRef, {
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
        {wsCurr.admins.arrayValue.values.map((value)=>{
            return value.stringValue
        }).includes(user.uid) ? 
                    (<table className='table-fixed'>
                        <tbody>
                            <tr className='bg-khaki border-solid border-2 border-grey'>
                                <td className='w-96 h-1 pl-2'>{member.displayName.stringValue}</td>
                                <td className='w-32 h-1 '><button onClick={handleGrant} className='bg-teal pr-4 pl-1'>Grant</button></td>
                                <td className='w-32 h-1 '><button onClick={handleRevoke} className='bg-cream pr-4 pl-1'>Revoke</button></td>
                                <td className='w-32 h-1 '><button onClick={handleRemove} className='bg-red pr-4 pl-1'>Remove</button></td>
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


const WorkspaceDetail = () => {

    const { id } = useParams()
    const[ boardName, setName ] = useState('')
    const[ boardDesc, setDesc ] = useState('')
    const[ boardType, setType ] = useState('')
    const[ updateType, setUpdateType ] = useState('')
    const[ memberlist, setMemberList ] = useState([])
    const [ adminList, setAdminList ] = useState([])
    const{ user, logOut } = UserAuth();
    const[ boards, setBoards ] = useState([])
    const [ boardIDS, setBoardIDS ] = useState([])
    const [wsData, setwsData] = useState(null);
    const [ fetch, setfetch] = useState(false)
    const [ wsMember, setWsMember ] = useState([])
    const [ email, setEmail ] = useState([])
    const [ endDate, setEndDate ] = useState('')
    const navigate = useNavigate()
    const link = `http://localhost:3000/signInInviteWS/${id}`
    const currUser = auth.currentUser
    let currDate = new Date()
    let date = currDate.getDate() + 10
    let month = currDate.getMonth() + 1
    let year = currDate.getFullYear()

    if(date > 31){
        date -= 31
        month += 1
    }

    if(month > 12){
        month = 1
        year += 1
    }

    let currDateFormat = `${year}-${month}-${date}`
    // console.log(currDateFormat)

    const wsContext = createContext()
    const boardRef = collection(db, 'board') 
    const boardQ = query(boardRef, where('workspaceID', '==', id))

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

    // console.log(wsData)

    const handleSendEmail = async e=> {
        e.preventDefault()
        await sendEmail("workspace", wsData.title, email, link, endDate)
        alert("Invitation has been send to the user email")
    }

    useEffect(()=>{
        const tempBoard = []
        const tempBoardID = []
        onSnapshot(boardQ, (snapShot)=>{
            snapShot.docs.forEach((doc)=>{
                tempBoard.push({
                    ...doc.data(),
                    id: doc.id
                })
                tempBoardID.push(doc.id)
            })
            setBoards(tempBoard)
            setBoardIDS(tempBoardID)
        })
    }, [])

    // console.log(boardIDS)

    // console.log(boards)

    // console.log(wsData)

    const workspaceRef = doc(db, "workspaces", id);
    useEffect(()=>{
        try {
            const wsSnap = getDoc(workspaceRef).then(data=>{
                setwsData(data.data())
                // wsData = data.data()
                // console.log(wsData)
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
        await updateDoc(workspaceRef, {
                visibility: updateType
        })
        alert("Update success")
    } 

    const handleLeave = async ()=>{
        await updateDoc(workspaceRef,  {
            member: arrayRemove(user.uid)
        })
        alert("Hope you have a good time here")
        navigate(`/Home/${user.uid}`)
    }
    

    // if(wsSnap()){
    //     // const tst = wsSnap.data()
    //     console.log(wsSnap.data.title)
    // }else{
    //     console.log("no docsss")
    // }

    // useEffect(() => {
    //     let q = query(workspaceRef)
    //     const wsmemberlist = []
    //     onSnapshot(q, (snapShot)=>{
    //         snapShot.docs.forEach((doc)=>{
    //             wsmemberlist.push({
    //                 ...doc.data(),
    //                 name:doc.displayName
    //             })
    //         })
    //         setWsMember(wsmemberlist)
    //     })
    // }, [])
    // console.log(wsMember)

    // getDoc(doc(db,'workspaces',doc(id))).then(e => {
    //     console.log(e.data())
    // })
    // var currDoc = 


    function createBoard(e){
        e.preventDefault()
        let temArr = [user.uid]
        setMemberList(temArr)
        setAdminList(temArr)
        console.log(boardName,boardDesc,boardType)
        console.log(id)
    }

    useEffect(()=>{
        if(memberlist.length == 1){
            // const colls = collection(db, 'workspaces', id, 'board')
            // const docRef = addDoc(colls, {
            //     title : boardName,
            //     description: boardDesc,
            //     admins: adminList,
            //     owner: user.uid,
            //     member: memberlist,
            //     visibility: boardType
            // }).then(console.log("dari createWS",user.uid))

            // console.log("docref if",docRef.id)
            const colls2 = collection(db, 'board')
            const boardRef = addDoc(colls2, {
                title : boardName,
                description: boardDesc,
                admins: adminList,
                owner: user.uid,
                member: memberlist,
                visibility: boardType,
                workspaceID: id,
                status: 'open'
            }).then(console.log("create board"))
            // const membersColl = setDoc(doc(db, "workspaces/" + id + "/board/" + docRef.id + "/Members", currUser.uid), {
            //     Name: currUser.displayName,
            //     Admin: true
            // }).then(console.log("dari createcol2",user.uid))
        }

    }, [memberlist])

    // useEffect(()=>{
    //     if(memberlist.length == 1){
    //         const colls = collection(db, 'board')
    //         const boardRef = addDoc(colls, {
    //             title:
    //         })
    //     }
    // })

    const addWsMember = async(WSID)=>{
        // console.log(memberlist)
        // for(var i = 0; i < memberlist.length; i++){
            // const userRef = doc(db, 'users', memberlist[i])
            const wsRef = doc(db, 'workspaces', id)
            await updateDoc(wsRef, {
                member:arrayUnion(user.uid)
            }).then(console.log("done"))
            alert("join success")
        // }
        // await (console.log("add done"))
    }

    const delWorkspace = async () => {
        // console.log('start del')
        boardIDS.forEach(async (e)=>{
            await updateDoc(doc(db, 'board', e), {
                status: "closed",
                workspaceID: "-"
            })
            // console.log(e)
        })
        // forEach(boardIDS){
        //     await updateDoc(doc(db))
        // }
        await deleteDoc(doc(db, "workspaces", id))
        navigate('/workspaces')
        // console.log('end del')
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
        // console.log("wekseoes")
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

    const handleCopy = e => {
        e.preventDefault();
        navigator.clipboard.writeText(link)
        alert("link coppied to clipboard")
    }

    const genLink = async e => {
        e.preventDefault()
        const wsRef = doc(db, 'workspaces', id)
        await updateDoc(wsRef, {
            endDate: currDateFormat
        })
        alert("End date has been updated")
    }

    if(!fetch) return(
        <p>fetching data</p>
        )

    // console.log(wsData.member)

    return (
        // <div>workspaceDetail</div>
        <>
            {wsData.admins.map((value)=>{
                return value
            }).includes(user.uid) ?
                (
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
                <select onChange={(e) => setType(e.target.value)} placeholder='Type' className="text-gray-900 form-select form-select-lg mb-3 w-30 h-10 mt-6 pl-2 pr-2 bg-khaki rounded-md">
                    <option className='text-gray-900' value="Public">Public</option>
                    <option className='text-gray-900' value="Private">Private</option>
                </select>
                
            <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-6 justify-self-center">Create</button>

            </form>

            </div>

        </div>
        <div>
            
        </div>
        <div className="px-5"> 
            <div className="max-w-7xl space-x-4">
            <h1 className="text-4xl font-semibold text-gray-900 pl-4">Workspace Settings</h1>
            {
                wsData.member.map((value)=>{
                    return value
                }).includes(user.uid) ? (<button onClick={addWsMember} className="bg-teal hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center" disabled>Joined</button>) :
                <button onClick={addWsMember} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Join</button>
                
            }
            <select onChange={(e) => setUpdateType(e.target.value)} placeholder='Type' className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center pl-2 pr-2">
                    <option className='text-gray-900' value="Public">Public</option>
                    <option className='text-gray-900' value="Private">Private</option>
            </select>
            <button onClick={handleUpdate} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Update</button>
            <button onClick={handleLeave} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Leave</button>
            <button onClick={delWorkspace} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Delete</button>
            <br />
            {/* <input className="bg-green hover:bg-teal text-cream rounded-md w-auto h-10 mt-4 justify-self-center pl-2 pr-2" onChange={(e) => setEndDate(e.target.value)} type={'datetime-local'} value={endDate}/> */}
            <input className='bg-khaki text-grey rounded-md w-2/5 h-10 mt-4 justify-self-center pl-1' type="text" disabled placeholder='Your link' value={`http://localhost:3000/invitation/workspace/${id}`}/>
            <button onClick={genLink} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Change</button>
            <button onClick={handleCopy} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Copy</button>
            <br />
            <input onChange={(e) => setEmail(e.target.value)} className='bg-khaki text-grey rounded-md w-64 h-10 mt-4 justify-self-center pl-2 pr-2' type="email" name="" id="" placeholder='Input email'/>
            <button onClick={handleSendEmail} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Send</button>
            <h1 className="text-2xl font-semibold text-gray-900 w-96 pl-0 pt-4 pb-4">Workspace member</h1>

            {
                wsData.member.map((value)=>{
                    return value
                }).includes(user.uid) ? 
                <>
                    {wsData.member.map((item)=>{
                        return(<MemberComponent memberUID={item}></MemberComponent>)
                    })} 
                </>
                : null
                
            }
            {/* <button onClick={test}>test</button> */}
            {/* {wsData.member.map((item)=>{
                return(<MemberComponent memberUID={item}></MemberComponent>)
            })} */}

            </div>

        </div>
        <div>
            
        </div>
        </main>

        
        <button onClick={handleBack}>back</button>
    </div>
    </div>
                ):
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
        <div className="py-4 pl-4"> 
            <h1 className="text-4xl font-semibold text-gray-900 pl-4">{wsData.title}</h1>
            <div className="max-w-7xl space-x-4">
            {
                wsData.member.map((value)=>{
                    return value
                }).includes(user.uid) ?
                <>
                    <h1 className="text-2xl font-semibold text-gray-900 pl-4 pt-4">Create Board</h1>
                    <form onSubmit={createBoard} className="max-w-4xl space-x-4 flex-col space-y-1">
                        <input onChange={(e) => setName(e.target.value)} className='bg-khaki rounded-md w-80 h-10  pl-4' placeholder='Name' type="text" />
                        <input onChange={(e) => setDesc(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Description' type="text" />
                        <select onChange={(e) => setType(e.target.value)} placeholder='Type' className="text-gray-900 form-select form-select-lg mb-3 w-30 h-10 mt-6 pl-2 pr-2 bg-khaki rounded-md">
                            <option className='text-gray-900' value="Public">Public</option>
                            <option className='text-gray-900' value="Private">Private</option>
                        </select>
                    <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-6 justify-self-center">Create</button>
        
                    </form>
                </>
                :
                null
            }
            {
                wsData.member.map((value)=>{
                    return value
                }).includes(user.uid) ?
                (
                    <>
                        <button onClick={handleLeave} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Leave</button>
                    </>
                ) :
                <button onClick={addWsMember} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center ml-3" >Join</button>
            }
            <br />
            {
                wsData.member.map((value)=>{
                    return value
                }).includes(user.uid) ? 
                
                <>
                    <h1 className="text-2xl font-semibold text-gray-900 w-96 pl-0 pt-4 pb-4">Workspace member</h1>
                    {wsData.member.map((item)=>{
                        return(<MemberComponent memberUID={item}></MemberComponent>)
                    })} 
                </>
                : null
                
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
    //     <div className="h-screen flex overflow-hidden bg-gray-100" >
            
    //         <div className="fixed inset-0 flex z-40 md:hidden" role="dialog" aria-modal="true" >
                
    //             <div className="fixed inset-0 bg-gray-600 bg-opacity-75" aria-hidden="true"></div>
    //             <div className="relative flex-1 flex flex-col max-w-xs w-full pt-5 pb-4 bg-gray-800">
    //             <div className="absolute top-0 right-0 -mr-12 pt-2" >
    //                 <button className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white">
    //                     <span className="sr-only">Close sidebar</span>
    //                     <svg className="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    //                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
    //                     </svg>
    //                 </button>
    //             </div>
    //             <div className="flex-shrink-0 flex items-center px-4">
    //                 <h1 onClick={handleBack}>Chello</h1>
    //             </div>
    //             <div className="mt-5 flex-1 h-0 overflow-y-auto">
    //                 <nav className="px-2 space-y-1"></nav>
    //             </div>
    //         </div>

    //         <div className="flex-shrink-0 w-14" aria-hidden="true"></div>
    //     </div>

    //     <div className="hidden md:flex md:flex-shrink-0">
    //         <div className="flex flex-col w-64">
    //             <div className="flex flex-col h-0 flex-1">
    //                 <div className="flex items-center h-16 flex-shrink-0 px-3 bg-khaki">
    //                     <h1 className = "text-green font-sans text-center text-5xl ml-2 font-bold py-20">Chello</h1>
    //                 </div>
    //             <div className="flex-1 flex flex-col overflow-y-auto">
    //             <nav className="flex-1 px-4 py-4 bg-khaki space-y-3 spacex-2">
    //                 <a onClick={handleBoard} className="bg-green text-2xl hover:bg-teal text-cream group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
    //                     Boards
    //                 </a>
    //                 <a href="#" className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
    //                     View member
    //                 </a>
    //             </nav>
    //         </div>
    //     </div>
    // </div>
    // </div>
    // <div className="flex flex-col w-0 flex-1 overflow-hidden">
    //     <div className="relative z-10 flex-shrink-0 flex h-16 bg-white shadow">
    //     <button className="px-4 border-r border-gray-200 text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 md:hidden">
    //         <span className="sr-only">Open sidebar</span>
    //         <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
    //         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h7" />
    //         </svg>
    //     </button>
    //     <div className="flex-1 px-4 flex justify-between bg-cream">
    //         <div className="flex-1 flex">
    //         <form className="w-full flex md:ml-0 " action="#" method="GET">
    //             <label for="search_field" className="sr-only ">Search</label>
    //             <div className="relative w-full text-gray-400 focus-within:text-gray-600">
    //             <div className="absolute inset-y-0 left-0 flex items-center pointer-events-none">
    //                 <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    //                 <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
    //                 </svg>
    //             </div>
    //             <input id="search_field" className=" w-full h-full pl-8 pr-3 py-2 border-transparent bg-cream placeholder-white focus:outline-none focus:placeholder-white focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search"></input>
    //             </div>
    //         </form>
    //         </div>
    //         <div className="ml-4 flex items-center md:ml-6">
    //         <button onClick={handleAccount} className='bg-khaki h-8 px-4 m-2 text-xl rounded-md'>{user && user.displayName}</button>
    //         {/* <h1 className='text-xl'>{user && user.displayName}</h1> */}
            

    //         <div className="ml-3 relative">
    //             <div>
                
    //             <button onClick={handleLogout} className='bg-khaki h-8 px-4 m-2 text-xl rounded-md'>Logout</button>
    //                 {/* <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixqx=nkXPoOrIl0&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""></img> */}
                
    //             </div>

            
            
    //         </div>
    //         </div>
    //     </div>
    //     </div>

    //     <main className="flex-1 relative overflow-y-auto focus:outline-none bg-cream" >
    //     <div className="py-8 px-5"> 
    //         <div className="max-w-7xl space-x-4">
    //         <h1 className="text-4xl font-semibold text-gray-900 pl-4">Create Board</h1>
    //         <form onSubmit={createBoard} className="max-w-4xl space-x-4 flex-col space-y-3">
    //             <input onChange={(e) => setName(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Name' type="text" />
    //             <input onChange={(e) => setDesc(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Description' type="text" />
    //             <select onChange={(e) => setType(e.target.value)} placeholder='Type' className="text-gray-900 form-select form-select-lg mb-3 w-30 h-10 mt-6 pl-2 pr-2 bg-khaki rounded-md">
    //                 <option className='text-gray-900' value="Public">Public</option>
    //                 <option className='text-gray-900' value="Private">Private</option>
    //             </select>
    //         <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-6 justify-self-center">Create</button>

    //         </form>
    //         <button onClick={delWorkspace} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Delete</button>
    //         <button onClick={addWsMember} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Join</button>
    //         <select onChange={(e) => setUpdateType(e.target.value)} placeholder='Type' className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center pl-2 pr-2">
    //                 <option className='text-gray-900' value="Public">Public</option>
    //                 <option className='text-gray-900' value="Private">Private</option>
    //         </select>
    //         <button onClick={handleUpdate} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Update</button>
    //         <button onClick={handleLeave} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Leave</button>
    //         <br />
    //         <input className="bg-green hover:bg-teal text-cream rounded-md w-auto h-10 mt-4 justify-self-center pl-2 pr-2" onChange={(e) => setEndDate(e.target.value)} type={'datetime-local'} value={endDate}/>
    //         <input className='bg-khaki text-grey rounded-md w-2/5 h-10 mt-4 justify-self-center pl-1' type="text" disabled placeholder='Your link' value={`http://localhost:3000/invitation/workspace/${id}`}/>
    //         <button onClick={genLink} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Change</button>
    //         <button onClick={handleCopy} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Copy</button>
    //         <br />
    //         <input onChange={(e) => setEmail(e.target.value)} className='bg-khaki text-grey rounded-md w-auto h-10 mt-4 justify-self-center pl-2 pr-2' type="email" name="" id="" placeholder='Input email'/>
    //         <button onClick={handleSendEmail} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center">Send</button>
    //         <h1 className="text-2xl font-semibold text-gray-900 w-96 pl-0 pt-4 pb-4">Workspace member</h1>
    //         {wsData.member.map((item)=>{
    //             return(<MemberComponent memberUID={item}></MemberComponent>)
    //             // <tr>
    //             //     <td>{item.displayName}</td>
    //             //     <td><button>Grant</button></td>
    //             //     <td><button>Revoke</button></td>
    //             //     <td><button>Remove</button></td>
    //             // </tr>
    //         })}

    //         </div>

    //     </div>
    //     <div>
            
    //     </div>
    //     </main>

        
    //     <button onClick={handleBack}>back</button>
    // </div>
    // </div>
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
import userEvent from '@testing-library/user-event'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { addDoc, collection, query, setDoc, where, doc, getDocs, updateDoc, arrayUnion, getFirestore, onSnapshot} from "firebase/firestore";
import {db} from './firebase'
import nbell from './nbell.jpg'
import { async } from '@firebase/util';

const Mainpage = () => {

    const{ user, logOut } = UserAuth();
    const[ wsName, setName ] = useState('')
    const[ wsDesc, setDesc ] = useState('')
    const[ wsType, setType ] = useState('')
    const [error, setError] = useState('')
    const [ memberlist, setMemberList ] = useState([])
    const [ adminList, setAdminList ] = useState([])
    const [ workspaces, setWorkspaces ] = useState([])
    const [ joinedWS, setJoinedWS ] = useState([])
    const [ favBoard, setFavBoard ] = useState([])
    const [ docID, setDocID ] = useState('');

    const userRef = collection(db, 'users')
    const userQ = query(userRef, where('uid', '==', user.uid))

    const Curruser = getDocs(userQ).then((data)=>{
        // console.log(data.docs[0].id)
        setDocID(data.docs[0].id)
        // console.log(data)
    })

    // console.log(docID)
    // console.log(Curruser)

    const navigate = useNavigate()
    
    const ref = collection(db, 'workspaces')
    const q = query(ref, where('member', 'array-contains', user.uid))
    const favBoardRef = collection(db, 'board')
    const favBoardQ = query(favBoardRef, where('favBy', 'array-contains', user.uid), where('status', '==', 'open'))
    // console.log(q)

    useEffect(()=>{
        try {
            let tempArr = []
            const favBoards = getDocs(favBoardQ).then((data)=>{
                const newData = data.docs.map((doc)=>{
                    return {
                        ...doc.data(),
                        id:doc.id
                    }
                })
                setFavBoard(newData)
            })

            favBoards.docs.forEach((e)=>{
                tempArr.push(e)
                setFavBoard(tempArr)
            })
        } catch (error) {
            
        }
    }, [])

    // console.log(favBoard)

    useEffect(()=>{
        try {
            // const tst = getDocs(q).then(console.log("apaan"))
            let tempArr = []
            const wsjoin = getDocs(q).then((data)=>{
                const newData = data.docs.map((doc)=>{
                    
                    return {
                        ...doc.data(),
                        id: doc.id
                        // doc._document.data.value.mapValue.fields
                    }
                })
                setJoinedWS(newData)
                // console.log(data.docs[0]._document.data.value.mapValue.fields)
                // console.log(data)
                // data.docs.map((item)=>(
                //     <p>test</p>
                // ))
            })

            // console.log(wsjoin.docs)

            wsjoin.docs.forEach((e)=>{
                console.log(e)
                tempArr.push(e)
                setJoinedWS(tempArr)
            })

            // const joinnws = getDocs(q).then(console.log("sfljk"))

            // joinnws.forEach((e)=>{
            //     tempArr.push(e)
            //     setJoinedWS(tempArr)
            // })
            // console.log(joinedWS)
        } catch (error) {
            
        }
    }, [])

    // useEffect(()=>{
    //     const tempFav = []
    //     onSnapshot(userQ, (snapShot)=>{
    //         console.log(snapShot.docs[0]._document.data.value.mapValue.fields.favBoard.arrayValue.values)
    //         snapShot.docs[0]._document.data.value.mapValue.fields.favBoard.arrayValue.values.forEach((doc)=>{
    //             tempFav.push({
    //                 // ...doc.data(),
    //                 id: doc.stringValue
    //             })
    //         })
    //         setFavBoard(tempFav)
    //     })
    // }, [])

    // console.log(favBoard)


    const getAllWS = async () => {
      // const db = getFirestore()
        const queryy = query(collection(db, 'workspaces'))
        let tempWS = []
        let execQ = await getDocs(queryy)
        execQ.forEach((e)=>{
            tempWS.push(e)
            setWorkspaces(tempWS)
        })
    }

    function createWS(e){
        e.preventDefault()
        let temArr = [user.uid]
        setMemberList(temArr)
        setAdminList(temArr)
    }

    useEffect(()=>{
        if(memberlist.length == 1){
            const colls = collection(db, 'workspaces')
            const docRef = addDoc(colls, {
            title : wsName,
            description: wsDesc,
            owner: user.uid,
            member: memberlist,
            admins: adminList,
            visibility: wsType
            }).then(console.log("dari createWS",user.uid))
        }

    }, [memberlist])

    const addWsMember = async(WSID)=>{
        console.log(memberlist)
        // for(var i = 0; i < memberlist.length; i++){
        //     const userRef = doc(db, 'users', memberlist[i])
        //     await updateDoc(userRef, {
        //         workspaces:arrayUnion(WSID)
        //     })
        // }
        // await (console.log("add done"))
    }

    function getWorkspace(){
        const stringQuery = query(collection(db, "users", user.uid))
    }

    // getAllWS()
    // console.log("smua ws", workspaces)
    // console.log(user.uid)
  //  const handleWorkspace = async(e) => {
  //   e.preventDefault()
  //   if(wsType === "-"){
  //     setError('invalid workspace type')
  //     console.log(error)
  //     return
  //   }else{
  //     console.log('hasil ws',wsName,wsDesc,wsType)
  //      setError('')
  //      try {
  //          const ws = await addDoc(collection(db, 'workspaces'), {
  //            desc: wsDesc,
  //            name: wsName,
  //            type: wsType
  //          })

  //          const refUser = collection(db, 'users', )

  //          getDocs(query(refUser, where("name", "==", user.displayName)), {
  //             workspaceName: wsName
  //          }).then(data=>{
  //             console.log(data.docs[0].id)
  //           addDoc(collection(db, "users", data.docs[0].id, "workspaceMemberOf"),{
  //             workspaceName: wsName,
  //             isAdmin: true
  //           })
  //          })

  //          console.log('hasil ws',wsName,wsDesc,wsType)
  //      } catch (e) {
  //        console.log(e.message)
  //      }
  //   }
  //  }

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
        try {
            navigate('/workspaces')
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

    const hanldeKeydown = (e) => {
        console.log('key shortcut')
        if(e.key === 'Escape'){
            navigate(`/Home/${user.uid}`)
        }
    }

    const handleCB = async()=>{
        try {
            navigate('/closedBoard')
        } catch (error) {
            
        }
    }

    // console.log(joinedWS)
    // console.log(user)
    // console.log("jsskjs",UserAuth().user)

    // console.log('dlflkfd')
    // console.log(UserAuth().user.id)
    return(

    
<div className="h-screen flex overflow-hidden bg-gray-100"  tabIndex={0} onKeyDown={hanldeKeydown}>
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

        <main className="flex-1 relative overflow-y-auto focus:outline-none bg-cream">
        <div className="py-4 px-5"> 
            <div className="max-w-7xl space-x-4">
            <h1 className="text-4xl font-semibold text-gray-900 pl-4">Create Workspace</h1>
            <form onSubmit={createWS} className="max-w-4xl space-x-4 flex-col space-y-3">
                <input onChange={(e) => setName(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Name' type="text" />
                <input onChange={(e) => setDesc(e.target.value)} className='bg-khaki rounded-md w-80 h-10 mt-6 pl-4' placeholder='Description' type="text" />
                <select onChange={(e) => setType(e.target.value)} placeholder='Type' className="text-cream form-select form-select-lg mb-3 w-30 h-10 mt-6 pl-4 pr-4 bg-khaki rounded-md text-black">
                    <option className='text-cream' value="Public">Public</option>
                    <option className='text-cream' value="Private">Private</option>
                </select>
                <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-6 pl-4 pr-4 justify-self-center">Create</button>
            </form>
        

            </div>

        </div>
        <div>
            
        </div>
            <h1 className="text-3xl font-semibold text-gray-900 pl-10 pb-2">Joined Workspace</h1>
        <div className='px-8'>
            {joinedWS.map((data)=>(
                <Link to = {`/workspace/${data.id}`} >
                    <button className='bg-green hover:bg-teal h-8 px-4 m-2 text-xl rounded-md text-cream'>{data.title}</button>
                </Link>
            ))}
        </div>
            <h1 className="text-3xl font-semibold text-gray-900 pl-10 pb-2 pt-2">Favourite Board</h1>
        <div className='pl-8'>
                {favBoard.map((data)=>(
                    // <button>tst</button>
                    <Link to = {`/boardDetail/${data.workspaceID}/${data.id}`}>
                        <button className='bg-green hover:bg-teal h-8 px-4 m-2 text-xl rounded-md text-cream'>{data.title}</button>
                    </Link>
                ))}
        </div>
        </main>
    </div>
    {/* <button onClick={handleBack}>back</button> */}
    </div>

        /* // <div classNameName="flex flex-col justify-center">
        //   <h1 classNameName="text-green font-sans text-center text-5xl font-bold py-20"> CHello </h1>
        //   <div  className="flex flex-col justify-center items-center">
        //     <div className="pl-3 flex flex-col ">
        //       <h1 className="text-green font-sans font-bold mb-3">Username: {user && user.displayName} </h1>
        //       <button onClick={handleLogout} className="bg-green hover:bg-teal text-khaki w-96 font-bold py-2 px-4 border-b-4 border-green hover:border-teal rounded ">Sign out</button>
        //     </div>
        //   </div>
        // </div> */
    );
}

export default Mainpage

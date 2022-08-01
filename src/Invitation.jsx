import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import {db, auth} from './firebase'
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, onSnapshot} from "firebase/firestore";
import { useEffect } from 'react';
import { useState } from 'react';

const Invitation = () => {

    const { id } = useParams()
    // const wsRef = collection(db, 'workspaces', id)
    const [ wsCurr, setWsCurr ] = useState({})
    const [ fetch, setFetch ] = useState(false)
    const{ user, logOut } = UserAuth();
    const [ member, setMember ] = useState([])
    const [ wsData, setWsData ] = useState({})
    const [ docID, setDocID ] = useState([])
    const [ docFetch, setDocFetch ] = useState(false)
    const workspaceRef = doc(db, 'workspaces', id)
    const navigate = useNavigate()
    let currDate = new Date()
    let date = currDate.getDate()
    let month = currDate.getMonth()+1
    let year = currDate.getFullYear()
    const [ endDateString, setEndDateString ] = useState('')
    const [ isMember, setIsMember ] = useState(false)
    const userRef = collection(db, 'users')
    const notif = `A new user has hopped into ${wsData.title}`
    // const userQ = query(userRef, where('uid'))

    let currDateFormat = `${year}-${month}-${date}`

    async function getWsData(){
        const currWs = getDoc(workspaceRef).then((data)=>{
            // console.log(data.data())
            setWsData(data.data())
            setWsCurr(data._document.data.value.mapValue.fields)
            setEndDateString(data._document.data.value.mapValue.fields.endDate.stringValue)
            setMember(data.data().member)
            setFetch(true)
        })
    }

    useEffect(()=>{
        try {
            getWsData()
        } catch (error) {
            
        }
    }, [])

    
    // useEffect(()=>{
        //     setDocID(tempID)
        //     setDocFetch(true)
        // }, [])
        // console.log(member)
        
    const tempID = []
    member.forEach((e)=>{
        const user = getDocs(query(userRef, where('uid', '==', e))).then((data)=>{
            tempID.push(data.docs[0].id)
        })
    })

    const reWS = async()=>{
        // alert("Hope we can meet next time")
        navigate(`/workspace/${id}`)
    }

    // console.log(wsCurr.member)

    const addWsMember = async(WSID)=>{
        const wsRef = doc(db, 'workspaces', id)
        await updateDoc(wsRef, {
            member:arrayUnion(user.uid)
        }).then(console.log("done"))

        tempID.forEach(async (e)=>{
            await updateDoc(doc(db, 'users', e), {
                notification: arrayUnion(notif)
            })
        })
        alert("join success")
        navigate(`/workspace/${id}`)
    }

    const rejectInv = async()=>{
        alert("Hope we can meet next time")
        navigate(`/home/${user.uid}`)
    }
    
    const reHome = async()=>{
        // alert("Hope we can meet next time")
        navigate(`/home/${user.uid}`)
    }
    

    // console.log(wsCurr)

    // if(docFetch === false){
    //     return(
    //         <p>fetching data</p>
    //     )
    // }

    if(fetch === false){
        return(
            <p>fetching data</p>
        )
    }
    
    if(wsCurr.member.arrayValue.values.map((value)=>{return value.stringValue}).includes(user.uid)){
        return(
            <div className='justify-center bg-cream justify-items-center justify-self-center content-center items-center grid h-screen place-items-center'>
            <div className='bg-cream justify-center content-center items-center '>
                <div className='justify-center justify-items-center justify-self-center content-center items-center'>
                    <h1 className='text-2xl font-semibold text-gray-900 text-center justify-center'>Hi {user.displayName}, you're already a member of this workspace</h1>
                    <div className='grid  place-items-center'>
                        <button className="bg-green hover:bg-teal text-cream rounded-md w-auto h-10 mt-4 pl-4 pr-4" onClick={reWS}>Redirect me</button>
                    </div>
                </div>
            </div>

        </div>
        )
    }

    if(currDateFormat < wsCurr.endDate){
        return (
            <div className='justify-center bg-cream justify-items-center justify-self-center content-center items-center grid h-screen place-items-center'>
                <div className='bg-cream justify-center content-center items-center '>
                    <div className='justify-center justify-items-center justify-self-center content-center items-center'>
                        <h1 className='text-2xl font-semibold text-gray-900 text-center justify-center'>You've been invited</h1>
                        <div className='justify-between grid gap-4 grid-cols-2 pl-4'>
                            <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 " onClick={addWsMember}>accept</button>
                            <button className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 " onClick={rejectInv}>reject</button>
                        </div>
                    </div>
                </div>
    
            </div>
        )
        
    }else{
        return(
            <div className='justify-center bg-cream justify-items-center justify-self-center content-center items-center grid h-screen place-items-center'>
            <div className='bg-cream justify-center content-center items-center '>
                <div className='justify-center justify-items-center justify-self-center content-center items-center'>
                    <h1 className='text-2xl font-semibold text-gray-900 text-center justify-center'>Oops, the invite link already expired, please ask the admin to update the link</h1>
                    <div className='grid  place-items-center'>
                        <button className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-4 " onClick={reHome}>Home</button>
                    </div>
                </div>
            </div>

        </div>
        )
    }
}

export default Invitation
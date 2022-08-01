import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import {db, auth} from './firebase'
import { doc, getDoc, updateDoc, arrayUnion} from "firebase/firestore";
import { useEffect } from 'react';
import { useState } from 'react';

const InvitationBoard = () => {

    const { id, boardid } = useParams()
    // const wsRef = collection(db, 'workspaces', id)
    const [ boardCurr, setBoardCurr ] = useState({})
    const [ fetch, setFetch ] = useState(false)
    const{ user, logOut } = UserAuth();
    const workspaceRef = doc(db, 'board', boardid)
    const navigate = useNavigate()
    let currDate = new Date()
    let date = currDate.getDate()
    let month = currDate.getMonth()+1
    let year = currDate.getFullYear()
    const [ endDateString, setEndDateString ] = useState('')

    let currDateFormat = `${year}-${month}-${date}`

    async function getBoardData(){
        const currWs = getDoc(workspaceRef).then((data)=>{
            // console.log(data)
            setBoardCurr(data._document.data.value.mapValue.fields)
            setEndDateString(data._document.data.value.mapValue.fields.endDate.stringValue)
            setFetch(true)
        })
    }

    useEffect(()=>{
        try {
            getBoardData()
        } catch (error) {
            
        }
    }, [])

    const reBoard = async()=>{
        // alert("Hope we can meet next time")
        navigate(`/boardDetail/${id}/${boardid}`)
    }

    const addBoardMember = async(WSID)=>{
        const wsRef = doc(db, 'board', boardid)
        await updateDoc(wsRef, {
            member:arrayUnion(user.uid)
        }).then(console.log("done"))
        alert("join success")
        navigate(`/boardDetail/${id}/${boardid}`)
    }

    const rejectInv = async()=>{
        alert("Hope we can meet next time")
        navigate(`/home/${user.uid}`)
    }
    
    const reHome = async()=>{
        // alert("Hope we can meet next time")
        navigate(`/home/${user.uid}`)
    }

    if(fetch === false){
        return(
            <p>fetching data</p>
        )
    }

    if(boardCurr.member.arrayValue.values.map((value)=>{return value.stringValue}).includes(user.uid)){
        return(
            <div className='justify-center bg-cream justify-items-center justify-self-center content-center items-center grid h-screen place-items-center'>
            <div className='bg-cream justify-center content-center items-center '>
                <div className='justify-center justify-items-center justify-self-center content-center items-center'>
                    <h1 className='text-2xl font-semibold text-gray-900 text-center justify-center'>Hi {user.displayName}, you're already a member of this board</h1>
                    <div className='grid  place-items-center'>
                        <button className="bg-green hover:bg-teal text-cream rounded-md w-auto h-10 mt-4 pl-4 pr-4" onClick={reBoard}>Redirect me</button>
                    </div>
                </div>
            </div>

        </div>
        )
    }

    if(currDateFormat < boardCurr.endDate){
        return (
            <div className='justify-center bg-cream justify-items-center justify-self-center content-center items-center grid h-screen place-items-center'>
                <div className='bg-cream justify-center content-center items-center '>
                    <div className='justify-center justify-items-center justify-self-center content-center items-center'>
                        <h1 className='text-2xl font-semibold text-gray-900 text-center justify-center'>You've been invited</h1>
                        <div className='justify-between grid gap-4 grid-cols-2 pl-4'>
                            <button className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 " onClick={addBoardMember}>accept</button>
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

export default InvitationBoard
import userEvent from '@testing-library/user-event'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import { getAuth, updateEmail, updateProfile } from "firebase/auth";
import { addDoc, collection, query, setDoc, where, doc, getDocs, updateDoc, arrayUnion, getFirestore, getDoc} from "firebase/firestore";
import {storage, auth, db} from './firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { async } from '@firebase/util';

const Account = () => {


    const def = "https://i.stack.imgur.com/l60Hf.png"
    const{ user, logOut } = UserAuth();
    const[ userName, setUserName ] = useState('')
    const[ screen, setScreen ] = useState(false)
    const[ email, setEmail ] = useState('')
    const [error, setError] = useState('')
    const [img, setImg] = useState(null)
    const [imgURL, setImgURL] = useState(def)
    const [ frequency, setFrequency ] = useState('')
    const [ currID, setCurrID ] = useState('') 
    const [ fetch, setFetch ] = useState(false)
    const currUser = auth.currentUser
    const userRef = collection(db, 'users')
    const userQ = query(userRef, where('uid', '==', auth.currentUser.uid))
    
    // console.log(auth.currentUser.uid)

    const uplaodImg = () => {
        if(img == null){
            alert("You haven't select any picture yet")
            return
        }
        const imgRef = ref(storage, `images/${currUser.uid}`)
        uploadBytes(imgRef, img).then(()=>{
            alert("image uploaded")
        })
    }

    async function setProfileImage(){
        const imageRef = ref(storage, `images/${currUser.uid}`)
        const url = await getDownloadURL(imageRef)
        await updateProfile(auth.currentUser, {
            photoURL: url
        })
        setImgURL(url);
    }

    async function updateFreq(f){
        await updateDoc(doc(db, 'users', currID),{
            notifFreq: f
        })
        alert('Frequency updated')
    }

    async function getdata(){
        const date = getDocs(userQ).then((data)=>{
            setCurrID(data.docs[0].id)
            setFetch(true)
            // console.log(data.docs[0].id)
        })
    }

    useEffect(()=>{
        getdata()
    }, [])

    // console.log(currID)

    useEffect(()=>{
        setProfileImage()
    }, [currUser])

    const navigate = useNavigate()

    let newEmail = ''
    let newUsername = ''

    const handleNewUsername = (e)=>{
        newUsername = e.target.value
    }

    const handleNewEmail = (e)=>{
        newEmail = e.target.value
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

    const handleBack = async () => {
        console.log(user.uid)
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
    }


    const UpdateProfile = () =>{
            if(screen === true){
            return (
                <div className="h-full w-full bg-black/60 fixed top-0 left-0  flex justify-center items-center">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-cream">
                            Username
                        </label>         
                        <input onChange={e=>handleNewUsername(e)} className='border-2 rounded-md my-2' type="email" name="" id=""/>

                        <label htmlFor="email" className="block text-sm font-medium text-cream">
                            Email
                        </label>         
                        <input onChange={e=>handleNewEmail(e)} className='border-2 rounded-md my-2' type="email" name="" id=""/>
                        {/* <label htmlFor="email" className="block text-sm font-medium text-cream">
                            Upload Profile Picture
                        </label>         
                        <input onChange={(e) => {setImg(e.target.files[0])}} className='border-2 rounded-md my-2' type="file" name="" id=""/> */}


                        <button onClick={handleUpdateProfile} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-cream">
                            Update Profile
                        </button>
                        <button onClick={e=>setScreen(!screen)} type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm text-cream">
                            Close
                        </button>
                    </div>
                </div>
            )
            }
            setError('')
        }

        const handleUpdateProfile = async (e)=>{

                if(newEmail !== ""){
                    try {
                        const auth = getAuth()
                        updateEmail(auth.currentUser, newEmail).catch((e)=>{
                            console.log(e.message)}
                        )
                    } catch (e) {
                        console.log(e.message)
                    }
                }

                if(newUsername !== ""){
                    updateProfile(auth.currentUser, {
                        displayName: newUsername
                    }).then(() => {
                        alert("Profile updated!")
                    })
                }

                
            }

            if(!fetch){
                return(
                    <p>fetching data</p>
                )
            }

return (
    
    <div className='max-w-[600px] mx-auto my-16 p-4 border-2 border-green rounded-md bg-cream'>
        <UpdateProfile></UpdateProfile>
        <img className="mx-auto h-20 w-20 rounded-full lg:w-24 lg:h-24 border-teal" src={imgURL} alt={def}></img>
    
        <div>
            <label className="block text-xl font-medium text-gray-700">Name: {user && user.displayName}</label>
            <div className="mt-1">
            </div>
        </div>

        <div className='py-3'>
            <label className="block text-xl font-medium text-gray-700">Email: {user && user.email}</label>
            <div className="mt-1 flex flex-row">
            </div>
        </div>
        <div className='py-3'>
            <label className="block text-xl font-medium text-gray-700">Upload profile picture</label>
            <input type="file" onChange={(e)=>{setImg(e.target.files[0])}} />
        
        </div>
        <div className='flex flex-row'>
            <label className="block text-xl font-medium text-gray-700">Notification frequency</label>
            <select onChange={(e)=>setFrequency(e.target.value)} className='ml-2 rounded-md bg-khaki pl-1' name="" id="">
                <option className='pl-2' value="Yearly">Yearly</option>
                <option className='pl-2' value="Monthly">Monthly</option>
                <option className='pl-2' value="Weekly">Weekly</option>
                <option className='pl-2' value="Daily">Daily</option>
            </select>
        </div>
    
        
        <div className='space-x-4'>
            <button onClick={handleBack} type="button" className="bg-green border-teal items-center px-2 py-1 pr-2 text-cream rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-10">
                back
            </button>
            <button onClick={ e=>setScreen(!screen) } type="button" className="bg-green border-teal items-center px-2 py-1 pl-2 text-cream rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-10">
                Update profile
            </button>
            <button onClick={handleLogout}  type="button" className="bg-green border-teal items-center px-2 py-1 pr-2 text-cream rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-10">
                Logout
            </button>
            <button onClick={uplaodImg}  type="button" className="bg-green border-teal items-center px-2 py-1 pr-2 text-cream rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-10">
                Upload
            </button>
            <button onClick={()=>updateFreq(frequency)}  type="button" className="bg-green border-teal items-center px-2 py-1 pr-2 text-cream rounded-md  hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 my-10">
                Update
            </button>


        </div>
        </div>
)
}

export default Account
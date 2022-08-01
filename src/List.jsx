import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import {db, auth} from './firebase'
import nbell from './nbell.jpg'
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, onSnapshot, deleteDoc, addDoc} from "firebase/firestore";
import { useEffect } from 'react';
import { useState } from 'react';
import { async } from '@firebase/util'

const CardComponent = ({id, data})=>{
    const [ currCardID, setCurrCardID ] = useState('')
    const [ cards, setCards ] = useState([])
    const [ cardFetch, setCardFetch ] = useState(false)
    const [ screen, setScreen ] = useState(false)
    const cardRef = collection(db, 'cards')
    const cardQ = query(cardRef)
    

    useEffect(()=>{
        onSnapshot(collection(db, 'cards'), (snapshot)=>{
            const cardss = []
            snapshot.docs.forEach((doc)=>{
                
                cardss.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            setCards(cardss)
            setCardFetch(true)
        })
    }, [])

    // console.log("dari comp", cards)

    if(cardFetch === false){
        return(
            <p>fetching data</p>
        )
    }


    return(
        <>
            <div className='flex flex-col space-y-3 pt-5'>
                {
                    cards.map((value)=>{
                        return(
                            <div>
                                {(value.listID === id) && (
                                    <Link to = {`/cardDetail/${value.title}/${value.id}`}>
                                        <button className='bg-teal w-full text-left pl-3 pr-3 rounded-md text-cream pt-1 pb-1'>{value.title}</button>
                                    </Link>
                                )}
                            </div>
                        )
                        // return value.listID
                    }) 
                    // == id ? console.log("sama") : console.log("engga")
                }

            </div>
        </>
    )
}


const List = () => {

    const navigate = useNavigate()
    const { boardid } = useParams()
    const { user, logOut } = UserAuth();
    const [ list, setList ] = useState([])
    const [ fetch, setFetch ] = useState(false)
    const listRef = collection(db, 'list')
    const [ cards, setCards ] = useState([])
    const [ found, setFound ] = useState(false)
    const [ cardFetch, setCardFetch ] = useState(false)
    const cardRef = collection(db, 'cards')
    const [ search, setSearch ] = useState('')
    const cardQ = query(cardRef)
    const [ listID, setListID ] = useState('')
    const [ screen, setScreen ] = useState(false)
    const [ cardName, setCardName ] = useState('')
    const [ lMark, setLMark ] = useState('')
    const listQ = query(listRef, where('boardID', '==', boardid))

    useEffect(()=>{
        const cardss = []
        onSnapshot(cardQ, (snapshot)=>{
            snapshot.docs.forEach((doc)=>{
                cardss.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            setCards(cardss)
            setCardFetch(true)
        })
    }, [])

    useEffect(()=>{
        onSnapshot(listQ, (snapShot)=>{
            const lists = []
            snapShot.docs.forEach((doc)=>{
                lists.push({
                    ...doc.data(),
                    id: doc.id
                })
                // console.log(doc.id)
            })
            setList(lists)
            setFetch(true)
            // console.log(snapShot)
        })
    }, [])
    // console.log('dari main',cards)

    const handleBack = async () => {
        // console.log("backk")
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
    }

    // function searchCard(arr, s){
    //     arr.forEach((item)=>{
    //         if(item.toLowerCase().includes(s.toLowerCase())){
    //             return setFound(true)
    //         }else{
    //             setFound(false)
    //         }
    //     })
        
        // return setFound(false)
        // arr.map((val)=>{
        //     return val.toLowerCase()
        // }).includes(s.toLowerCase()) ?
        // setFound(true) : setFound

        // console.log(found)
        // arr.forEach((item)=>{
        //     if(item.toLowerCase.includes(s.toLowerCase)){
        //         return true
        //     }
        // })
        // return false
    // }

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

    async function delList(id){
        await deleteDoc(doc(db, 'list', id))
        console.log(id)
        navigate(`/Home/${user.uid}`)
    }

    async function addCard(id, cardName){
        await addDoc(collection(db, 'cards'), {
            listID: id,
            boardID: boardid,
            title: cardName,
            mark: 'On Progress',
            watcher: arrayUnion(user.uid),
            dueDate: ''
        })
        await updateDoc(doc(db, 'list', id), {
            cardList: arrayUnion(cardName)
        })
        alert("Successfuly added a new card")
        console.log(cardName)
    }

    if(fetch === false){
        return(
            <p>fetching data</p>
        )
    }

    if(cardFetch === false){
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
            <a className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md ">
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
                <input onChange={(e)=>setSearch(e.target.value)} id="search_field" className=" w-full h-full pl-8 pr-3 py-2 border-transparent bg-cream placeholder-black text-black focus:outline-none focus:placeholder-black focus:ring-0 focus:border-transparent sm:text-sm" placeholder="Search" type="search" name="search"></input>
                </div>
            </form>
            </div>
            <div className="flex items-center md:ml-2 gap-2">
                {/* <p>dkaad</p> */}
                <select onChange={(e)=>setLMark(e.target.value)} className='bg-khaki rounded-md  h-8 px-1  text-xl' name="" id="">
                    <option value="On Progress">On Progress</option>
                    <option value="Overdue">Overdue</option>
                    <option value="Completed">Completed</option>
                </select>
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
                <h1 className="text-3xl font-semibold text-gray-900 pb-2">List</h1>
            <div className='flex space-x-4'>
                {
                    // const [ cards, setCards ]= useState([])
                    // console.log()
                    // <>
                    //     <div>
                            
                    //     </div>
                    // </>
                    list.map((data)=>{
                        let title = data.title
                        let arr = data.cardList
                        let mark = data.mark
                        // console.log(title)
                        // searchCard(arr, search)
                        // console.log(found)
                        if(title.toLowerCase().includes(search.toLowerCase()) || mark.toLowerCase.includes(lMark.toLowerCase)){
                            return(
                                <div className='flex flex-col space-x-4'>
                                    <div className='bg-green h-auto px-4 w-80 text-xl rounded-md text-cream'>
                                        <button className='pt-1' disabled>{data.title}</button>
                                        <CardComponent className = 'bg-red w-96' id = {data.id}></CardComponent>
                                        <div className=' flex pb-4 pt-6 space-x-3 justify-end bottom-0'>
                                            <input onChange={(e)=>{setCardName(e.target.value)}} type="text" className='bg-teal h-5 mt-1 text-sm' />
                                            <button onClick={()=>addCard(data.id, cardName)}>+</button>
                                            <button onClick={()=>delList(data.id)}>x</button>
                                        </div>
                                    </div>
                                </div>
                            )
                        }
                        // setFound(false)
                    })
                }

            </div>
        </main>
    <button onClick={handleBack}>back</button>
    </div>
    </div>
    )
}

export default List
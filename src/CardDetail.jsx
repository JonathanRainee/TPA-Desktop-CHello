import React from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { UserAuth } from './context/authContext'
import {db, auth, storage} from './firebase'
import nbell from './nbell.jpg'
import { useDropzone } from "react-dropzone"
import { doc, getDoc, updateDoc, arrayUnion, collection, query, where, getDocs, onSnapshot, deleteDoc, addDoc, arrayRemove} from "firebase/firestore";
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes } from "firebase/storage";
import { useEffect } from 'react';
import { useState } from 'react';
import { async } from '@firebase/util'
import { useQuill } from 'react-quilljs';
// import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.snow.css'
import CircularProgressBar from './bar'
import {GoogleMap, Marker, useLoadScript} from "@react-google-maps/api"
// import {AiOutlineDownload} from 'react-icons/fa'



const WatcherComponent = (boardID) => {
    const { name, id } = useParams()
    const{ user, logOut } = UserAuth();
    const [ card, setCard ] = useState({})
    const [ getCard, setGetCard ] = useState(false)
    const [ board, setBoard ] = useState({})
    const [ fetchBoard, setFetchBoard ] = useState(false)
    let aidi = boardID
    // console.log(boardID)
    // const ref = collection(db, 'users')
    // const cardRef = doc(db, 'cards', id)
    // const boardRef = doc(db, 'board', boardID)

    // console.log(boardRef)

        // useEffect(()=>{
        //     try {
        //         const currBoard = getDoc(boardRef).then((data)=>{
        //             setBoard(data.data())
        //             setFetchBoard(true)
        //         })
        //     } catch (error) {
        //         console.log(error)
        //     }
        // }, [])

        // console.log(board)
        // if(!fetchBoard){
        //     return(
        //         <p>fetching data</p>
        //     )
        // }
    // console.log(boardID)
    // if(!getCard){
    //     if(!fetchBoard){
    //         return(
    //             <p>fetching data</p>
    //         )
    //     }
    // }
    // const q = query(ref, where('uid', '==', memberUID))
}

const LabelComponent = ()=>{
    const { name, id } = useParams()
    const [ labelsC, setLabelsC ] = useState([])
    const [ labelFetch, setLabelFetch ] = useState(false)
    const [ updName, setUpdName ] = useState('')
    const labelRef = collection(db, 'cards', id, 'labels')

    useEffect(()=>{
        onSnapshot(labelRef, (snapshot)=>{
            const labels = []
            snapshot.docs.forEach((doc)=>{
                labels.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            setLabelsC(labels)
            setLabelFetch(true)
        })
    }, [])
    
    // const delLabel = async (labelID) => {
    //     await deleteDoc(doc(db, 'cards', id, 'labels', labelID))
    //     alert('The label successfuly deleted')
    // }

    async function delLabel(labelID){
        await deleteDoc(doc(db, 'cards', id, 'labels', labelID))
        alert('The label successfuly deleted')
    }

    async function updLabel(labelID){
        await updateDoc(doc(db, 'cards', id, 'labels', labelID), {
            labelName: updName
        })
        alert('Label has been updated')
    }

    async function addLabel(value){
        await addDoc(collection(db, 'cards', id, 'attachedLabel'), {
            labelName: value.labelName,
            labelColow: value.labelColow
        })
    } 


    return(
        <>
            <div className='flex flex-row pt-2 gap-x-2'>
                {
                    labelsC.map((value)=>{
                        return(
                            <div className='gap-x-4'>
                                <div className={`bg-${value.labelColow} rounded-md gap-x-2`}>
                                    
                                    <button onClick={()=>addLabel(value)} className='pl-3'><input onChange={(e) => setUpdName(e.target.value)} className={`bg-${value.labelColow} w-24 text-black placeholder-black pl-1 pt-1 pb-1 outline-0`} placeholder={value.labelName}></input></button>
                                    <button onClick={()=>{updLabel(value.id)}} className='pl-1 pr-2'><>&#x2713;</></button>
                                    <button onClick={()=>{delLabel(value.id)}} className='pl-1 pr-3'>X</button>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const AttachedLabelComponent = () => {
    const { name, id } = useParams()
    const [ labelsC, setLabelsC ] = useState([])
    const [ labelFetch, setLabelFetch ] = useState(false)
    const [ updName, setUpdName ] = useState('')
    const attLabelRef = collection(db, 'cards', id, 'attachedLabel')

    useEffect(()=>{
        onSnapshot(attLabelRef, (snapshot)=>{
            const labels = []
            snapshot.docs.forEach((doc)=>{
                labels.push({
                    ...doc.data(),
                    id: doc.id
                })
            })
            setLabelsC(labels)
            setLabelFetch(true)
        })
    }, [])

    async function detachLbl(labelID){
        await deleteDoc(doc(db, 'cards', id, 'attachedLabel', labelID))
    }

    return(
        <>
            <div className='flex flex-row pt-2 gap-x-2'>
                {
                    labelsC.map((value)=>{
                        return(
                            <div className='gap-x-4'>
                                <div className={`bg-${value.labelColow} rounded-md gap-x-2`}>
                                    <button className='pl-3'>{value.labelName}</button>
                                    <button onClick={()=>{detachLbl(value.id)}} className='pl-1 pr-3'>X</button>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const LocationComponent = () => {
    const navigate = useNavigate()
    const { name, id } = useParams()
    const [locs, setLocs ] = useState([])
    const [locFetch, setLocFetch ] = useState(false)
    const locRef = collection(db, 'cards', id, 'location')
    const [ long, setLong ] = useState('')
    const [ lat, setLat ] = useState('')
    const [ locName, setLocName ] = useState('')

    useEffect(()=>{
        onSnapshot(locRef, (snapshot)=>{
            const location = []
            snapshot.docs.forEach((doc)=>{
                location.push({
                    ...doc.data(),
                    id:doc.id
                })
                // console.log(doc.data())
            })
            setLocs(location)
            setLocFetch(true)
        })
    }, [])

    async function delLoc(locID){
        await deleteDoc(doc(db, 'cards', id, 'location', locID))
        // alert('The label successfuly deleted')
    }

    async function updLoc(locID){
        await updateDoc(doc(db, 'cards', id, 'location', locID), {
            name: locName,
            longitude: long,
            latitude: lat
        })
        // alert('Label has been updated')
    }

    async function goMap(id, locID){
        navigate(`/loc/${id}/${locID}`)
        // await deleteDoc(doc(db, 'cards', id))
    }

    return(
        <>
            <div className='flex flex-col pt-2  gap-x-2'>
                {
                    locs.map((val)=>{
                        return(
                            <div className='gap-x-4 pb-2'>
                                <div className='flex bg-khaki w-80 h-10 rounded-md  content-center'>
                                        <input onChange={(e)=>setLocName(e.target.value)} type="text" className='bg-transparent w-20 pl-1' placeholder={val.name} />
                                        <input onChange={(e)=>setLong(e.target.value)} className='bg-khaki border-b-2 outline-0 no-underline border-none ml-1 w-20' type="text" step=".00001" name="" id="" placeholder={val.longitude} />
                                        <input onChange={(e)=>setLat(e.target.value)} className='bg-khaki border-b-2 outline-0 no-underline border-none ml-1 w-20' type="text" step=".00001" name="" id="" placeholder={val.latitude} />
                                        <button onClick={()=>{updLoc(val.id)}} className='pl-1 pr-2'><>&#x2713;</></button>
                                        <button onClick={()=>{delLoc(val.id)}} className='pl-1 pr-2'>X</button>
                                        <button onClick={()=>{goMap(id, val.id)}} className=''><>&#x2197;</></button>
                                        {/* <button onClick={()=>window.open(`https://maps.google.com/?q=${val.latitude},${val.longitude}`)} className=''><>&#x2197;</></button> */}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )

}

const CheckListComponent = () => {
    const { name, id } = useParams()
    const [ checklist, setSchecklist ] = useState([])
    const [ checklistFetch, setChecklistFetch ] = useState(false)
    const [ item, setItem ] = useState('')
    const cardRef = collection(db, 'cards', id, 'checklist')

    useEffect(()=>{
        onSnapshot(cardRef, (snapshot)=>{
            // console.log(snapshot.docs[0]._document.data)
            const cardChecklist = []
            snapshot.docs.forEach((c)=>{
                // console.log(c)
                cardChecklist.push({
                    ...c.data(),
                    id:c.id
                })
            })
            setSchecklist(cardChecklist)
            setChecklistFetch(true)
        })
    }, [])

    // console.log(checklist)

    async function delChecklist(c){
        await deleteDoc(doc(db, 'cards', id, 'checklist', c))
    }

    async function delItem(item, clID){
        await updateDoc(doc(db, 'cards', id, 'checklist', clID),{
            item: arrayRemove(item)
        })
    }

    async function addItem(item, clID){
        await updateDoc(doc(db, 'cards', id, 'checklist', clID), {
            item: arrayUnion(item)
        })
    }

    if(!checklistFetch){
        return(
            <p>fetching data</p>
        )
    }
    // console.log(checklist[0].item)
    return(
        <>
            <div>
                {
                    checklist.map((val)=>{
                        // console.log(val.item)
                        return(
                            <div className='flex flex-col'>
                                <div className='flex flex-row bg-khaki w-96 justify-between mt-3 rounded-t-lg'>
                                    <div>
                                        <span className='pl-2' >{val.checkListName}</span>
                                        <input onChange={(e)=>{setItem(e.target.value)}} className='bg-khaki border-b-2 outline-0 ml-2 mb-1 ' type="text" name="" id="" placeholder='' />
                                    </div>
                                    <div>
                                        <button onClick={()=>delChecklist(val.id)} className='mr-2'>X</button>
                                        <button onClick={()=>addItem(item, val.id)} className='mr-2'>+</button>
                                    </div>
                                </div>
                                <div className='bg-khaki w-96 justify-between rounded-b-lg'>
                                    {
                                        val.item.map((item)=>{
                                        //     console.log(item)
                                            return(
                                                <div className='flex flex-row justify-between'>
                                                    <div>
                                                        <input className='bg-khaki border-b-2 outline-0 ml-2 mb-1' type="checkbox" label={item} name="" id="" placeholder={val} />
                                                        <label className='ml-1'>{item}</label>
                                                    </div>
                                                    <div>
                                                        <button onClick={()=>delItem(item, val.id)} className='pr-2'>X</button>
                                                    </div>
                                                </div>
                                                
                                                // <div>
                                                //     <input/>
                                                //     <span>{val}</span>
                                                // <div/>
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const CommentComponent = () => {
    const { name, id } = useParams()
    const [ comments, setComments ] = useState([])
    const [ commentFetch, setCommentFetch ] = useState(false)
    const cardRef = doc(db, 'cards', id)

    useEffect(()=>{
        onSnapshot(cardRef, (snapshot)=>{
            const currComments = []
            // console.log(snapshot.data())
            snapshot.data().comments.forEach((c)=>{
                currComments.push(c)
                // console.log(c)
            })
            setComments(currComments)
            setCommentFetch(true)
        })
    }, [])

    async function delComment(c){
        await updateDoc(cardRef, {
            comments: arrayRemove(c)
        })
    }

    return(
        <>
        <div className=''>
            {/* <div  className='flex flex-col pt-2 gap-x-2'> */}
                {
                    comments.map((val)=>{
                        return(
                            <div className=''>
                                <div className=' flex flex-row bg-khaki text-grey rounded-md w-1/5 h-10 mt-4 pl-2 justify-between'>
                                    <div className='mt-2'>
                                        <h2>{val}</h2>
                                    </div>
                                    <div className='mr-3 mt-2' >
                                        <button onClick={()=>delComment(val)} className=''>X</button>
                                        
                                    </div>
                                </div>
                                    {/* <div className='justify-end flex bg-yellow'>
                                    </div> */}
                            </div>
                        )
                    })
                }
            {/* </div> */}
            </div>
        </>
    )
}

const LinkComponent = () => {
    const { name, id } = useParams()
    const [ links, setLinks ] = useState('')
    const [ linkFetch, setLinkFetch ] = useState(false)
    const cardRef = doc(db, 'cards', id)

    useEffect(()=> {
        onSnapshot(cardRef, (snapshot)=> {
            const currLink = []
            snapshot.data().attachLink.forEach((l)=>{
                // console.log(l)
                currLink.push(l)
            })
            setLinks(currLink)
            setLinkFetch(true)
        })
    }, [])
    // console.log(links)
    async function delLink(c){
        await updateDoc(cardRef, {
            attachLink: arrayRemove(c)
        })
    }

    if(!linkFetch){
        return(
            <p>No link</p>
        )
    }

    return(
        <>
            <div>
                {
                    links.map((val)=>{
                        // console.log(val)
                        return(
                                // <button onClick={()=>window.open(val)}>{val}</button>
                            <div className=' flex flex-row bg-khaki text-grey rounded-md w-2/5 h-10 mt-4 pl-2 justify-between'>
                                <button onClick={()=>window.open(val)}>{val}</button>
                                <button onClick={()=>delLink(val)} className='pr-2'>X</button>
                            </div>
                        )
                    })
                }
            </div>
        </>
    )
}

const CardDetail = () => {

    const navigate = useNavigate()
    const { name, id } = useParams()
    const { user, logOut } = UserAuth();
    const [ desc, setDesc ] = useState('')
    const [ fetch, setFetch ] = useState(false)
    const [ long, setLong ] = useState('')
    const [ lat, setLat ] = useState('')
    const [ locName, setLocName ] = useState('')
    const cardRef = collection(db, 'cards')
    const [ cardData, setCardData ] = useState({})
    const [ aLink, setALink ] = useState('')
    const [ cardFetch, setCardFetch ] = useState(false)
    const [ dueDate, setDueDate ] = useState('')
    const [ comment, setComment ] = useState('')
    const [ labelName, setLabelName ] = useState('')
    const [ cardClr, setCardClr ] = useState('')
    const [ reminder, setReminder ] = useState('')
    const [ mark, setMark ] = useState('')
    const [ attachments, setAttachments] = useState([])
    const [ file, setFile ] = useState(false)
    const [ cList, setCList ] = useState({})
    const [ fetchList, setFetchList ] = useState(false)
    const link = `http://localhost:3000/cardDetail/${name}/${id}`
    const { acceptedFiles, getRootProps, getInputProps } = useDropzone()
    const listoRef = collection(db, 'list')
    
    const modules = {
        toolbar: [["bold", "italic", "underline", "strike"]]
    }

    async function saveCard(){
        acceptedFiles.map(async (e)=>{
            const uploadRef = ref(storage, `card/${id}/${e.path}`)
            await uploadBytes(uploadRef, e)
        })
        alert("File uploaded")
    }

    // console.log(cardData.data())
    // console.log(cList)

    function getAttachments(){
        // console.log("refff")
        const listRef = ref(storage, `card/${id}`)
        // console.log("testt")
        console.log(listRef)
        listAll(listRef).then((res) => {
            let arr = []
            res.items.forEach(async (itemRef) => {
                const cardRef = ref(storage, `card/${id}/${itemRef.name}`)
                const url = await getDownloadURL(cardRef)
                const data = {
                    itemRef: itemRef,
                    url: url,
                }
                arr.push(data)
                setAttachments(arr)
                setFile(true)
            });
            console.log(res)
        }).catch((error) => {
            // Uh-oh, an error occurred!
        });
    }

    // console.log(attachments)

    async function detachFile(fileName){
        const fileRef = ref(storage, `card/${id}/${fileName}`)
        try{
            await deleteObject(fileRef)
        }catch(error){
            alert(error)
        }
    }

    const { quill, quillRef } = useQuill({modules});

    useEffect(()=>{
        onSnapshot(doc(db, 'cards', id), snapshot=>{
            // const desc = []
            setCardData(snapshot.data())
            setCardFetch(true)
        })
    }, [])

    // console.log(cardData.listID)

    // function getName(id){
    //     let q = query(listoRef, where('boardID', '==', id))
    //     getDocs(q).then((data)=>{
    //         console.log("sini")
    //         setCList(data)
            // console.log(data)
            // data.forEach((doc)=>{
            //     console.log(doc.data())
            //     console.log("sfjjf")
            // })
    //     })
    // }

    // useEffect(()=>{
    //     console.log(cardData.listID)
    //     let q = query(listoRef, where('boardID', '==', cardData.listID))
    //     // onSnapshot(query, (s)=>{
    //     //     const tempList = []
    //     //     s.docs.forEach((doc)=>{
    //     //         // tempList.push({
    //     //         //     ...doc.data(),
    //     //         //     id: doc.id
    //     //         // })
    //     //         console.log(doc)
    //     //     })
    //     //     setCList(tempList)
    //     //     setFetchList(true)
    //     // })
    //     getDocs(q).then((data)=>{
    //         console.log(data)
    //     })
    // }, [])

    console.log(cList)

    const createLabel = async () => {
        await addDoc(collection(db, "cards", id, "labels"), {
            labelName: labelName,
            labelColow: cardClr
        })
        alert("New label has been added")
    }

    async function upReminder(r){
        await updateDoc(doc(db, 'cards', id), {
            reminder: r
        })
        alert('reminder updated')
    }

    async function createComment(comment){
        await updateDoc(doc(db, 'cards', id), {
            comments: arrayUnion(comment)
        })
    }

    async function createChecklist(checklist){
        await addDoc(collection(db, 'cards', id, 'checklist'), {
            checkListName: checklist,
            item:[]
        })
    }

    async function createLoc(name, long, lat){
        await addDoc(collection(db, 'cards', id, 'location'), {
            name: name,
            longitude: long,
            latitude: lat
        })
    }

    async function addMark(mark){
        await updateDoc(doc(db, 'cards', id), {
            mark: mark
        })
    }

    async function cardDel(id){
        navigate(`/Home/${user.uid}`)
        await deleteDoc(doc(db, 'cards', id))
    }
    // console.log(attachments)
    // const delCard = async () => {
    //     await deleteDoc(doc(db, 'cards', id))
    //     navigate(`/Home/${user.uid}`)
    //     alert("Card successfuly deleted")
    // }

    useEffect(()=>{
        getAttachments()
        // getName(cardData.listID)
    }, [])

    useEffect(() => {
        if(quill){
            quill.clipboard.dangerouslyPasteHTML(
                cardData.desc
            )
        }
    }, [])

    // useEffect(()=>{
    // }, [])
    // if(quill){
    //     console.log('ada quil')
    // }else{
    //     console.log('gad qui;')
    // }

    // console.log(cardData)
    // console.log(quillRef)

    const addDesc = async () => {
        await updateDoc(doc(db, 'cards', id), {
            desc: desc
        })
        alert("Added a new description")
    } 

    const updDesc = async () => {
        await updateDoc(doc(db, 'cards', id), {
            desc: desc
        })
        alert("Description Updated")
    }

    const updDueDate = async () => {
        // console.log(dueDate)
        await updateDoc(doc(db, 'cards', id), {
            dueDate: dueDate
        })
    }

    const attachLink = async () => {
        await updateDoc(doc(db, 'cards', id), {
            attachLink: arrayUnion(aLink)
        })
    }

    const delDesc = async () => {
        await updateDoc(doc(db, 'cards', id), {
            desc: ""
        })
        alert("Description Deleted")
    }

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
            // console.log('logged out')
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

    const handleCopy = e => {
        e.preventDefault();
        navigator.clipboard.writeText(link)
        alert("link coppied to clipboard")
    }

    if(!file){
        return(
            <p>fetching data</p>
        )
    }

    // if(!fetchList){
    //     return(
    //         <p>fetching data</p>
    //     )
    // }

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


            <a className="bg-green text-cream text-2xl hover:bg-teal hover:text-white group flex items-center px-2 py-2 text-sm font-medium rounded-md">
                Boards
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
                    <div className='flex flex-row'>
                        <h1 className="text-3xl font-semibold text-gray-900 pl-4 ">{name}</h1>
                        <h2 className="text-xl font-semibold text-gray-900 pl-3 pt-2 ">{cardData.mark}</h2>
                    </div>
                    <button onClick={()=>cardDel(id)} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-10 mt-2 justify-self-center">Delete</button>
                    {/* <div className='bg-red w-10 h-10' ref={quill}>

                    </div> */}
                    <div className='flex flex-row mt-2'>
                        <h2 className="text-2xl font-semibold text-gray-900">Description</h2>
                        <input onChange={(e) => setDesc(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 ' type="text" name="" id="" placeholder={cardData.desc} />
                        <button onClick={addDesc} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                        <button onClick={updDesc} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Update</button>
                        <button onClick={delDesc} className="bg-crimson hover:bg-red text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Delete</button>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <h2 className="text-2xl font-semibold text-gray-900">Label</h2>
                        <input onChange={(e)=>setLabelName(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 ' type="text" name="" id="" placeholder='' />
                        <select onChange={(e) => setCardClr(e.target.value)} className='bg-cream ml-2 mt-2' name="" id="">
                            <option value="red">red</option>
                            <option value="green">green</option>
                            <option value="white">white</option>
                            <option value="yellow">yellow</option>
                        </select>
                        <button onClick={createLabel} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                    </div>
                    <div >
                        <LabelComponent ></LabelComponent>
                    </div>
                    <div className='flex flex-row mt-2'>
                        <h2 className="text-2xl font-semibold text-gray-900">Attached Label</h2>
                    </div>
                    <div>
                        <AttachedLabelComponent></AttachedLabelComponent>
                    </div>
                    <div className=''>
                        <input className='bg-khaki text-grey rounded-md w-2/5 h-10 mt-4 justify-self-center pl-2' type="text" disabled placeholder='Your link' value={link}/>
                        <button onClick={handleCopy} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-10 mt-4 justify-self-center ml-2">Copy</button>
                    </div>
                    <div className='pt-2 flex flex-row'>
                        <h2 className="text-2xl font-semibold text-gray-900">Comment</h2>
                        <input onChange={(e)=>setComment(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 ' type="text" name="" id="" placeholder='' />
                        <button onClick={()=>createComment(comment)} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                    </div>
                    <div>
                        <CommentComponent></CommentComponent>
                    </div>
                    <div className='pt-2 flex flex-row'>
                        <h2 className="text-2xl font-semibold text-gray-900">Checklist</h2>
                        <input onChange={(e)=>setComment(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 ' type="text" name="" id="" placeholder='' />
                        <button onClick={()=>createChecklist(comment)} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                    </div>
                    <div className='pl-1'>
                        <CheckListComponent></CheckListComponent>
                        {/* <input type="checkbox" placeholder='wow' className='pt-1' value={"tset"}/>
                        <span className='pl-1 mb-1'>wow</span> */}
                    </div>
                    <div  className='pt-2 flex flex-row'>
                        <h2 className="text-2xl font-semibold text-gray-900">Location</h2>
                        <input onChange={(e)=>setLocName(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 w-24' type="text"  name="" id="" placeholder='Name' />
                        <input onChange={(e)=>setLong(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 w-24' type="text" step=".00001" name="" id="" placeholder='Longitude' />
                        <input onChange={(e)=>setLat(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 w-24' type="text" step=".00001" name="" id="" placeholder='latitude' />
                        <button onClick={()=>createLoc(locName, long, lat)} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                    </div>
                    <div>
                        <LocationComponent></LocationComponent>
                    </div>
                    <div>
                        <h2 className="text-2xl font-semibold text-gray-900">Due Date</h2>
                        <input onChange={(e)=>setDueDate(e.target.value)} className='bg-khaki pl-2 pr-2' type="date" />
                        <button onClick={updDueDate} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                        <select onChange={(e)=>setReminder(e.target.value)} className='ml-2 pl-1 pr-1 bg-khaki rounded-md' name="" id="">
                            <option value='7 days before' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >7 days before</option>
                            <option value='3 days before' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >3 days before</option>
                            <option value='1 days before' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >1 days before</option>
                        </select>
                        <button onClick={()=>upReminder(reminder)} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Set</button>
                    </div>
                    <div className='pt-2 flex flex-row'>
                        <h2 className="text-2xl font-semibold text-gray-900">Attachment Link</h2>
                        <input onChange={(e)=>setALink(e.target.value)} className='bg-cream border-b-2 outline-0 ml-2 w-64' type="text"  name="" id="" placeholder='Link' />
                        <button onClick={attachLink} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-6 ml-2 mt-2 justify-self-center">Add</button>
                    </div>
                    <div>
                        <LinkComponent></LinkComponent>
                    </div>
                    <div className='pt-3 flex flex-row'>
                        <h2 className="text-2xl font-semibold text-gray-900">Card Mark</h2>
                        <select onChange={(e)=>setMark(e.target.value)} className='ml-2 pl-1 pr-1 h-8 bg-khaki rounded-md' name="" id="">
                            <option value='Completed' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >Completed</option>
                            <option value='Overdue' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >Overdue</option>
                            <option value='On Progress' className='ml-2 pl-1 pr-1 bg-khaki rounded-md' >On Progress</option>
                        </select>
                        <button onClick={()=>addMark(mark)} className="bg-green hover:bg-teal text-cream rounded-md w-20 h-8 ml-2  justify-self-center">Set</button>
                    </div>
                    <div className='pt-3 flex flex-col'>
                        <h2 className="text-2xl font-semibold text-gray-900">Attachment</h2>
                        {/* <WatcherComponent boardID={cardData.boardID}/> */}
                    </div>
                    <div className='pt-3 flex flex-col'>
                        {
                            attachments.map((file)=>{
                                // console.log(file)   
                                return(
                                    <div className='bg-khaki rounded-md mb-2 w-56 flex flex-row justify-between'>
                                        <p className='text-black pl-2 pt-1 pb-1 w-32'>{file.itemRef.name}</p>
                                        <button className='pl-2 text-teal'>Download</button>
                                        <button onClick={()=>detachFile(file.itemRef.name)} className='pl-2 pr-2 text-red'>Detach</button>
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="pt-3 sm:mt-0 sm:col-span-2">
                        <div className="max-w-lg flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <div {...getRootProps()}>
                                    <input {...getInputProps()} />
                                    <p>Drag and drop files here, or click to select files</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <button onClick={saveCard}>update</button>
                    </div>

                    {/* <DescComp></DescComp> */}
                </div>
            </div>
        </main>
    <button onClick={handleBack}>back</button>
    </div>
    </div>
    )
}

export default CardDetail
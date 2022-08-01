    import "react-big-calendar/lib/css/react-big-calendar.css"
    import { Calendar, globalizeLocalizer } from 'react-big-calendar'
    import globalize from 'globalize'
    import { Link, useParams, useNavigate } from "react-router-dom"
    import { useEffect, useState } from "react"
    import { UserAuth } from './context/authContext'
    import { collection, doc, getDocs, query, where } from "firebase/firestore"
    import {db, auth} from './firebase'

    const localizer = globalizeLocalizer(globalize)

    export default function CalendarV() {
    
    const {workspaceID} = useParams()
    const {boardID} = useParams()
    const{ user, logOut } = UserAuth();
    const [ myEventsList, setMyeventList ] = useState([])
    const navigate = useNavigate()

    async function getEventList(){
        console.log(boardID)
        console.log("budiii")
        // let arr = []
        // const q = query(collection(db, "cards"), where("boardID", "==", boardID));
        // const querySnapshot = await getDocs(q);
        // querySnapshot.forEach((doc) => {
        // arr.push(doc.id)
        // });
        const cardRef = collection(db, "cards")
        let eventData = []
        const stringQuery = query(cardRef, where("boardID", "==", boardID))
        const snapshot = await getDocs(stringQuery)
        snapshot.forEach((d)=>{
            const data = {
                title: d.data().title,
                start: d.data().dueDate,
                end: d.data().dueDate   
            }

            console.log("test", data.title, data.start)
            eventData.push(data)
        })
        setMyeventList(eventData)
    }

    useEffect(() => {
        getEventList()
    }, [])

    const handleBack = async () => {
        // console.log("backk")
        try {
            navigate(`/Home/${user.uid}`)
        } catch (error) {
            
        }
    }
    
    return(
        <div className="grid h-screen place-items-center bg-cream">
            <div className="">
                <h1 className="text-4xl text-black m-4 border-b-2">CHello</h1>
                <button className="justify-center" onClick={handleBack}>Back</button>
                <nav className=" flex-1 px-2 space-y-1" aria-label="Sidebar">
                </nav>
            </div>
            <Calendar className="w-3/4 bg-khaki border-2"
                localizer={localizer}
                events={myEventsList}
                startAccessor="start"
                endAccessor="end"
                style={{ height: 500, margin: "20px" }}
            />
        </div>
    )
    }
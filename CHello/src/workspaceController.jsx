import React from 'react'
import {db} from './firebase'
import { collection, where, orderBy, query, onSnapshot, addDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'

const workspaceRef = collection(db, "workspaces")
const workspaceContext = createContext() 

// export const getWS = ({children})=>{
//     const[ workspaces, setWorkspaces] = useState([]);

// }

export const WorkspaceController = ({children}) => {
    const [ workspaces, setWorkspaces] = useState([]);
    const [ load, setLoad] = useState("");

    useEffect(()=>{
        let q = query(workspaceRef, orderBy('title', 'asc'));
        const ws = [];
        onSnapshot(q, (snapShot)=>{
            snapShot.docs.forEach((doc)=>{
                ws.push({

                    ...doc.data(),
                    id: doc.id
                });
                
            })
            setWorkspaces(ws)
            setLoad(false)
        })
    }, [])

    console.log(workspaces)
    
    if(load === false){
        return(
            <workspaceContext.Provider value={{workspaces}}>
                {children}
            </workspaceContext.Provider>
        )
    }else{
        return(
            <div>fetching data</div>
        )
    }

   
}

export const GetWSContext = () =>useContext(workspaceContext)
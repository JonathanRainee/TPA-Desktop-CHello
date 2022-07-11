import React from 'react'
import {db} from './firebase'
import { collection, where, orderBy, query, onSnapshot, addDoc } from 'firebase/firestore'
import { createContext, useContext, useEffect, useState } from 'react'
import { Workspace } from './Workspace'

const workspaceRef = collection(db, "workspaces")
const workspaceContext = createContext() 
    
export const WorkspaceController = (props) => {
    // const [ workspaces, setWorkspacess] = useState([]);'
    
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
            props.setWorkspaces(ws)
            setLoad(false)
            // console.log(props.workspaces)
        })
    }, [])

    
    if(load === false){
        return(
            <workspaceContext.Provider value={props.workspaces}>
                {/* nanti kalau mau dipindahin ke sini */}
            </workspaceContext.Provider>
        )
    }else{
        return(
            <div>fetching data</div>
        )
    }
}

export const GetWSContext = () =>useContext(workspaceContext)
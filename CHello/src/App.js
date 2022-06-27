import React from "react";
import { Routes, Route , BrowserRouter} from "react-router-dom"
import SignIn from "./login"
import SignUp from "./signup"
import MainPage from "./mainpage"
import {AuthContextProvider} from "./context/authContext"
import ProtectedRoute from "./ProtectedRoute"
import { WorkspaceController } from './workspaceController'

function App() {
  return (
        <div>
            
            <AuthContextProvider>
                <WorkspaceController>
                    <Routes>
                        <Route path = '/' element = {<SignIn />}/>
                        <Route path = '/signup' element = {<SignUp />}/>
                        <Route path = '/Home/:id' element = {<ProtectedRoute><MainPage /></ProtectedRoute>}/>
                    </Routes>
                </WorkspaceController>
            </AuthContextProvider>
        </div>

    
  );
}

export default App;
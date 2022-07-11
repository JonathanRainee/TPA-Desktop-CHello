import logo from './logo.svg';
import React from "react";
import { Routes, Route , BrowserRouter as Router} from "react-router-dom"
import SignIn from "./login"
import SignUp from "./signup"
import MainPage from "./mainpage"
import Account from "./Account"
import Workspace from './Workspace';
import WorkspaceDetail from './WorkspaceDetail';
import Board from './Board'
import {AuthContextProvider} from "./context/authContext"
import ProtectedRoute from "./ProtectedRoute"
// import './App.css';

function App() {
  return (
    <div>
      <AuthContextProvider>
            <Router>
              <Routes>
                  <Route path = '/' element = {<SignIn />}/>
                  <Route path = '/signup' element = {<SignUp />}/>
                  <Route path = '/Home/:id' element = {<ProtectedRoute><MainPage /></ProtectedRoute>}/>
                  <Route path = '/Account/:id' element = {<ProtectedRoute><Account /></ProtectedRoute>}/>
                  <Route path = '/workspaces' element = {<ProtectedRoute><Workspace /></ProtectedRoute>}></Route>
                  <Route path = '/workspace/:id' element = {<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>}></Route>
                  <Route path = '/board/:id' element = {<ProtectedRoute><Board /></ProtectedRoute>}></Route>
              </Routes>
            </Router>
      </AuthContextProvider>
  </div>
  );
}

export default App;

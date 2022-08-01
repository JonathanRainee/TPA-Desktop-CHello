import logo from './logo.svg';
import React from "react";
import { Routes, Route , BrowserRouter as Router} from "react-router-dom"
import SignIn from "./login"
import SignUp from "./signup"
import MainPage from "./mainpage"
import Account from "./Account"
import Workspace from './Workspace';
import WorkspaceDetail from './WorkspaceDetail';
import BoardDetail from './BoardDetail';
import Board from './Board'
import Invitation from './Invitation';
import ClosedBoard from './ClosedBoard';
import SIgnInInvite from './SIgnInInvite';
import SignInInviteBoard from './SignInInviteBoard';
import InvitationBoard from './InvitationBoard';
import Notif from './Notif';
import List from './List';
import CardDetail from './CardDetail';
import CalendarV from './calendar';
import CardLocation from './CardLocation';
import {AuthContextProvider} from "./context/authContext"
import  {Shortcutt} from './short';
import ProtectedRoute from "./ProtectedRoute"
// import './App.css';

function App() {
  return (
    <div>
      <AuthContextProvider>
            <Router>
              <Routes>
                {/* <Shortcutt> */}
                  <Route path = '/' element = {<SignIn />}/>
                  <Route path = '/signInInviteWS/:id' element = {<SIgnInInvite/>}></Route>
                  <Route path = '/signInInviteB/:id/:boardid' element = {<ProtectedRoute><SignInInviteBoard /></ProtectedRoute>}></Route>
                  <Route path = '/signup' element = {<SignUp />}/>
                  <Route path = '/Home/:id' element = {<ProtectedRoute><MainPage /></ProtectedRoute>}/>
                  <Route path = '/Account/:id' element = {<ProtectedRoute><Account /></ProtectedRoute>}/>
                  <Route path = '/workspaces' element = {<ProtectedRoute><Workspace /></ProtectedRoute>}></Route>
                  <Route path = '/workspace/:id' element = {<ProtectedRoute><WorkspaceDetail /></ProtectedRoute>}></Route>
                  <Route path = '/board/:id' element = {<ProtectedRoute><Board /></ProtectedRoute>}></Route>
                  <Route path = '/boardDetail/:id/:boardid' element = {<ProtectedRoute><BoardDetail /></ProtectedRoute>}></Route>
                  <Route path = '/invitation/workspace/:id' element = {<ProtectedRoute><Invitation /></ProtectedRoute>}></Route>
                  <Route path = '/invitation/board/:id/:boardid' element = {<ProtectedRoute><InvitationBoard /></ProtectedRoute>}></Route>
                  <Route path = '/notification' element = {<ProtectedRoute><Notif /></ProtectedRoute>}></Route>
                  <Route path = '/closedBoard' element = {<ProtectedRoute><ClosedBoard /></ProtectedRoute>}></Route>
                  <Route path = '/list/:boardid' element = {<ProtectedRoute><List /></ProtectedRoute>}></Route>
                  <Route path = '/cardDetail/:name/:id' element = {<ProtectedRoute><CardDetail /></ProtectedRoute>}></Route>
                  <Route path = '/calendar/:boardID' element = {<ProtectedRoute><CalendarV /></ProtectedRoute>}></Route>
                  <Route path = '/loc/:id/:locID' element = {<ProtectedRoute><CardLocation /></ProtectedRoute>}></Route>
                {/* </Shortcutt> */}
              </Routes>
            </Router>
      </AuthContextProvider>
  </div>
  );
}

export default App;

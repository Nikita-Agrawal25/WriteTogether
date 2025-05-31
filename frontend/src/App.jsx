import {BrowserRouter, Route, Routes} from 'react-router-dom'
import React, {useState, useEffect} from 'react'
import GoogleLogin from './pages/GoogleLogin'
import Dashboard from './pages/Dashboard'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Home from './pages/Home'
import Signup from './pages/Signup'
import Create from './pages/teams/Create'
import Editor from './components/editor/Editor'


function App() {
  const [activeTeam, setActiveTeam] = useState('Team Name');
  const [userInfo, setUserInfo] = useState({
    image: '',
    name: 'ABC',
    email: 'abc@gmail.com',
  });

  useEffect(() => {
    const data = localStorage.getItem('user-info')
    if(data) {
      const userData = JSON.parse(data);
      setUserInfo(userData);
      console.log(userData)
    }
  }, [])

  const GoogleWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="1048868458909-2eujgvp2nj491nocou15koptj177a1dl.apps.googleusercontent.com">
			  <GoogleLogin></GoogleLogin>
		  </GoogleOAuthProvider>
    )
  }
  const SignupWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="1048868458909-2eujgvp2nj491nocou15koptj177a1dl.apps.googleusercontent.com">
			  <Signup></Signup>
		  </GoogleOAuthProvider>
    )
  }

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/login' element={<GoogleWrapper/>}/>
          <Route path='/' element={<Home/>}/>
          <Route path='/signup' element={<SignupWrapper/>}/>
          <Route path='/dashboard' element={<Dashboard/>}/>
          <Route path="/editor/:id" element={<Editor activeTeam={activeTeam} userInfo={userInfo}/>} />
          <Route path='/team/create' element={<Create/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
// eslint-disable-next-line no-unused-vars
import React from 'react'
import {BrowserRouter,Routes,Route}from 'react-router-dom';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Emailverify from './pages/Emailverify.jsx';
import Resetpasswd from './pages/Resetpasswd.jsx';

// Syntax for setting up Routes

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login/>}/>
          <Route path="/email-verify" element={<Emailverify/>}/>
          <Route path="/reset-passwd" element={<Resetpasswd/>}/>
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App

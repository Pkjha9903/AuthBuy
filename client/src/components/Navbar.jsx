// eslint-disable-next-line no-unused-vars
import React from 'react'
import {useContext} from 'react';
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'
import {AppContent} from '../context/Appcontext';
import axios from 'axios';
const Navbar = () => {

  const navigate=useNavigate();
  const {userData,backendUrl,setIsloggedin,setUserData}=useContext(AppContent)
// Email Verification otp to be sent on the respective email
  const sendVerificationOtp=async()=>{
    try{
      axios.defaults.withCredentials=true;//sending cookies
      const {data}=await axios.post(backendUrl+'/api/auth/send-verify-otp');//response stored in data variable
      if(data.success){
        navigate('/email-verify');
        alert(data.message);
      }
    }catch(error){
      alert(error.message);
    }
  }

  const logout=async()=>{
    try{
      axios.defaults.withCredentials=true;//remove the cookies
      const {data}=await axios.post(backendUrl+'/api/auth/logout');//res.json from backend to be stored
      if(data.success){
        setIsloggedin(false);
        setUserData(false);
        navigate('/');
      }
    }
    catch(error){
      alert(error.message);
    }

  }

  return (
    <div className='w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 absolute top-0'>
      <img src={assets.logo} alt="Logo" className='w-28 sm:w-32' />

      {userData?<div className='w-8 h-8 flex justify-center items-center rounded-full bg-black
      text-white relative group cursor-pointer'>
        {userData.name[0].toUpperCase()}
        <div className='absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10'>
          <ul className='list-none m-0 p-2 bg-gray-200 text-sm'>
            {!userData.isAccountVerified && <li onClick={sendVerificationOtp} className='py-1 px-2 
            hover:bg-gray-300 cursor-pointer'>Verify Email</li>}
            <li onClick={logout} className='py-1 px-2 hover:bg-gray-300 cursor-pointer pr-10'>Logout</li>
          </ul>
        </div>
      </div>:
      <button onClick={()=>navigate('/login')}
      className='flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 
      text-gray-800 hover:bg-gray-100 transition-all' >Login <img src={assets.arrow_icon} alt=""/></button>
      }
      
    </div>
  )
}

export default Navbar


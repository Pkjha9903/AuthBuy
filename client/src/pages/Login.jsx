// eslint-disable-next-line no-unused-vars
import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { useState } from 'react';
import {useNavigate} from 'react-router-dom';
import {AppContent} from '../context/Appcontext';
import axios from 'axios';

const Login = () => {

  const navigate=useNavigate();

  const{backendUrl,setIsloggedin,getUserData}=useContext(AppContent)

  const [state,setState]=useState('Sign Up');
  const [name,setName]=useState('');
  const [email,setEmail]=useState('');
  const [password,setPassword]=useState('');

  const onSubmitHandler=async(e)=>{
      try{
        e.preventDefault();

        axios.defaults.withCredentials=true;//To send cookies
        if(state==='Sign Up'){
          //API call to Register API i.e. connecting to the backend
          const {data}=await axios.post(backendUrl + '/api/auth/register',{name,email,password});
          if(data.success){
            setIsloggedin(true);
            getUserData();
            navigate('/');
          }
          else{
            alert(data.message);
          }
        }
        //state is not sign up
        else{
          const {data}=await axios.post(backendUrl + '/api/auth/login',{email,password});//things to send
          if(data.success){
            setIsloggedin(true);
            getUserData();
            navigate('/');
          }
          else{
            alert(data.message);
          }
        }
      }catch(error){
        alert(error.message);
      }
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-6 sm:px-0
    bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt="" className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 
      cursor-pointer'/>

      <div className='bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96
      text-indigo-300 text-sm'>
        {/* Which page login or create account will be displayed */}
        <h2 className='text-3xl font-semibold text-white text-center mb-3'>{state==='Sign Up'?'Create Account':'Login'}</h2>

        <p className='text-center text-sm mb-6'>{state==='Sign Up'?'Create Your Account':'Login to Your Account'}</p>

        <form onSubmit={onSubmitHandler}> 
          {state==='Sign Up' && (
            <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
            bg-[#333A5C]'>
              <img src={assets.person_icon} alt=""/>
              <input onChange={e=>setName(e.target.value)} 
              value={name} 
              className='outline-none bg-transparent' type="text" placeholder='Full Name' required/>
            </div>
          )}
          
          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
          bg-[#333A5C]'>
            <img src={assets.mail_icon} alt=""/>
            <input 
            onChange={e=>setEmail(e.target.value)} 
            value={email} 
            className='outline-none bg-transparent' type="email" placeholder='Email ID' required/>
          </div>

          <div className='mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full
          bg-[#333A5C]'>
            <img src={assets.lock_icon} alt=""/>
            <input 
            onChange={e=>setPassword(e.target.value)} 
            value={password} 
            className='outline-none bg-transparent' type="password" placeholder='Password' required/>
          </div>

          <p onClick={()=>navigate('/reset-passwd')} 
          className='mb-4 text-indigo-500 cursor-pointer'>Forgot Password?</p>
          {/* Jo bhi state ki value hai woh display ho jayegi button pe */}
          <button className='w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900
          text-white font-medium'>{state}</button>
        </form>
        
        {state ==='Sign Up'?(//If the state is 'Sign Up' then this is displayed
          <p className='text-gray-400 text-center text-xs mt-4'>Already have an account?{' '} 
          <span className='text-blue-400 cursor-pointer underline' 
          onClick={()=>setState('Login')}>Login Here</span></p>
        )
        :(
          <p className='text-gray-400 text-center text-xs mt-4'>Do not have an account?{' '} 
          <span className='text-blue-400 cursor-pointer underline' 
          onClick={()=>setState('Sign Up')}>Sign Up </span></p>
        )}
      </div>
    </div>
  )
}

export default Login

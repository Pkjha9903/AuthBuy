import React,{useContext} from "react"
import {useNavigate} from 'react-router-dom';
import { assets } from '../assets/assets'
import AppContent from "../context/Appcontext";
import axios from 'axios';

const Emailverify = () => {
  const navigate=useNavigate();
  axios.defaults.withCredentials=true;//add cookies

  const {backendUrl,getUserData}=useContext(AppContent);

  const inputRefs=React.useRef([]);//To store the entered otp without rerender

    //Automatically moving the cursor from one field to other
  const handleInput=async(e,index)=>{
    if(e.target.value.length>0 && index<inputRefs.current.length-1){
      inputRefs.current[index+1].focus();
    }
  }

  //Delete using backspace
  const handleDown=async(e,index)=>{
    if(e.key==='Backspace' && e.target.value==='' && index>0){
      inputRefs.current[index-1].focus();
    }
  }

  //Paste all 6-digits using ctrl+v
  const handlePaste=async(e)=>{
    const paste=e.clipboardData.getData('text');
    const pasteArray=paste.split('');//array of 6-digit mil gya
    pasteArray.forEach((char,index)=>{
      if(inputRefs.current[index]){
        inputRefs.current[index].value=char;//add each number to each input field
      }
    })
  }

  //On clicking verify email it will send the entered otp to backend
  const onsubmithandler=async(e)=>{
    try{
      e.preventDefault();//Page will not be refreshed
      const otpArray=inputRefs.current.map(e=>e.value);//all input data will be added to otpArray
      const otp=otpArray.join('');
      //send this to backend API
      const {data}=await axios.post(backendUrl+'/api/auth/verify-account',{otp});
      if(data.success){
        alert("Account Verified Successfully");
        getUserData();
        navigate('/');
      }
      else{
        alert("OTP not correct!");
      }
    }
    catch(error){
      alert(error.message);
    }
  }

  return (
    <div className='flex items-center justify-center min-h-screen 
    bg-gradient-to-br from-blue-200 to-purple-400'>

      <img onClick={()=>navigate('/')} src={assets.logo} alt="" 
      className='absolute left-5 sm:left-20 top-5 w-28 sm:w-32 cursor-pointer'/>

      <form onSubmit={onsubmithandler} className="bg-slate-900 p-8 rounded-lgshadow-lg w-96 text-sm">
          <h1 className="text-white text-2xl font-semibold text-center mb-4">Email Verify Otp</h1>
          <p className="text-center mb-6 text-indigo-300">Enter the 6-digit code sent on email</p>

          {/* OTP entering box */}
          
          <div className='flex justify-between mb-8' onPaste={handlePaste}>
              {Array(6).fill(0).map((_,index)=>(
                  <input type='text' maxLength='1'key={index} required
                  className='w-12 h-12 bg-[#333A5C] text-white text-center text-xl rounded-full'
                  ref={e=> inputRefs.current[index]=e}
                  onInput={(e)=>handleInput(e,index)}
                  onKeyDown={(e)=>handleDown(e,index)}/>
              ))}
          </div>
          <button className='w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900
          text-white rounded-full'>
            Verify Email
          </button>
      </form>
    </div>
  )
}

export default Emailverify

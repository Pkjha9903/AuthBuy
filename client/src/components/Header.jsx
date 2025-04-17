// eslint-disable-next-line no-unused-vars
import React, { useEffect } from 'react'
import { useContext } from 'react'
import { assets } from '../assets/assets'
import {AppContent} from '../context/Appcontext';
import Cards from './Cards.jsx';
import hello from '../assets/hello.png'
import exp from '../assets/ExpressJS.jpg'
import axios from 'axios';

const Header = () => {
  const {userData,backendUrl}=useContext(AppContent)

  //to load the razorpay script
  const loadScript=async (src)=>{
    return new Promise((resolve)=>{
      const script=document.createElement("script");
      script.src=src;
      script.onload=()=>{
        resolve(true);
      }
      script.onerror=()=>{
        resolve(false);
      }
      document.body.appendChild(script);
    })
  }

    //to initialise the payment
  const onPayment=async(price,course)=>{
    try{
      const resScript = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

      if (!resScript) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      if (!window.Razorpay) {
        alert("Razorpay SDK failed to load. Please check your internet connection.");
        return;
      }

      const options={
        courseID:1,
        amount:price
      }
      const res=await axios.post(backendUrl+'/api/payment/createOrder',options);
      const data=res.data;
      console.log(data);

      const paymentObject=new window.Razorpay({
        key:"rzp_test_kctAZJZLogXuUI",
        order_id:data.id,
        ...data,
        // handler function executed after payment to verify payment
        //response contains payment details received from Razorpay.
        //response.razorpay_order_id: The same order ID used to initiate the payment.
        //response.razorpay_payment_id: The unique ID for the payment.
        //response.razorpay_signature: A signature generated to verify the authenticity of the transaction.
        handler:function(response){
          console.log(response);
          const option2={
            order_id:response.razorpay_order_id,
            payment_id:response.razorpay_payment_id,
            signature:response.razorpay_signature
          }
          axios.post(backendUrl+"/api/payment/verifypayment",option2).then((res)=>{
            if(res.data.success){
              alert("Payment Successful");
            }
            else{
              alert("Payment failed");
            }
          })
        }
      }) 
      paymentObject.open();
    }catch(error){
      console.log(error);
    }
  }


  useEffect(()=>{
    loadScript('https://checkout.razorpay.com/v1/checkout.js')
    .then(() => console.log("Razorpay script loaded successfully"))
      .catch((err) => console.error("Failed to load Razorpay script", err));;
  },[]);


  return (
    <div className='flex flex-col items-center mt-20 px-4 text-center text-gray-800'>
      <img src={assets.header_img} alt="" className='w-36 h-36 rounded-full mb-6'/>
      <h1 className='flex items-center gap-2 text-xl sm:text-3xl font-medium mb-2'>
        Hey {userData ? userData.name : 'Developer'}!
         <img className='w-8 aspect-square' src={assets.hand_wave} alt=""/></h1>

      <h2 className='text-3xl sm:text-5xl font-semibold mb-4'>Welcome to our app</h2>

      <p className='mb-8 max-w-md'>Lets start with a quick product tour and we will have you up.</p>
      <div>
        {userData && <div className='flex flex-row gap-2 items-center font-medium'>
          <Cards 
                imge={hello}
                course="React Course"
                price={2500}
                onPayment={onPayment}
          />
          <Cards 
                imge={exp}
                course="Node-Express Course"
                price={2000}
                onPayment={onPayment}
          />
          </div>}
      </div>
    </div>
  )
}

export default Header

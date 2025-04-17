/* eslint-disable react/prop-types */
import { createContext, useState,useEffect } from "react";
import axios from "axios";

export const AppContent=createContext()

export const AppContextProvider=(props)=>{
          axios.defaults.withCredentials=true;
          const backendUrl=import.meta.env.VITE_BACKEND_URL
          const [isloggedin,setIsloggedin]=useState(false);
          const[userData,setUserData]=useState(false);

          const getAuthState=async()=>{
                    try{
                              const {data}=await axios.get(backendUrl+'/api/auth/is-auth');
                              if(data.success){
                                        setIsloggedin(true);
                                        getUserData();
                              }
                    }
                    catch(error){
                              alert(error.message);
                    }
          }

          const getUserData=async()=>{
                    try{
                              const {data}=await axios.get(backendUrl+'/api/user/data')
                              data.success?setUserData(data.userData):alert(data.message);
                    }
                    catch(error){
                              alert(error.message);
                    }
          }

          useEffect(()=>{
                    getAuthState();
          },[])

          const value={
                    backendUrl,
                    isloggedin,setIsloggedin,
                    userData,setUserData,getUserData
          }
          return(
                    <AppContent.Provider value={value}>
                              {props.children};
                    </AppContent.Provider>
          )
}

export default AppContent;
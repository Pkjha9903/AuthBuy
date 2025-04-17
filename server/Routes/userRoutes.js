import express from 'express';
import userAuth from '../middleware/userauth.js';
import { getuserdata } from '../controllers/usercontroller.js';

const userRouter=express.Router();

//API endpoint to get user data
//Get coz we are getting the data from server
userRouter.get('/data',userAuth,getuserdata);// Hit the endpoint "/api/user/data" to get user data  

export default userRouter;//add this to server.js file
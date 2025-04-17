//API Generation
import express from 'express';
import { register,login,logout,sendverifyOtp,verifyEmail,isAuthenticated,sendResetOtp,resetPassword } from '../controllers/authcontroller.js';
import userAuth from '../middleware/userauth.js';//middleware that brings user Id from the token present in cookie

const authRouter=express.Router();

//whenver we hit this respective API endpoint it will execute the register,login,logout,verifyEmail,sendverifyOtp controller function
//Endpoints
authRouter.post('/register',register);
authRouter.post('/login',login);
authRouter.post('/logout',logout);
authRouter.post('/send-verify-otp',userAuth,sendverifyOtp);
authRouter.post('/verify-account',userAuth,verifyEmail);
authRouter.get('/is-auth',userAuth,isAuthenticated);
authRouter.post('/send-reset-otp',sendResetOtp);
authRouter.post('/reset-password',resetPassword);
//post coz we are sending data to this route
/*Now as we have included authRouter in server.js we wrote the path there as /api/auth 
 so now the actual endpoints are /api/auth/register , /api/auth/login, so on*/

//Add now in server .js 
export default authRouter;

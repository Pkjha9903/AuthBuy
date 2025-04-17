import bcrypt from 'bcryptjs';//for password
import jwt from 'jsonwebtoken';
import userModel from '../models/userModel.js';
import transporter from '../config/nodemailer.js';//for sending email

//controller function for user registration(//jb hm register api ko hit krenge toh register function backend mein run hoga)
export const register=async(req,res)=>{
          const {name, email, password} = req.body;
        //if any details go missing
          if(!name||!email||!password){
                    return res.json({success:false,message:'Missing details'});
          }
  //if we have all credentials correct then *try catch* block.
          try{
                    //user already in database i.e. the email enterd is already in db
                    const existinguser=await userModel.findOne({email});
                    if(existinguser){
                              return res.json({success:false,message:"email already exist"});
                    }
               //for new user
                    const hashedPassword=await bcrypt.hash(password,10)/*encrypt the user password*/

                //new user created using userModel and we need to mention the name,store the passwd,email
                //hashed password is stored in password field
                    const user=new userModel({name,email,password:hashedPassword});
                    await user.save();//user is saved in the database

                //token generation(authentication)-In .env write JWT_SECRET value and then, in this file write below line
                    const token=jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});//id to generate token

                    //sending COOKIE in response
                    res.cookie('token',token,{
                              httpOnly:true,
                              secure:process.env.NODE_ENV==='production',
                        //secure will be true for production environment and false for development
                              sameSite:process.env.NODE_ENV==='production'?
                              'none':'strict',//none for production and strict for development
                              maxAge:7*24*60*60*1000//7days expiry in *milliseconds*
                    })

                    //welcome email details.
                    const mailOptions={
                        from:process.env.SENDER_EMAIL,
                        to:email,//account holder
                        subject:"Welcome to IISC Banglore",
                        text:`Welcome to IISC Banglore.Your account has been created
                         with email id:${email} and username:${name}. We are the renowed institute 
                         in terms of research and are highly excited to invite you here`,
                    }

                    await transporter.sendMail(mailOptions);//will send the email to user

                    return res.json({success:true,message:"Successfully Registered"});//successfully registerd
          }catch(error){
                    res.json({success:false,message:error.message});//in case any error occurs
          }
}

//For login part
export const login=async(req, res)=>{
          const{email,password}=req.body;//take name psswd from request body
          //either of email and passwd not given
          if(!email||!password){
                    return res.json({success:false,message:"Email and passwd are required"});
          }
  //if email passwd exist *try and catch* block
          try{
                    const user=await userModel.findOne({email});
                    //user not exist
                    if(!user){
                              return res.json({success:false,message:"Invalid Email"});
                    }
                    //match the password entered and already in the database
                    const isMatch=await bcrypt.compare(password,user.password);
                    if(!isMatch){
                              return res.json({success:false,message:"Invalid Password"});
                    }

                    //if both email and password are correct then Generate a token
                    //Token generation and cookie is same as the above i.e. same codes as that of register part
                    const token=jwt.sign({id:user._id},process.env.JWT_SECRET, {expiresIn:'7d'});

                    res.cookie('token',token,{
                              httpOnly:true,
                              secure:process.env.NODE_ENV==='production',
                              //secure will be true for production environment and false for development
                              sameSite:process.env.NODE_ENV==='production'?
                              'none':'strict',//none for production and strict for development
                              maxAge:7*24*60*60*1000//7days expiry in milliseconds
                    });

                    return res.json({success:true,message:"Logged In"});//successfully logged in

          }catch(error){
                    res.json({success:false,message:error.message});
          }
}

//controller function for log out
export const logout=async(req,res)=>{
        try{
                //In response we will clear the cookie that was sent when user logged in to account
                //name of token is passed as the first parameter here i.e. token
                res.clearCookie('token',{
                        httpOnly:true,
                        secure:process.env.NODE_ENV==='production',
                        sameSite:process.env.NODE_ENV==='production'?
                        'none':'strict',
                });

                return res.json({success:true,message:"Logged out"});//logged out successfully
        }catch(error){
                res.json({success:false,message:error.message});
      }
}

//after this we create API endpoints using this all controller function and we create routes for that

//send email verification otp to user via email ka controller function
export const sendverifyOtp=async(req,res)=>{
        try{
                const {userId}=req.body;
                const user=await userModel.findById(userId);//search the user in database by id
                //check wheteher account is already verified or not

                if(user.isAccountVerified){//if alrady verified then this will execute
                        return res.json({success:true,message:"Account already verified"});
                }
                //if not verified then this will execute
                //OTP generation and sending to user via email
                const otp=String(Math.floor(100000+Math.random()*900000));//6 digit random number
                //we need to store the otp and set the expiry time in database.
                user.verifyOtp=otp;
                user.verifyOtpExpireat=Date.now()+24*60*60*1000;//expiry in milliseconds
                await user.save();//all these schema property values are saved in database

                //NOW send email to user intact with generated otp

                const mailOption={
                        from:process.env.SENDER_EMAIL,
                        to:user.email,
                        subject:"Account verification OTP",
                        text:`Your otp is ${otp}.Verify your account.`
                }

                await transporter.sendMail(mailOption);

                return res.json({success:true,message:"Verification otp sent on email"});
        }catch(error){
                res.json({success:false,message:error.message});
        }
}

/*User Id will be recived from the token and token is stored in the cookie so we need a MIDDLEWARE
that will get a cookie and from cookie we find token and then it will find USER ID and it
will be added in the req.body*/

//verification of email via otp ka controller function

export const verifyEmail=async(req,res)=>{
        const{userId,otp}=req.body;//here otp is the otp enterd by user,not the one provided by server
        //if any of them are missing
        if(!userId||!otp){
                return res.json({success:false,message:"Missing Details"});
        }
        //if otp is received then do "try catch" block.
        try{
                const user=await userModel.findById(userId);//find user in db from Id.
                //If user not found
                if(!user){
                        return res.json({success:false,message:"User not found"});
                }
                //if enterd otp doesnot match with the supplied otp user.verifyOtp(in database) is the otp 
                //sent to user from backend
                if(user.verifyOtp===''||user.verifyOtp!==otp){
                        return res.json({success:false,message:"Invalid Otp"}); 
                }
                //otp expiry check
                if(user.veriftOtpExpireat<Date.now()){
                        return res.json({success:false,message:"Otp expired"});
                }
                //otp not expired and it matches with the otp stored in database.
                //we need to turn account verified as true.
                user.isAccountVerified=true;
                //after verifying we need to change the value of verifyOtp and expiry to is default
                user.verifyOtp='';
                user.verifyOtpExpireat=0;

                await user.save();
                return res.json({success:true,message:"Email verified successfully"});
        }catch(error){
                res.json({success:false,message:error.message});
        }
}

//User is authenticated or not(i.e. logged in)
export const isAuthenticated =async(require,res)=>{
        try{
        //how it will check=> before this controller function, we execute the middleware in API & then this one
                return res.json({success:true});
        }catch(error){
                res.json({success:false,message:error.message});
        }
}

//Now we create a controller function for sending "Password Reset OTP" mail to user
export const sendResetOtp=async(req,res)=>{
        const {email}=req.body;
        if(!email){return res.json({success:false,message:"Email is Required"});}
        //If the email is available
        try{
                const user=await userModel.findOne({email});
                //If user does not exist with this email
                if(!user){return res.json({success:false,message:"User not found"});}
                //If user exist then send the Otp via email.Copy from sendVerifyOtp func above

             //OTP generation and sending to user via email
                const otp=String(Math.floor(100000+Math.random()*900000));//6 digit random number
                //we need to store the otp and set the expiry time in database.
                user.resetOtp=otp;
                user.resetOtpExpireat=Date.now()+15*60*1000;//15 minutes
                await user.save();//all these schema property values are saved in database
 
                //NOW send email to user intact with generated reset password otp
 
                const mailOption={
                         from:process.env.SENDER_EMAIL,
                         to:user.email,
                         subject:"Password Reset OTP",
                         text:`Your otp for password reset is ${otp}.Use this otp to
                         proceed with resetting your password`
                 }
 
                await transporter.sendMail(mailOption);
                return res.json({success:true, message:"Password Reset OTP send on email"});
        }catch(error){
                res.json({success:false,message:error.message});
        }
}

//User Reset Password via otp
export const resetPassword =async(req,res) => {
        const {email,otp,newPassword} = req.body;//here otp is the otp enterd by user,not the one provided by server
        if(!email||!otp||!newPassword){
                return res.json({success:false,message:"Email,Otp,New Password required"});
        }
        try{
                const user=await userModel.findOne({email});
                if(!user){//user with this email not found
                        return res.json({success:false,message:"User not found"});
                }
                if(user.resetOtp===''||user.resetOtp!==otp){
                        return res.json({success:false,message:"Invalid OTP"});
                }
                if(user.resetOtpExpireat<Date.now()){
                        return res.json({success:false,message:"OTP expired"});
                }

                //encrypt the password to store in db
                const hashedPassword = await bcrypt.hash(newPassword,10);
                user.password = hashedPassword;
                user.resetOtp ='';//bring all other field back to default
                user.resetOtpExpireat = 0;
                await user.save();//save new details in database

                res.json({success:true,message:"Password reset successfully"});
        }catch(error){
                res.json({success:false,message:error.message});
        }
}


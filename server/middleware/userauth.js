import jwt from "jsonwebtoken";

const userAuth=async(req,res,next)=>{
        //we take the token from the cookie(token is present in the cookie)
          const {token}=req.cookies;

          if(!token){//if no token
                    return res.json({success:false,message:"Not authorised"});
          }

          try{
                    //decode the token
                    const tokendecode=jwt.verify(token,process.env.JWT_SECRET);
                    if(tokendecode.id){//it has the id and add this to req body with property userId
                              req.body.userId=tokendecode.id;
                    }
                    else{
                              return res.json({success:false,message:"Not Authorised"});
                    }
                    next();
          }catch(error){
                    res.json({success:false,message:error.message});
            }
}

export default userAuth;
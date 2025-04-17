import userModel from "../models/userModel.js";

//To get user data from server ka Controller function

export const getuserdata=async(req,res)=>{
          try{
                    //find user using user ID
                    //this userID will be added to body by middleware 
                    const {userId}=req.body;
                    const user=await userModel.findById(userId);

                    if(!user){
                              return res.json({success:false,message:"User not found"});
                    }

                    res.json({
                              success:true,
                              userData:{
                                        name:user.name,
                                        isAccountVerified:user.isAccountVerified,
                              }
                    });
          }catch(error){
                res.json({success:false,message:error.message});
        }
}
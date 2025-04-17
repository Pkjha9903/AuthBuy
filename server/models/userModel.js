import mongoose from "mongoose";
//define schema of the model
const userSchema=new mongoose.Schema({
          name: {type:String, require:true},//*require:true* hota hai 
          email: {type:String, require:true, unique:true},
          password: {type:String,require:true},
          verifyOtp:{type:String, default:''},
          verifyOtpExpireat:{type:Number, default:0},
          isAccountVerified:{type:Boolean, default:false},
          resetOtp:{type:String, default:''},
          resetOtpExpireat:{type:Number, default:0},
})
/*from our side we nedd to provide only name,email,password and rest will automatically be added
  as they have some default value*/ 

const userModel=mongoose.models.user||mongoose.model('user',userSchema);

/*If user model already exist then its ok otherwise using the above schema defined new user model is created*/
/*it will search the model named 'user' if it exists then this user model is used("use of mongoose.models.user") */
export default userModel;
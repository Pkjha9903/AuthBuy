import { createRazorpayInstance } from "../config/razorpay.config.js";
import crypto from 'crypto'
const razorpayInstance = createRazorpayInstance();

export const createOrder = async (req, res) => {
  const { courseID, amount } = req.body;

  //create order
  const options = {
    amount: amount * 100, //skip two decimal
    currency: "INR",
    receipt: `receipt_order_1`,
  };

  try {
    razorpayInstance.orders.create(options, (err, order) => {
      if (err) {
        return res.json({
          success: false,
          message: "Something went wrong",
        });
      }
      return res.json(order);
    });
  } catch (error) {
    return res.json({
      success: false,
      message: "Something went wrong",
    });
  }
};

export const verifyPayment=async(req,res)=>{
          const {order_id,payment_id,signature}=req.body;
          const secret=process.env.RAZORPAY_KEY_SECRET;
          //create hmac
          const hmac=crypto.createHmac("sha256",secret);
          hmac.update(order_id+"|"+payment_id);
          const generatedsig=hmac.digest("hex");
          if(generatedsig===signature){
                    return res.json({success:true,nessage:"Payment Verified"});
          }
          else{
                    return res.json({success:false,nessage:"Payment Not Verified"});
          }
}

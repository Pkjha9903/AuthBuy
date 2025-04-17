import express from 'express';
import { createOrder,verifyPayment} from "../controllers/razorpay.controller.js";

const paymentrouter=express.Router();

paymentrouter.post('/createOrder',createOrder);
paymentrouter.post('/verifypayment',verifyPayment);

export default paymentrouter;

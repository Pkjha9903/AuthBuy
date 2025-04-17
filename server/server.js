import express from "express";
import cors from "cors";
import 'dotenv/config';
import cookieParser from "cookie-parser";
import connectDB from './config/mongodb.js';
import authRouter from './Routes/authRoutes.js';
import userRouter from "./Routes/userRoutes.js";
import paymentrouter from "./Routes/payment.js"

const app = express();
const port=process.env.port || 4000;
connectDB();/*We have connected our Express app to MongoDB database*/
const allowedOrigin=['http://localhost:5173'];//connect to frontend

app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:allowedOrigin, credentials:true}));

//API endpoints
app.get('/',(req,res)=>res.send("API Working"));
app.use('/api/auth',authRouter);
app.use('/api/user',userRouter);
app.use('/api/payment',paymentrouter);

app.listen(port,()=>console.log(`Server started on PORT:${port}`));
import express from 'express';
import cors from 'cors';
import AuthRouter from './Routers/AuthRouter.js';
import mongoose from 'mongoose';

const app = express();
app.use(cors());
app.use(express.json());

await mongoose.connect(process.env.MONGO_URI).then(()=>{
    console.log("Connected to MongoDB");
})


app.use('/auth',AuthRouter);



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
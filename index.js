import express from 'express';
import cors from 'cors';
import AuthRouter from './Routers/AuthRouter';


const app = express();
app.use(cors());
app.use(express.json());



app.use('/auth',AuthRouter);



app.listen(3000,()=>{
    console.log("Server is running on port 3000");
});
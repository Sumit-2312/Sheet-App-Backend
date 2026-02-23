import express  from 'express';
import jwt from 'jsonwebtoken';
const AuthRouter = express.Router();


const SignupHandler = async(req,res)=>{
    try{
        const {username,email,password} = req.body;
    }
    catch(err){
        res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}


AuthRouter.post('/signup',SignupHandler);
AuthRouter.get('/signin',SigninHandler);


export default AuthRouter;
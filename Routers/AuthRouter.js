import express  from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
dotenv.config();
import { signupSchema } from '../zodSchemas/AuthSchema';
import { Users } from '../Database/db.js';
const AuthRouter = express.Router();




const SignupHandler = async(req,res)=>{
    try{
        const result = signupSchema.safeParse(req.body);
        if( !result.success ){
          return res.status(400).json({
                message: result.error.errors
            })
        }   

        const {username,password,email} = result.data;
        // check if the user with this email already exists or not
        // if successfull -> return document
        // if no document exist -> return null
        // if something went wrong -> throws error
        const user = await Users.findOne({email});

        if( user ){
            return res.status(200).json({
                message: "User already exist please try to signin"
            });
        } else{
            const hashedPass = await bcrypt.hash(password,10); // password,saltRounds
            // if successfull -> return document 
            // if fails -> throws error
            const newUser = await Users.insertOne({
                username,
                hashedPass,
                email
            });
            return res.status(200).json({
                message: "You have successfully signed up"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message: "Something went wrong",
            error: err
        });
    }
}


AuthRouter.post('/signup',SignupHandler);
// AuthRouter.get('/signin',SigninHandler);


export default AuthRouter;
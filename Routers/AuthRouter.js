import express  from 'express';
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'
import jwt from 'jsonwebtoken'
dotenv.config();
import { loginSchema, signupSchema } from '../zodSchemas/AuthSchema.js';
import { OTP, Users } from '../Database/db.js';
import { MailSchema, verifySchema } from '../zodSchemas/AuthSchema.js';
import { sendMail } from '../utils/mail.js';
const AuthRouter = express.Router();


/*
    Signup flow
    - user send username,email and password
    - check in database
        - if exist and isverified return response to signin and redirect to login page
        - if exited but not verfied redirect to verify page
        - if not exist make entry in database redirect to verify page


*/



const SignupHandler = async(req,res)=>{
    try{
        const result = signupSchema.safeParse(req.body);
        if( !result.success ){
          return res.status(400).json({
                message: "data is not as per schema",
                error: result.error
            })
        }   

        const {username,password,email} = result.data;
        // check if the user with this email already exists or not
        // if successfull -> return document
        // if no document exist -> return null
        // if something went wrong -> throws error
        const user = await Users.findOne({email});

        if( user && user.isVerified ){
            return res.status(200).json({
                redirect: "/login",
                message: "User already exist please try to signin"
            });
        }
        else if( user ) { // not verifies
            return res.status(200).json({
                redirect: "/verify", 
                message: "Already signed up! Needs to verify"
            });
        }
        else{
            const hashedPass = await bcrypt.hash(password,10); // password,saltRounds
            // if successfull -> return document 
            // if fails -> throws error
            await Users.create({
                username,
                password: hashedPass,
                email,
                isVerified: false
            });
            return res.status(200).json({
                redirect: "/sendMail",
                message: "You have successfully signed up"
            });
        }
    }
    catch(err){
        return res.status(500).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

const MailHandler = async(req,res)=>{
    try{
        const result = MailSchema.safeParse(req.body);
        if( !result.success){
            return res.status(400).json({
                message: "Something went wrong",
                error: result.error.errors
            })
        }
        const {email} = result.data;
        // check if the email exist in database or not
        const user = await Users.findOne({email});
        if( !user ){
            return res.status(400).json({
                message: "User don't exist with this email",
                error: "No email exist"
            });
        }
        // if user exists
        // send him the mail
        console.log("before sending mail")
       const response = await sendMail(email,user._id);
         console.log("after sending mail")
       if( !response.success ){
            return res.status(500).json({
                error: response.error
            });
       }
       else{
        return res.status(200).json({
            message: response.message
        });
       }

    }catch(err){
        return res.status(400).json({
            message: "something went wrong while sending mail",
            error : err.message
        });
    }
}

const verifyHandler = async(req,res)=>{
    try{
        const result = verifySchema.safeParse(req.body);
        console.log(result);
        if( !result.success ){
            console.log("Something went wrong while validating the data");
            return res.status(400).json({
                message: "Something went wrong",
                error: result.error
            });
        }

        const {email,otp} = result.data;
        // check in the database
        // otp collection -> user,otp,expiry
        const user = await Users.findOne({email});
        if( !user ){
            console.log("No such user exist with given email");
            return res.status(400).json({
                message: "something went wrong",
                error: "No such user exist with given email"
            });
        }
        console.log("after user check")
        
        // no find the user_id and otp entry in otp collection
        const isEntry = await OTP.findOne({user:user._id,otp:otp});
        if( !isEntry ){
            console.log("Wrong OTP provided");
            return res.status(400).json({
                message: "something went wrong",
                error: "Wrong OTP provided"
            });
        }  
        console.log("after otp check")

        // check for expiry date of OPT given
        if( isEntry.expiry < new Date() ){
            return res.status(400).json({
                message: "something went wrong",
                error: "OTP expired"
            });
        }
        console.log("after expiry check")
        
        // if all condition are passed then update the user collection and set isVerified to true
        await Users.updateOne({_id: user._id},{$set:{isVerified: true}});
        console.log("after updating user collection")
        // delete the OTP entry for that user
        await OTP.deleteOne({user: user._id});
        console.log("after deleting otp entry")
        return res.status(200).json({
            redirect: "/login",
            message: "Your account has been verified successfully"
        });

    }catch(err){
        console.log("Error in catch block");
        console.log(err);
        return res.status(400).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}

const SigninHandler = async(req,res)=>{
    try{
        const result = loginSchema.safeParse(req.body);
        if( !result.success ){
            return res.status(400).json({
                message: "data is not as per schema",
                error: result.error.errors
            });
        }

        const {email,password} = result.data;
        // check if the user exist with this email or not
        const user = await Users.findOne({email});
        if( !user ){
            return res.status(400).json({
                message: "User don't exist with this email",
                error: "No such email exist"
            });
        }
        // if user exist then compare the password
        const isMatch = await bcrypt.compare(password,user.password);
        if( !isMatch ){
            console.log("Incorrect password provided");
            return res.status(400).json({
                message: "Incorrect password"
            });
        }

        // after the password is matched , generate the token using jwt and send back to the user on frontend

        const token = jwt.sign({
            email : email
        },process.env.JWT_SECRET);

        return res.status(200).json({
            message: "You have successfully signed in",
            token : token
        });
    }catch(err){
        console.log("Error in catch block");
        console.log(err);
        return res.status(400).json({
            message: "Something went wrong",
            error: err.message
        });
    }
}


AuthRouter.post('/signup',SignupHandler);
AuthRouter.post("/sendMail",MailHandler);
AuthRouter.post("/verify",verifyHandler);
AuthRouter.get('/signin',SigninHandler);


export default AuthRouter;
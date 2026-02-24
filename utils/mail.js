import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import { OTP } from '../Database/db.js';
dotenv.config();
// Create ONE transporter instance and reuse it throughout your application.
// The transporter manages up to `maxConnections` persistent connections internally.
const transporter = nodemailer.createTransport({
  host: "smtp.sendgrid.net",
  port: 587,
  secure: false,
  pool: true, // Enable connection pooling
  maxConnections: 5, // Maximum number of simultaneous connections (default: 5)
  maxMessages: 100, // Messages per connection before reconnecting (default: 100)
  auth: {
    user: "apikey",
    pass: process.env.SENDGRID_API_KEY,
  },
});


const GenerateOTP = ()=>{
    return Math.floor(Math.random()*1000000);
}


async function sendMail(userEmail,userId){
    console.log("inside send mail function")
    const otp = GenerateOTP();
    console.log("generated otp is ",otp);
    try{
         await transporter.sendMail({
            from: process.env.SENDGRID_EMAIL,
            to: userEmail,
            subject: "Your OTP Code",
            text: `Your OTP is ${otp}`,
        });
        console.log("mail send successfully");
        await OTP.create({
            user: userId,
            otp: otp,
            expiry: new Date(Date.now() + 10*60*1000) // OTP valid for 10 minutes
        })
        console.log("otp entry created in database");
        return {
            success: true,
            message: "Send mail successfully"
        };
    }catch(err){
        console.log(err);
        return {
            success: false,
            error: err
        };
    }
}



export {
    sendMail
}

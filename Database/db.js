import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";


const UserSchema = new Schema({
    username: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },  
    password: {
        type: String,
        required: true
    },
    isVerified:{
        type: Boolean,
        required: true
    }
});


const UserOtpSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  otp: {
    type: Number,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});


const Users = model('users',UserSchema);
const OTP = model('otp',UserOtpSchema);

export {
    Users,
    OTP
}
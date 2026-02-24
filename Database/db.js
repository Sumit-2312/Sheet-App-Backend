import mongoose, { model } from "mongoose";
import { Schema } from "mongoose";
const objectId = Schema.ObjectId;


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
    }
});



const Users = model('users',UserSchema);


export {
    Users
}
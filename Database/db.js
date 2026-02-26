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
    },
    sheet:{
      type: String,
    },
    addedQuestions:[{
      type: Schema.Types.ObjectId,
      ref: 'Questions'
    }], // contains questions apart from fixed questions in pre defined sheet
    removedQuestions:[{
      type: Schema.Types.ObjectId,
      ref: 'Questions'
    }] // contains questions of pre-defined sheet which are removed by user
});

const UserOtpSchema = new Schema({
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

const SheetsSchema = new Schema({
  name:{
    type: String,
    required: true,
    enum: ["Striver","Fraz","CSES"]
  },
  description: {
    type: String,
    required: true,
    default: "Practice DSA and enjoy😂"
  }
})

const FolderSchema = new Schema({
  name : {
    type: String,
    required: true
  },
  sheet :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Sheets",
    required: true
  },
  parent: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Folders",
    default: null,
    required: true
  }
})

const QuestionSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type:{
    type: String, // custom,pre-defined
    required: true,
    default: "pre-defined"
  },
  link: {
    type: String,
    required: true
  },
  platform: {
    type: String,
    required: true
  },
  folder: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  sheet:{
    type: Schema.Types.ObjectId,
    required: true
  }
});

const Question = model('Question', QuestionSchema);
const Users = model('users',UserSchema);
const OTP = model('otp',UserOtpSchema);
const Sheets = model('Sheets',SheetsSchema);
const Folders = model('Folders',FolderSchema);

export {
    Users,
    OTP,
    Sheets,
    Question,
    Folders
}
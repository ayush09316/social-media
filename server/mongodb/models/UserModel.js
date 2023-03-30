import mongoose from "mongoose";
import emailValidator from "email-validator";
import crypto from 'crypto'


const UserSchema= new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        min:2,
        max:50,
    },
    lastName:{
        type:String,
        required:true,
        min:2,
        max:50,
    },
    email:{
        type:String,
        required:true,
        unique:true,
        max:50,
        validate: function () {
            return emailValidator.validate(this.email);
          },
    },
    password:{
        type:String,
        require:true,
        min:7,
    },
    picturePath:{
        type:String,
        default:"",
    },
    friends:{
        type:Array,
        default:[],
    },
    location:String,
    occupation:String,
    viewedProfile:Number,
    impressions:Number,
    resetToken:String,
    expireToken:Date
},{timestamps:true});

UserSchema.methods.createResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString("hex");
    this.expireToken=Date.now()+2*60*1000;
    this.resetToken=resetToken;
    return resetToken;
  }

  UserSchema.methods.resetPasswordHandler=function(password){
    this.password=password;
    this.resetToken=undefined;
  }
  

const UserModel=mongoose.model("UserModel",UserSchema);
export default UserModel;
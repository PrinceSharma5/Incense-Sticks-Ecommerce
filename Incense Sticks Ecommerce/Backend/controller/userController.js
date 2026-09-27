
const express = require("express");

const { validationResult } = require("express-validator");
const UserModel = require("../models/User");

const bcrypt = require('bcrypt');
const generateRandomSixDigit = require("../services/otpGenerate");
const OTPModel = require("../models/OTP");
const jwt = require("jsonwebtoken");

const create_new_user=async(req,res)=>{
    try {
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {email,otp,password,confirm_password}=req.body

        const exist_otp=await OTPModel.find({email:email}).sort({_id:-1}).limit(1)

        if(!exist_otp){
            return res.status(400).json({message:"OTP Not Found",success:false})
        }

    
        

         const otpTiming=exist_otp[0].createdAt.getTime()
        const otpExpiryTiming = otpTiming + 15 * 60 * 1000;
        
        if(otpTiming>otpExpiryTiming){
            return res.status(400).json({message:"OTP Expired",success:false})
        }


if(exist_otp[0].otp!=otp){
    return res.status(400).json({message:"Invalid OTP",success:false})
}
    


        const exist_email=await UserModel.findOne({email:email})
        if(exist_email){
            return res.status(400).json({message:"Email Already Exists",success:false})
        }

        if(password!==confirm_password){
            return res.status(400).json({message:"Password Does Not Match",success:false})
        }

           const saltRounds = 15;
                const salt = bcrypt.genSaltSync(saltRounds);
               const encrypted_password= await bcrypt.hash(password, salt)


               const newUser=await UserModel.create({
                   email:email,
                   password:encrypted_password
               })

               return res.status(200).json({message:"User Created Successfully",success:true})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const generate_otp=async(req,res)=>{
    try {
         const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {email}=req.body
        const newOTP=await generateRandomSixDigit(email)

        console.log(newOTP);
        
        return res.status(200).json({message:"OTP Sent Successfully",success:true,otp:newOTP})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})

    }
}


const login_user=async(req,res)=>{
    try {
          const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {email,password}=req.body

        const exist_email=await UserModel.findOne({email:req.body.email})
        if(!exist_email){
            return res.status(400).json({message:"Account Does't Exist",success:false})
        }

        const isMatch=await bcrypt.compareSync(password, exist_email.password); // true
        if(!isMatch){
            return res.status(400).json({message:"Password Does Not Match",success:false})
        }


        const token = jwt.sign({ _id: exist_email._id,email:exist_email.email }, process.env.SECRET_KEY);

        return res.status(200).json({message:"Logged In Successfully",success:true,token})
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


module.exports={
    create_new_user,
    generate_otp,
    login_user
}
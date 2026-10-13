
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
        const normalizedEmail=String(email).trim().toLowerCase()

        const exist_otp=await OTPModel.findOne({email:normalizedEmail}).sort({createdAt:-1})

        if(!exist_otp){
            return res.status(400).json({message:"OTP Not Found",success:false})
        }

        const otpExpiryTiming = exist_otp.createdAt.getTime() + 15 * 60 * 1000
        if(Date.now() > otpExpiryTiming){
            await OTPModel.deleteOne({_id:exist_otp._id})
            return res.status(400).json({message:"OTP Expired",success:false})
        }

        if(String(exist_otp.otp)!==String(otp)){
    return res.status(400).json({message:"Invalid OTP",success:false})
}
    


        const exist_email=await UserModel.findOne({email:normalizedEmail})
        if(exist_email){
            return res.status(400).json({message:"Email Already Exists",success:false})
        }

        if(password!==confirm_password){
            return res.status(400).json({message:"Password Does Not Match",success:false})
        }

               const encrypted_password= await bcrypt.hash(password, 15)


               const newUser=await UserModel.create({
                   email:normalizedEmail,
                   password:encrypted_password
               })
               await OTPModel.deleteMany({email:normalizedEmail})

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

        const email=String(req.body.email).trim().toLowerCase()
        const existingUser=await UserModel.exists({email})
        if(existingUser){
            return res.status(400).json({message:"Email Already Exists",success:false})
        }
        await generateRandomSixDigit(email)
        
        return res.status(200).json({message:"OTP Sent Successfully",success:true})
    } catch (error) {
        console.error("OTP generation failed:", {
            name: error.name || "Error",
            code: error.code || "unknown",
            command: error.command || undefined,
            responseCode: error.responseCode || undefined,
        })
        
        return res.status(500).json({message:"Unable to send OTP email. Please try again.",success:false})

    }
}


const login_user=async(req,res)=>{
    try {
          const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {email,password}=req.body
        const normalizedEmail=String(email).trim().toLowerCase()

        const exist_email=await UserModel.findOne({email:normalizedEmail})
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

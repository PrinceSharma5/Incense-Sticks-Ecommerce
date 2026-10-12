const mongoose=require("mongoose")


const otpSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    otp:{
        type:String,
        required:true
    },
},{
    timestamps:true
})

const OTPModel=mongoose.model("rr_is_otp_collection",otpSchema)
module.exports=OTPModel
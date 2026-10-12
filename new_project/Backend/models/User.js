const mongoose=require('mongoose');

const userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const UserModel=mongoose.model("rr_is_user_collection",userSchema)
module.exports=UserModel;
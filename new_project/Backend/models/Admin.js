const mongoose=require('mongoose');

const adminSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    mobile_no:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    loginHistory:{
        type:[Date],
        required:true,
        default:[]
    }
},{
    timestamps:true
})

const AdminModel=mongoose.model("rr_is_admin_collection",adminSchema)
module.exports=AdminModel;
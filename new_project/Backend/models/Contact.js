const mongoose = require('mongoose');

const contactSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    mobile_no:{
        type:String,
        required:true
    },
    message:{
        type:String,
        required:true
    }
},{
    timestamps:true
})


const ContactModel=mongoose.model("rr_is_contact_collection",contactSchema)
module.exports=ContactModel;
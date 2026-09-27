const mongoose = require('mongoose');


const unusedCodeSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    maxDiscount:{
        type:Number,
        required:true
    }
},{
    timestamps:true
})


const UnusedCodeModel=mongoose.model("rr_is_unused_code_collection",unusedCodeSchema)


module.exports=UnusedCodeModel
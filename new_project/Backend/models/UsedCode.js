const mongoose = require('mongoose');


const unusedCodeSchema=new mongoose.Schema({
     user_id:{
           type:mongoose.Schema.Types.ObjectId,
           ref:"rr_is_user_collection",
           required:true
       },
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


const UsedCodeModel=mongoose.model("rr_is_used_code_collection",unusedCodeSchema)


module.exports=UsedCodeModel
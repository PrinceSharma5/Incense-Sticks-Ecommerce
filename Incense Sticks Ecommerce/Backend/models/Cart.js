const mongoose=require('mongoose');


const cartSchema=new mongoose.Schema({
    user_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'rr_is_user_collection',
        required:true
    },
    product_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'rr_is_product_collection',
        required:true
    },
    product_title:{
        type:String,
        required:true
    },
    product_price:{
        type:Number,
        required:true
    },
    product_image:{
        type:String,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
},{
    timestamps:true
})


const CartModel=mongoose.model("rr_is_cart_collection",cartSchema)
module.exports=CartModel;
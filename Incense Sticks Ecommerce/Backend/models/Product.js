const mongoose = require('mongoose');

const productSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    brand_name:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    fragnance_type:{
        type:String,
        required:true
    },
    mrp:{
        type:Number,
        required:true
    },
    discount:{
        type:Number,
        required:true
    },
    actual_price:{
        type:Number,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    burning_time:{
        type:String,
        required:true
    },
    weight:{
        type:String,
        required:true
    },
    material:{
        type:String,
        required:true
    },
    images:{
        type:[String],
        required:true
    }
},{
    timestamps:true
})

productSchema.index({title:"text",description:"text",fragnance_type:"text",category:"text",brand_name:"text"})

const ProductModel=mongoose.model("rr_is_product_collection",productSchema)
module.exports=ProductModel
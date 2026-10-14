const mongoose=require('mongoose');



const categorySchema=new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
},{
    timestamps:true
})


const CategoryModel=mongoose.model("rr_is_category_collection",categorySchema)
module.exports=CategoryModel;
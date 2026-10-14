
const { validationResult } = require("express-validator");
const AdminModel = require("../models/Admin");
const CategoryModel = require("../models/Category");


const delete_category=async(req,res)=>{
    try {

        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

         const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            return res.status(400).json({message:"Admin not found",success:false})
        }
        const {_id}=req.body
  const exist_category=await CategoryModel.findOne({_id:_id})
        if(!exist_category){
            return res.status(400).json({message:"Category not found",success:false})
        }

        await CategoryModel.deleteOne({_id:_id})

        return res.status(200).json({message:"Category deleted successfully",success:true})

        
    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const update_category=async(req,res)=>{
    try {
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

         const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            return res.status(400).json({message:"Admin not found",success:false})
        }
        const {_id,name}=req.body
        const exist_category=await CategoryModel.findOne({_id:_id})
        if(!exist_category){
            return res.status(400).json({message:"Category not found",success:false})
        }

        exist_category.name=name
        await exist_category.save()

        return res.status(200).json({message:"Category updated successfully",success:true})
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


const fetch_all_categories=async(req,res)=>{
    try {
        
        const data=await CategoryModel.find()
        return res.status(200).json({message:"Categories fetched successfully",success:true,data:data})
    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


const create_new_category=async(req,res)=>{
    try {
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            return res.status(400).json({message:"Admin not found",success:false})
        }

        const {name}=req.body
        const exist_category=await CategoryModel.findOne({name:name})
        if(exist_category){
            return res.status(400).json({message:"Category already exist",success:false})
        }

        const new_category=await CategoryModel.create({
            name:name
        })

        return res.status(200).json({message:"Category created successfully",success:true})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



module.exports={delete_category,update_category,fetch_all_categories,create_new_category}
const express=require("express")


const {validationResult } = require("express-validator");

const fs=require("fs");
const AdminModel = require("../models/Admin");
const ProductModel = require("../models/Product");
const path = require("path");
const CategoryModel = require("../models/Category");
const router=express.Router()

const deleteAllFiles=(files)=>{

    files.map((ele)=>{

    
        
        if(fs.existsSync(ele.path)){
            fs.unlinkSync(ele.path)
        }
    })
}


const createUrlsImages=(files)=>{
    let arr=[]
    files.map((ele)=>{
        let url=`${process.env.BASE_URL}/assets/product_images/${ele.filename}`
        arr.push(url)
    })
    return arr
}


const add_new_product=async(req,res)=>{
    try {

        

      
       const errors=validationResult(req)


       
        if(!errors.isEmpty()){
            deleteAllFiles(req.files)
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {title,brand_name,category,fragnance_type,mrp,discount,actual_price,stock,description,burning_time,weight,material}=req.body

        const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            deleteAllFiles(req.files)
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }



        const images=createUrlsImages(req.files)

        const newProduct=new ProductModel({
            title:title,
            brand_name:brand_name,
            category:category,
            fragnance_type:fragnance_type,
            mrp:mrp,
            discount:discount,
            actual_price:actual_price,
            stock:stock,
            description:description,
            burning_time:burning_time,
            weight:weight,
            material:material,
            images:images,
            admin_id:exist_admin._id
        })

        await newProduct.save()
  
       
        
        
        return res.status(200).json({message:"Product added successfully",success:true})
    } catch (error) {
        
        deleteAllFiles(req.files)
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}




const fetch_all_products=async(req,res)=>{
    try {
        
       
         
       const errors=validationResult(req)
        if(!errors.isEmpty()){
           
            
            
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {search,skip,category}=req.body

        const query={}

        if(category && category!==""){
            query.category=category

        }
        if(search && search!==""){
            query.$text={$search:`"${search}"`}
        }
       

        const TotalDocuments=await ProductModel.countDocuments()

const data=await ProductModel.find(query).sort({_id:-1}).skip(skip).limit(100)
            return res.status(200).json({message:"Products fetched successfully",success:true,data:data})
        
    } catch (error) {

        console.log(error);
        
              return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


const delete_specific_product=async(req,res)=>{
    try {

          const errors=validationResult(req)
        if(!errors.isEmpty()){
         
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }


        const exist_product=await ProductModel.findOne({_id:req.body._id})
        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }

        

        exist_product.images.map((ele)=>{

            const jonPath=path.join(process.cwd(),"statics","product_images","/")
            let newUrl=ele.replace("http://localhost:8500/assets/product_images/","")
         

           if(fs.existsSync(jonPath+newUrl)){

               fs.unlinkSync(jonPath+newUrl)
           }
        
        })

        await ProductModel.deleteOne({_id:req.body._id})
        
        return res.status(200).json({message:"Product deleted successfully",success:true})
    } catch (error) {
        console.log(error);
        
         return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const update_product_details=async(req,res)=>{
    try {

        
           const errors=validationResult(req)
        if(!errors.isEmpty()){
           
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {title,brand_name,category,fragnance_type,mrp,discount,actual_price,stock,description,burning_time,weight,material}=req.body


        const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const exist_product=await ProductModel.findOne({_id:req.body._id})
        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }


        exist_product.title=title
        exist_product.brand_name=brand_name
        exist_product.category=category
        exist_product.fragnance_type=fragnance_type
        exist_product.mrp=mrp
        exist_product.discount=discount
        exist_product.actual_price=actual_price
        exist_product.stock=stock
        exist_product.description=description
        exist_product.burning_time=burning_time
        exist_product.weight=weight
        exist_product.material=material

        await exist_product.save()
        
        return res.status(200).json({message:"Product updated successfully",success:true})



        
    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const update_my_product_images=async(req,res)=>{
    try {
        const errors=validationResult(req)
        if(!errors.isEmpty()){
           
  if(fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {index,_id}=req.body
        const exist_admin=await AdminModel.findOne({_id:req.token._id})
        if(!exist_admin){
              if(fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const exist_product=await ProductModel.findOne({_id:req.body._id})
        if(!exist_product){
              if(fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }
            return res.status(400).json({message:"Product not found",success:false})
        }

        if(exist_product.images.length<=index){
            return res.status(400).json({message:"Invalid Index",success:false})
        }

            let url=`${process.env.BASE_URL}/assets/product_images/${req.file.filename}`
            exist_product.images[index]=url
            await exist_product.save()

      

          const jonPath=path.join(process.cwd(),"statics","product_images","/")
            let newUrl=exist_product.images[index].replace("http://localhost:8500/assets/product_images/","")
         

        return res.status(200).json({message:"Image Updated Successfully",success:true})
        

    } catch (error) {
          if(fs.existsSync(req.file.path)){
            fs.unlinkSync(req.file.path)
        }
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


const fetch_data_with_category=async(req,res)=>{
    try {

        const categoryData=await CategoryModel.find()

        const data={
            
        }

        await Promise.all(categoryData.map(async(item)=>{
            data[item.name]=await ProductModel.find({category:item.name}).sort({_id:-1}).limit(20)
        }))

        return res.status(200).json({message:"Data Fetch Successfully",success:true,data:data})
        
    } catch (error) {
        
       return res.status(500).json({message:"Internal Server Error",success:false})
    }
}




const fetch_specific_product=async(req,res)=>{
    try {
   const errors=validationResult(req)
        if(!errors.isEmpty()){
           
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {_id}=req.body

        const exist_product=await ProductModel.findOne({_id:_id})

        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }

        return res.status(200).json({message:"Product Fetch Successfully",success:true,data:exist_product})

        
    } catch (error) {
          return res.status(500).json({message:"Internal Server Error",success:false})
    }
}

module.exports={
  add_new_product,
  fetch_all_products,
  delete_specific_product,
  update_product_details,
  update_my_product_images,
  fetch_data_with_category,
  fetch_specific_product
}
const { validationResult } = require("express-validator");
const CartModel = require("../models/Cart");
const ProductModel = require("../models/Product");
const UserModel = require("../models/User");


const add_to_cart=async(req,res)=>{
    try {
        
       
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {product_id,quantity}=req.body
        const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const exist_product=await ProductModel.findOne({_id:product_id})
        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }

        const exist_cart=await CartModel.findOne({product_id:product_id,user_id:exist_user._id})
        if(exist_cart){
            if(exist_product.stock>=exist_cart.quantity+quantity){

                exist_cart.quantity=exist_cart.quantity+quantity
                await exist_cart.save()
                return res.status(200).json({message:"Product added to cart successfully",success:true})
            }
            else{
                return res.status(400).json({message:`Out of Stock`,success:false})
            }

        }

        const newItem=new CartModel({
            user_id:exist_user._id,
            product_id:product_id,
            quantity:quantity,
            product_title:exist_product.title,
            product_price:exist_product.actual_price,
            product_image:exist_product.images[0]
        })

        await newItem.save()
        return res.status(200).json({message:"Product added to cart successfully",success:true})


    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const remove_from_cart=async(req,res)=>{
    try {

        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {product_id}=req.body
     const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const exist_product=await ProductModel.findOne({_id:product_id})
        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }

        const exist_cart=await CartModel.findOne({product_id:product_id,user_id:exist_user._id})
        if(!exist_cart){
         
            return res.status(400).json({message:"Product not found in cart",success:false})
        }

        await CartModel.deleteOne({product_id:product_id,user_id:exist_user._id})
        return res.status(200).json({message:"Product removed from cart successfully",success:true})
        
    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const fetch_cart_products=async(req,res)=>{
    try {
        
   
     const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

          const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const data=await CartModel.find({user_id:exist_user._id})
        return res.status(200).json({message:"Cart fetched successfully",success:true,data:data})

     } catch (error) {
         return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const reduce_cart_quantity=async(req,res)=>{
  try {
        
       
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {product_id,quantity}=req.body
        const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        const exist_product=await ProductModel.findOne({_id:product_id})
        if(!exist_product){
            return res.status(400).json({message:"Product not found",success:false})
        }

        const exist_cart=await CartModel.findOne({product_id:product_id,user_id:exist_user._id})
        if(exist_cart){
            
            if(exist_cart.quantity===1){
                await CartModel.deleteOne({product_id:product_id,user_id:exist_user._id})
                return res.status(200).json({message:"Product removed from cart successfully",success:true})
            }

            else{

                exist_cart.quantity=exist_cart.quantity-quantity
                await exist_cart.save()
                return res.status(200).json({message:"Product Quantity is Updated",success:true})
            }
           

        }

        return res.status(400).json({message:"Product not found in cart",success:false})


    } catch (error) {
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}

module.exports={add_to_cart,remove_from_cart,fetch_cart_products,reduce_cart_quantity}
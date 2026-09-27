const Razorpay=require("razorpay")
const express=require("express")
const router=express.Router()
var { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
const { body, validationResult } = require("express-validator");
const UnusedCodeModel = require("../models/UnusedCode");
const UsedCodeModel = require("../models/UsedCode");
const verifyToken = require("../middleware/verifyToken");
const UserModel = require("../models/User");
const CartModel = require("../models/Cart");
const OrderModel=require("../models/Order");
const ProductModel = require("../models/Product");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});




router.post("/create-user-order",verifyToken,[
    body("coupon_code").isString().withMessage("Invalid Coupon Code").optional()
],async(req,res)=>{
    try {

        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }
        
        const {coupon_code}=req.body

        const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }

        let total_amount=0
        let items=[]


        const cart_data=await CartModel.find({user_id:exist_user._id})
        if(cart_data.length===0){
            return res.status(400).json({message:"Cart is Empty",success:false})
        }

        await Promise.all( cart_data.map((ele)=>{
         
            
            total_amount+=ele.product_price * ele.quantity
            items.push(`${ele.product_title} x ${ele.quantity}`)

        }))

        const mynotes={}

        await Promise.all( items.map((ele,index)=>{
            console.log(ele);
            
            mynotes[`key${index+1}`]=ele
        }))


        let final_discount=0

        if(coupon_code){

            const exist_coupon=await UnusedCodeModel.findOne({code:coupon_code})
            if(!exist_coupon){
                return res.status(400).json({message:"Invalid Coupon Code",success:false})
            }

            const exist_used_coupon=await UsedCodeModel.findOne({code:coupon_code})
            if(exist_used_coupon){
                return res.status(400).json({message:"Coupon Code Already Used",success:false})
            }

            
            const discount_price=(total_amount*exist_coupon.discount)/100
            if(discount_price>exist_coupon.maxDiscount){
                final_discount=exist_coupon.maxDiscount
            }

        }

        
        const order= await instance.orders.create({
  amount: (total_amount - final_discount) * 100,
  currency: "INR",
  notes: mynotes
})


return res.status(200).json({message:"Order Created Successfully",success:true,order})
        
    } catch (error) {
        
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
})


router.post("/verify-user-order",verifyToken,[
body("razorpay_order_id").isString().withMessage("Invalid Order ID"),
body("razorpay_payment_id").isString().withMessage("Invalid Payment ID"),
body("razorpay_signature").isString().withMessage("Invalid Signature"),
body("name").isString().withMessage("Invalid Name"),
body("email").isEmail().withMessage("Invalid Email"),
body("mobile_no").isMobilePhone("en-IN").withMessage("Invalid Phone Number"),
body("address").isString().withMessage("Invalid Address"),,
body("city").isString().withMessage("Invalid City"),
body("state").isString().withMessage("Invalid State"),
body("pincode").isNumeric().withMessage("Invalid Pincode"),
body("total_amount").isNumeric().withMessage("Invalid Total Amount"),

],async(req,res)=>{
    try {
        
        console.log(req.body);
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,name,email,mobile_no,address,city,state,pincode,total_amount}=req.body
     const flag=validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id },razorpay_signature, process.env.RAZORPAY_SECRET);

     if(!flag){
        return res.status(400).json({message:"Invalid Transaction",success:false})
     }


     const cart_data=await CartModel.find({user_id:exist_user._id})
     if(cart_data.length===0){
        return res.status(400).json({message:"Cart is Empty",success:false})
     }


   
   const orderdetails=cart_data.map((ele)=>{
    
    return {
        product_id:ele.product_id,
        product_title:ele.product_title,
        product_price:ele.product_price,
        product_image:ele.product_image,
        product_quantity:ele.quantity
    }
   })


   const newOrder=new OrderModel({
    user_id:exist_user._id,
    name:name,
    email:email,
    mobile_no:mobile_no,
    address:address,
    city:city,
    state:state,
    pincode:pincode,
    total_amount:total_amount,
    order_details:orderdetails,
    razorpay_payment_id:razorpay_payment_id,
    razorpay_order_id:razorpay_order_id,
    razorpay_signature:razorpay_signature
   })
  

   await newOrder.save()
   cart_data.map(async(ele)=>{
    
    const updateProductStock=await ProductModel.findOneAndUpdate({_id:ele.product_id},{$inc:{stock:-ele.quantity}})
   })
   await CartModel.deleteMany({user_id:exist_user._id})
    



      return res.status(200).json({message:"Payment Successfull",success:true})
    } catch (error) {
        
     return res.status(500).json({message:"Internal Server Error",success:false})
    }
})


router.post("/fetch-all-orders",verifyToken,[
     body("search").isString().withMessage("Invalid Search").isLength({max:50}).withMessage("Search Value is not longer than 50 Characters").optional(),
        body("skip").isInt().withMessage("Invalid Skip Value"),
],async(req,res)=>{
    try {
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {search,skip}=req.body
      
        const TotalDocuments=await OrderModel.countDocuments()
        
        if(!search || search===""){
            const data=await OrderModel.find({}).sort({_id:-1}).skip(skip).limit(100)
            return res.status(200).json({message:"Orders Fetched Successfully",success:true,data:data,count:TotalDocuments})
        }

        const data=await OrderModel.find({"$text":{"$search":`"${search}"`}}).sort({_id:-1}).skip(skip).limit(100)
        return res.status(200).json({message:"Orders Fetched Successfully",success:true,data:data,count:TotalDocuments})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
})

module.exports=router
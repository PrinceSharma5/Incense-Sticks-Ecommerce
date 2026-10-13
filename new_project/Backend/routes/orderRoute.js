const Razorpay=require("razorpay")
const express=require("express")
const router=express.Router()
var { validatePaymentVerification } = require('razorpay/dist/utils/razorpay-utils');
const { body, validationResult } = require("express-validator");
const UnusedCodeModel = require("../models/UnusedCode");
const UsedCodeModel = require("../models/UsedCode");
const verifyToken = require("../middleware/verifyToken");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const UserModel = require("../models/User");
const CartModel = require("../models/Cart");
const OrderModel=require("../models/Order");
const ProductModel = require("../models/Product");
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_ID,
  key_secret: process.env.RAZORPAY_SECRET,
});




router.get("/fetch-my-orders", verifyToken, async (req, res) => {
    try {
        const orders = await OrderModel.find({ user_id: req.token._id })
            .select("_id name email mobile_no address city state pincode razorpay_payment_id order_details total_amount createdAt")
            .sort({ createdAt: -1 })
            .limit(5)
            .lean()

        const data = orders.map((order) => ({
            _id: String(order._id),
            name: order.name,
            email: order.email,
            mobile_no: order.mobile_no,
            address: order.address,
            city: order.city,
            state: order.state,
            pincode: order.pincode,
            razorpay_payment_id: order.razorpay_payment_id,
            total_amount: order.total_amount,
            createdAt: order.createdAt,
            order_details: (order.order_details || []).map((item) => ({
                product_title: item.product_title,
                product_quantity: item.product_quantity,
            })),
        }))

        return res.status(200).json({
            message: "Your recent orders were fetched successfully",
            success: true,
            data,
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({ message: "Internal Server Error", success: false })
    }
})

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


        const cart_data=await CartModel.find({user_id:exist_user._id})
        if(cart_data.length===0){
            return res.status(400).json({message:"Cart is Empty",success:false})
        }

        const currentProducts=await ProductModel.find({
            _id:{$in:cart_data.map((item)=>item.product_id)},
        }).select("_id title stock")
        const productById=new Map(currentProducts.map((product)=>[String(product._id),product]))
        for(const item of cart_data){
            const product=productById.get(String(item.product_id))
            if(!product){
                return res.status(409).json({message:`${item.product_title} is no longer available`,success:false})
            }
            if(product.stock<item.quantity){
                return res.status(409).json({message:`Only ${product.stock} unit(s) of ${product.title} are currently in stock`,success:false})
            }
        }

        cart_data.forEach((ele)=>{
            total_amount+=ele.product_price * ele.quantity
        })

        const mynotes={ user_id: String(exist_user._id) }


        let final_discount=0

        if(coupon_code){

            const normalizedCoupon=String(coupon_code).trim()
            const exist_coupon=await UnusedCodeModel.findOne({name:normalizedCoupon})
            if(!exist_coupon){
                return res.status(400).json({message:"Invalid Coupon Code",success:false})
            }

            const exist_used_coupon=await UsedCodeModel.findOne({name:normalizedCoupon,user_id:exist_user._id})
            if(exist_used_coupon){
                return res.status(400).json({message:"Coupon Code Already Used",success:false})
            }

            
            const discount_price=(total_amount*exist_coupon.discount)/100
            final_discount=Math.min(discount_price,exist_coupon.maxDiscount,total_amount)
            mynotes.coupon_name=normalizedCoupon
            mynotes.coupon_discount=String(exist_coupon.discount)
            mynotes.coupon_max_discount=String(exist_coupon.maxDiscount)

        }

        const tax_amount=Math.round(total_amount*0.05)
        const amount_in_rupees=total_amount+tax_amount-final_discount
        const amount_in_paise=Math.round(amount_in_rupees*100)
        if(!Number.isSafeInteger(amount_in_paise) || amount_in_paise<=0){
            return res.status(400).json({message:"The cart total is invalid",success:false})
        }

        const order= await instance.orders.create({
  amount: amount_in_paise,
  currency: "INR",
  notes: mynotes
})


return res.status(200).json({
    message:"Order Created Successfully",
    success:true,
    order,
    pricing:{subtotal:total_amount,tax:tax_amount,discount:final_discount,total:amount_in_paise/100}
})
        
    } catch (error) {
        const gatewayMessage=error?.error?.description
        const networkFailure=!error?.response && !gatewayMessage
        const message=networkFailure
            ? "The server could not connect to Razorpay. Check its internet connection and try again."
            : gatewayMessage || "Razorpay could not create a payment order. Please try again."
        console.error("Razorpay order creation failed:",message)
        return res.status(502).json({
            message,
            success:false
        })
    }
})


router.post("/verify-user-order",verifyToken,[
body("razorpay_order_id").isString().withMessage("Invalid Order ID"),
body("razorpay_payment_id").isString().withMessage("Invalid Payment ID"),
body("razorpay_signature").isString().withMessage("Invalid Signature"),
body("name").isString().withMessage("Invalid Name"),
body("email").isEmail().withMessage("Invalid Email"),
body("mobile_no").isMobilePhone("en-IN").withMessage("Invalid Phone Number"),
body("address").isString().withMessage("Invalid Address"),
body("city").isString().withMessage("Invalid City"),
body("state").isString().withMessage("Invalid State"),
body("pincode").isNumeric().withMessage("Invalid Pincode"),

],async(req,res)=>{
    try {
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const exist_user=await UserModel.findOne({_id:req.token._id})
        if(!exist_user){
            return res.status(400).json({message:"Invalid Authentication",success:false})
        }
        const {razorpay_order_id,razorpay_payment_id,razorpay_signature,name,email,mobile_no,address,city,state,pincode}=req.body
     const flag=validatePaymentVerification({"order_id": razorpay_order_id, "payment_id": razorpay_payment_id },razorpay_signature, process.env.RAZORPAY_SECRET);

     if(!flag){
        return res.status(400).json({message:"Invalid Transaction",success:false})
     }

     const [razorpayOrder,razorpayPayment]=await Promise.all([
        instance.orders.fetch(razorpay_order_id),
        instance.payments.fetch(razorpay_payment_id),
     ])
     if(
        String(razorpayOrder.notes?.user_id)!==String(exist_user._id) ||
        razorpayPayment.order_id!==razorpay_order_id ||
        razorpayPayment.amount!==razorpayOrder.amount ||
        razorpayPayment.currency!==razorpayOrder.currency
     ){
        return res.status(400).json({message:"Payment details do not match this order",success:false})
     }

     const priorOrder=await OrderModel.findOne({
        razorpay_order_id,
        user_id:exist_user._id,
     }).select("_id name email mobile_no address city state pincode total_amount razorpay_payment_id createdAt").lean()
     if(priorOrder){
        return res.status(200).json({message:"Payment already verified",success:true,order:priorOrder})
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
    total_amount:razorpayOrder.amount/100,
    order_details:orderdetails,
    razorpay_payment_id:razorpay_payment_id,
    razorpay_order_id:razorpay_order_id,
    razorpay_signature:razorpay_signature
   })
  

   await newOrder.save()
   await Promise.all(cart_data.map((ele)=>
    ProductModel.findOneAndUpdate({_id:ele.product_id},{$inc:{stock:-ele.quantity}})
   ))
   if(razorpayOrder.notes?.coupon_name){
    await UsedCodeModel.updateOne(
        {user_id:exist_user._id,name:razorpayOrder.notes.coupon_name},
        {$setOnInsert:{
            user_id:exist_user._id,
            name:razorpayOrder.notes.coupon_name,
            discount:Number(razorpayOrder.notes.coupon_discount),
            maxDiscount:Number(razorpayOrder.notes.coupon_max_discount),
        }},
        {upsert:true}
    )
   }
   await CartModel.deleteMany({user_id:exist_user._id})
    



      return res.status(200).json({
        message:"Payment Successful",
        success:true,
        order:{
            _id:String(newOrder._id),
            name:newOrder.name,
            email:newOrder.email,
            mobile_no:newOrder.mobile_no,
            address:newOrder.address,
            city:newOrder.city,
            state:newOrder.state,
            pincode:newOrder.pincode,
            total_amount:newOrder.total_amount,
            razorpay_payment_id:newOrder.razorpay_payment_id,
            createdAt:newOrder.createdAt,
        },
      })
    } catch (error) {
        console.error("Payment verification failed:",error?.error?.description || error?.message)
     return res.status(500).json({message:"Internal Server Error",success:false})
    }
})


router.post("/fetch-all-orders",verifyAdminToken,[
     body("search").isString().withMessage("Invalid Search").isLength({max:50}).withMessage("Search Value is not longer than 50 Characters").optional(),
        body("skip").isInt({min:0}).withMessage("Invalid Skip Value"),
],async(req,res)=>{
    try {
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {search,skip}=req.body
      
        if(!search || search===""){
            const TotalDocuments=await OrderModel.countDocuments()
            const data=await OrderModel.find({}).sort({_id:-1}).skip(skip).limit(100)
            return res.status(200).json({message:"Orders Fetched Successfully",success:true,data:data,count:TotalDocuments})
        }

        const query={"$text":{"$search":`"${search}"`}}
        const [data,TotalDocuments]=await Promise.all([
            OrderModel.find(query).sort({_id:-1}).skip(skip).limit(100),
            OrderModel.countDocuments(query),
        ])
        return res.status(200).json({message:"Orders Fetched Successfully",success:true,data:data,count:TotalDocuments})
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
})

module.exports=router

const { validationResult } = require("express-validator");
const AdminModel = require("../models/Admin");
const UnusedCodeModel = require("../models/UnusedCode");

const create_new_coupon_code = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array()[0].msg, success: false });
    }

    const {name,discount,maxDiscount}=req.body
    const exist_admin=await AdminModel.findOne({_id:req.token._id})
    if(!exist_admin){
        return res.status(400).json({message:"Invalid Authentication",success:false})
    }

    const exist_coupon_code=await UnusedCodeModel.findOne({name:name})
    if(exist_coupon_code){
        return res.status(400).json({message:"Coupon code already exist",success:false})
    }

    const new_coupon_code=await UnusedCodeModel.create({
        name:name,
        discount:discount,
        maxDiscount:maxDiscount
    })

    return res.status(200).json({message:"Coupon code created successfully",success:true})

  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};



const delete_exist_coupon_code=async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res
        .status(400)
        .json({ message: errors.array()[0].msg, success: false });
    }

    const {_id}=req.body
    const exist_admin=await AdminModel.findOne({_id:req.token._id})
    if(!exist_admin){
        return res.status(400).json({message:"Invalid Authentication",success:false})
    }

    const exist_coupon_code=await UnusedCodeModel.findOne({_id:_id})
    if(!exist_coupon_code){
        return res.status(400).json({message:"Coupon code not found",success:false})
    }


    await UnusedCodeModel.deleteOne({_id:_id})

    return res.status(200).json({message:"Coupon code deleted successfully",success:true})

  
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
};



const fetch_Coupon_code=async(req,res)=>{
  try {
    
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        return res.status(400).json({message:errors.array()[0].msg,success:false})
    }

 
    const exist_admin=await AdminModel.findOne({_id:req.token._id})
    if(!exist_admin){
        return res.status(400).json({message:"Invalid Authentication",success:false})
    }

    const data=await UnusedCodeModel.find().sort({_id:-1})

    return res.status(200).json({message:"Coupon code fetched successfully",success:true,data:data})
    
  } catch (error) {
    
    return res
      .status(500)
      .json({ message: "Internal Server Error", success: false });
  }
}




module.exports={
    create_new_coupon_code,
    delete_exist_coupon_code,
    fetch_Coupon_code
}
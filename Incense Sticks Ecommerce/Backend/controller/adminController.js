

const AdminModel = require("../models/Admin");
const { validationResult } = require("express-validator");

const jwt = require("jsonwebtoken");

const bcrypt = require('bcrypt');



const create_new_admin=async(req,res)=>{

    try {
        
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

        const {name,email,mobile_no,password,confirm_password}=req.body

        const exist_email=await AdminModel.findOne({email:email})
        if(exist_email){
            return res.status(400).json({message:"Email Already Exists",success:false})
        }


          

        const exist_mobile=await AdminModel.findOne({mobile_no:mobile_no})
        if(exist_mobile){
            return res.status(400).json({message:"Mobile Number Already Exists",success:false})
        }

        if(password!==confirm_password){
            return res.status(400).json({message:"Password Does Not Match",success:false})
        }

        const saltRounds = 15;
        const salt = bcrypt.genSaltSync(saltRounds);
       const encrypted_password= await bcrypt.hash(password, salt)

       const newAdmin=new AdminModel({
        name:name,
        email:email,
        mobile_no:mobile_no,
        password:encrypted_password,
        loginHistory:Date.now()
       })
         await newAdmin.save()
        return res.status(200).json({message:"Admin Created Successfully",success:true})

    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}



const login_admin=async(req,res)=>{
    try {

            const errors=validationResult(req)
        if(!errors.isEmpty()){
            return res.status(400).json({message:errors.array()[0].msg,success:false})
        }

 const {email,password}=req.body


      const exist_email=await AdminModel.findOne({email:email})
        if(!exist_email){
            return res.status(400).json({message:"Email Not Found",success:false})
        }

      const isMatch= await bcrypt.compare(password, exist_email.password)
      if(!isMatch){

      return res.status(400).json({message:"Password Does Not Match",success:false})
      }
      const token = jwt.sign({ _id: exist_email._id,admin_name:exist_email.name }, process.env.SECRET_KEY);

      exist_email.loginHistory.push(Date.now())
      await exist_email.save()
      return res.status(200).json({message:"Logged In Successfully",success:true,token})

        
    } catch (error) {
        console.log(error);
        
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


module.exports={create_new_admin,login_admin}
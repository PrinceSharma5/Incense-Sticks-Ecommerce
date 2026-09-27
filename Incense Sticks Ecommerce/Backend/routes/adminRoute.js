
const express = require("express");

const { body } = require("express-validator");
const router = express().router


const { login_admin, create_new_admin } = require("../controller/adminController");

router.post("/create-new-admin",[
    body("name").isLength({min:2,max:26}).withMessage("Name Should be between 2 to 26 characters"),
    body("email").isEmail().withMessage("Please enter a valid email"),
    body("mobile_no").isMobilePhone("en-IN").withMessage("Please enter a valid mobile number"),
    body("password").isStrongPassword().withMessage("Password Must be Strong"),
    body("confirm_password").isStrongPassword().withMessage("Confirm Password Must be Strong & Same"),

],create_new_admin)


router.post("/admin-login",[
       body("email").isEmail().withMessage("Please enter a valid email"),
    body("password").isStrongPassword().withMessage("Password Must be Strong"),
],login_admin)


module.exports=router
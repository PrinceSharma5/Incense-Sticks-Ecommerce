
const express = require("express");

const { body } = require("express-validator");

const router = express().router


const { create_new_user, generate_otp, login_user } = require("../controller/userController");


router.post("/create-new-user",[
    body("email").isEmail().withMessage("Invalid Email"),
    body("otp").isInt().withMessage("Invalid OTP"),
    body("password").isStrongPassword().withMessage("Password Must be Strong"),
    body("confirm_password").isStrongPassword().withMessage("Confirm Password Must be Strong & Same"),
],create_new_user)


router.post("/generate-otp-by-user",
     [body("email").isEmail().withMessage("Invalid Email")]
     ,generate_otp)



router.post("/login-user",[
      body("email").isEmail().withMessage("Invalid Email"),

    body("password").isStrongPassword().withMessage("Password Must be Strong"),
],login_user)


module.exports=router
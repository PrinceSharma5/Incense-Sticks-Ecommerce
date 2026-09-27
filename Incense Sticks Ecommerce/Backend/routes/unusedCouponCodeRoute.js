const { body } = require("express-validator");

const express=require("express");
const verifyToken = require("../middleware/verifyToken");
const router=express.Router()

const { create_new_coupon_code,
    delete_exist_coupon_code,
    fetch_Coupon_code}=require("../controller/unusedController")



router.post("/create-new-coupon-code",verifyToken,[
    body("name").notEmpty().isLength({min:3,max:26}).withMessage("Coupon Must Be Above 3 and Below 26 Character"),
    body("discount").isNumeric().withMessage("Invalid Discount"),
    body("maxDiscount").isNumeric().withMessage("Invalid Max Discount"),
],create_new_coupon_code)


router.delete("/delete-specific-coupon-code",verifyToken,[
    body("_id").isMongoId().withMessage("Invalid Product id"),
],delete_exist_coupon_code)


router.post("/fetch-coupon-codes",verifyToken,fetch_Coupon_code)


module.exports=router

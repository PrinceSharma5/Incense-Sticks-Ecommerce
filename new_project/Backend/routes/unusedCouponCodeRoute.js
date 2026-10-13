const { body } = require("express-validator");

const express=require("express");
const verifyAdminToken = require("../middleware/verifyAdminToken");
const router=express.Router()

const { create_new_coupon_code,
    delete_exist_coupon_code,
    fetch_Coupon_code}=require("../controller/unusedController")



router.post("/create-new-coupon-code",verifyAdminToken,[
    body("name").notEmpty().isLength({min:3,max:26}).withMessage("Coupon Must Be Above 3 and Below 26 Character"),
    body("discount").isFloat({gt:0,max:100}).withMessage("Invalid Discount"),
    body("maxDiscount").isFloat({gt:0}).withMessage("Invalid Max Discount"),
],create_new_coupon_code)


router.delete("/delete-specific-coupon-code",verifyAdminToken,[
    body("_id").isMongoId().withMessage("Invalid Product id"),
],delete_exist_coupon_code)


router.post("/fetch-coupon-codes",verifyAdminToken,fetch_Coupon_code)


module.exports=router

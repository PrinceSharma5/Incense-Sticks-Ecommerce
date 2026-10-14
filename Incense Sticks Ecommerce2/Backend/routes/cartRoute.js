

const express=require("express")
const verifyToken = require("../middleware/verifyToken")
const { body } = require("express-validator")
const { add_to_cart, remove_from_cart, fetch_cart_products, reduce_cart_quantity } = require("../controller/cartController")
const router=express.Router()


router.post("/add-to-cart",verifyToken,[
    body("product_id").isMongoId().withMessage("Invalid Product id"),
    body("quantity").isInt().withMessage("Invalid Quantity"),
],add_to_cart)

router.post("/reduce-from-cart",verifyToken,[
    body("product_id").isMongoId().withMessage("Invalid Product id"),
    body("quantity").isInt().withMessage("Invalid Quantity"),
],reduce_cart_quantity)


router.delete("/remove-from-cart",verifyToken,[
    body("product_id").isMongoId().withMessage("Invalid Product id"),
],remove_from_cart)



router.get("/fetch-cart-products",verifyToken,fetch_cart_products)
module.exports=router
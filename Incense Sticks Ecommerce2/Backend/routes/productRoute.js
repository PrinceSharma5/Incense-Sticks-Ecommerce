const express=require("express")
const upload = require("../middleware/uploadsProductsFiles");
const verifyToken = require("../middleware/verifyToken");
const { body } = require("express-validator");
const {  add_new_product,
  fetch_all_products,
  delete_specific_product,
  update_product_details,
  update_my_product_images,
  fetch_data_with_category,
  fetch_specific_product}=require("../controller/productController")



const router=express.Router()



router.post("/add-new-product",verifyToken,upload.array("my-files",4),[
   body("title").isString().withMessage("Invalid Title").isLength({min:26,max:150}).withMessage("Title must be under 26 to 150 Characters"),
   body("brand_name").isString().withMessage("Invalid Brand Name").isLength({min:3,max:50}).withMessage("Brand Name must be under 5 to 50 Characters"),
   body("category").isString().withMessage("Invalid Category").isLength({min:3,max:50}).withMessage("Category must be under 5 to 50 Characters"),
   body("fragnance_type").isString().withMessage("Invalid Fragnance Type").isLength({min:3,max:150}).withMessage("Fragnance Type must be under 5 to 150 Characters"),
   body("mrp").isNumeric().withMessage("Invalid MRP"),
   body("discount").isNumeric().withMessage("Invalid Discount"),
   body("actual_price").isNumeric().withMessage("Invalid Actual Price"),
   body("stock").isNumeric().withMessage("Invalid Actual Stock"),
   body("description").isString().withMessage("Invalid Description").isLength({min:26,max:350}).withMessage("Description must be under 26 to 350 Characters"),

   body("burning_time").isString().withMessage("Invalid Burning Time").isLength({min:3,max:50}).withMessage("Burning Time must be under 3 to 50 Characters"),
   body("weight").isString().withMessage("Invalid Weight"),
    body("material").isString().withMessage("Invalid Material").isLength({min:3,max:150}).withMessage("Material Type must be under 5 to 150 Characters"),

],add_new_product)



router.post("/fetch-all-products",[
        body("search").isString().withMessage("Invalid Search").isLength({max:50}).withMessage("Search Value is not longer than 50 Characters").optional(),
        body("skip").isInt().withMessage("Invalid Skip Value"),
         body("category").isString().withMessage("Invalid Category").isLength({min:3,max:50}).withMessage("Category must be under 5 to 50 Characters").optional(),
],fetch_all_products)



router.delete("/delete-specific-product",verifyToken,[
    body("_id").isMongoId().withMessage("Invalid Product id"),
],delete_specific_product)



router.put("/update-my-product-details",verifyToken,[
    body("_id").isMongoId().withMessage("Invalid Product id"),
       body("title").isString().withMessage("Invalid Title").isLength({min:26,max:150}).withMessage("Title must be under 26 to 150 Characters"),
   body("brand_name").isString().withMessage("Invalid Brand Name").isLength({min:3,max:50}).withMessage("Brand Name must be under 5 to 50 Characters"),
   body("category").isString().withMessage("Invalid Category").isLength({min:3,max:50}).withMessage("Category must be under 5 to 50 Characters"),
   body("fragnance_type").isString().withMessage("Invalid Fragnance Type").isLength({min:3,max:150}).withMessage("Fragnance Type must be under 5 to 150 Characters"),
   body("mrp").isNumeric().withMessage("Invalid MRP"),
   body("discount").isNumeric().withMessage("Invalid Discount"),
   body("actual_price").isNumeric().withMessage("Invalid Actual Price"),
   body("stock").isNumeric().withMessage("Invalid Actual Stock"),
   body("description").isString().withMessage("Invalid Description").isLength({min:26,max:350}).withMessage("Description must be under 26 to 350 Characters"),

   body("burning_time").isString().withMessage("Invalid Burning Time").isLength({min:3,max:50}).withMessage("Burning Time must be under 3 to 50 Characters"),
   body("weight").isString().withMessage("Invalid Weight"),
    body("material").isString().withMessage("Invalid Material").isLength({min:3,max:150}).withMessage("Material Type must be under 5 to 150 Characters"),

],update_product_details)

router.put("/update-my-product-images",verifyToken,upload.single('my-file'),[
    body("_id").isMongoId().withMessage("Invalid Product id"),
    body("index").isInt().withMessage("Invalid Index"),
],update_my_product_images)



router.post("/fetch-data-with-category",fetch_data_with_category)

router.post("/fetch-specific-product",[
    body("_id").isMongoId().withMessage("Invalid Product id"),
],fetch_specific_product)

module.exports=router
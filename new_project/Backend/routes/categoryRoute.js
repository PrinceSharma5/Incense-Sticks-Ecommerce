const { body } = require("express-validator");

const verifyAdminToken = require("../middleware/verifyAdminToken");

const express=require("express");
const { create_new_category, fetch_all_categories, update_category, delete_category } = require("../controller/categoryController");
const router=express.Router()


router.post("/add-new-cartegory",verifyAdminToken,[
    body("name").notEmpty().withMessage("Category name is required"),
],create_new_category)



router.get("/fetch-all-categories",fetch_all_categories)

router.put("/update-specific-category",verifyAdminToken,[
    body("_id").isMongoId().withMessage("Invalid category id"),
    body("name").notEmpty().withMessage("Category name is required"),
],update_category)


router.delete("/delete-specific-category",verifyAdminToken,[
    body("_id").isMongoId().withMessage("Invalid category id"),
],delete_category)


module.exports=router

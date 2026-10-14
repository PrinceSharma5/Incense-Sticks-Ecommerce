const multer = require('multer')
const path=require('path')
const fs=require('fs')

const {v4}=require("uuid")

const uploadDir=path.join(process.cwd(),"statics","product_images")
const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    if(!fs.existsSync(uploadDir)){
        fs.mkdirSync(uploadDir)
    }
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    
    const extension=path.extname(file.originalname)
    cb(null,  Date.now() + v4() + extension)
  }
})

const upload = multer({ storage: storage })

module.exports=upload



const jwt = require('jsonwebtoken');



const verifyToken=async(req,res,next)=>{
    const token=req.header("token")
    if(!token){
        return res.status(401).json({message:"Please log in to continue",success:false})
    }

    try {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        req.token=decoded
        next()

    } catch (error) {
        return res.status(401).json({message:"Your session has expired. Please log in again.",success:false})
    }
}


module.exports=verifyToken




const jwt = require('jsonwebtoken');



const verifyToken=async(req,res,next)=>{
    try {

        const token=req.header("token")
        if(!token){
            return res.status(403).json({message:"Access Denied",success:false})
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if(!decoded){
            return res.status(403).json({message:"Invalid Token",success:false})
        }
        req.token=decoded
        next()

    } catch (error) {
        console.log(error);
        return res.status(500).json({message:"Internal Server Error",success:false})
    }
}


module.exports=verifyToken
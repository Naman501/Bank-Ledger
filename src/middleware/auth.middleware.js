const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
require('dotenv').config()

async function  authMiddleWare(req,res,next){
    const token=req.cookies.token || req.headers.authorization.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access,token is INVALID."
        })
    }

    try {
        
        const decoded=jwt.verify(token,process.env.JWT_SECRET)

        const user=await userModel.findOne({_id:decoded.userId})

        req.user=user
        next()

    } catch (error) {
        console.log("Token authorization error",error)
        return res.status(401).json({
            message:"Unauthorized access,invalid Token"
        })
    }
}

async function authSystemUserMiddleware(req,res,next){
 
    const token=req.cookies.token || req.headers.authorization?.split(" ")[ 1 ]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized Access!Token not found"
        })
    }
    try {
        const decoded=jwt.verify(token,process.env.JWT)
        const user=await userModel.findById(decoded.userId).select("+systemUser")

        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden Access!!Not a system user"
            })
        }
        req.user=user
        return next()
    } catch (error) {
        console.error("not a system User")
        res.status(401).json({
            message:"Unauthorized Access, token is inavlid."
        })
    }
}






module.exports={
    authMiddleWare ,
    authSystemUserMiddleware
}
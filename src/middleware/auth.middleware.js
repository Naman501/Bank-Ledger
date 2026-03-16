const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const tokenBlackListModel=require('../models/blackList.model')
require('dotenv').config()

async function  authMiddleWare(req,res,next){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(401).json({
            message:"Unauthorized access,token is INVALID."
        })
    }


    const isBlackListed=await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized!"
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

    const isBlackListed=await tokenBlackListModel.findOne({token})

    if(isBlackListed){
        return res.status(401).json({
            message:"Unauthorized!"
        })
    }

    try {
        const decoded=jwt.verify(token,process.env.JWT_SECRET)
        const user=await userModel.findById(decoded.userId).select("+systemUser")
        console.log("check system user",user)
        if(!user.systemUser){
            return res.status(403).json({
                message:"Forbidden Access!!Not a system user"
            })
        }
        req.user=user
        return next()
    } catch (error) {
        console.error("Not a system User")
       return res.status(401).json({
            message:"Unauthorized Access, token is invalid."
        })
    }
}






module.exports={
    authMiddleWare ,
    authSystemUserMiddleware
}
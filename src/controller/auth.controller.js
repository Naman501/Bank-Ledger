const userModel=require('../models/user.model')
const jwt=require('jsonwebtoken')
const emailService=require("../services/email.service")
const tokenBlackListModel=require("../models/blackList.model")

// POST /api/auth/register

async function userRegisterController(req,res){
const {name,email,password}=req.body

const isExists=await userModel.findOne({email})

if(isExists){
    return res.status(422).json({
        message:"User already exists with email",
        status:"failed"
    })
}

const user=await userModel.create({
    email,password,name
})

const token=jwt.sign(
    {userId:user._id},process.env.JWT_SECRET,{expiresIn:"70d"}
)
res.cookie("token",token)

res.status(201).json({
    user:{
        _id:user._id,
        email:user.email,
        name:user.name
    },
    token
})

// await emailService.send

}


// POST /api/auth/login

async function userLoginController(req,res){
const {email,password}=req.body
const user =await userModel.findOne({email}).select("+password")
console.log(user)
if(!user){
    return res.status(401).json({
        message:"Email or password is incorrect"
    })
}
const isvalidPassword=await user.comparePassword(password)

if(!isvalidPassword){
return  res.status(401).json({
        message:"Email or password is incorrect"
    })
}
const token=jwt.sign(
    {userId:user._id},process.env.JWT_SECRET,{expiresIn:"70d"}
)
res.cookie("token",token)

res.status(200).json({
    user:{
        _id:user._id,
        email:user.email,
        name:user.name
    },
    token
})
// console.log('HELLO',user.email)
await emailService.sendingRegistrationEmail(user.name,user.email)
}

// api/auth/logout

async function userLogoutController(req,res){
    const token=req.cookies.token || req.headers.authorization?.split(" ")[1]

    if(!token){
        return res.status(400).json({
            message:"User logged out successfully!"
        })
    }

    
    await tokenBlackListModel.create({
        token:token
    })
    
    res.clearCookie("token")
     
    return res.status(200).json({
        message:"User Logout Successful!"
    })
}


module.exports={userRegisterController,userLoginController,userLogoutController}
const express=require('express')
const accountController =require('../controller/account.controller')
const authMiddleWare=require('../middleware/auth.middleware')
const router=express.Router()


// POST  /api/accounts
router.post('/',authMiddleWare.authMiddleWare,accountController.createAccountController)

module.exports=router
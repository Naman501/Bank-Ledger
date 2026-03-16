const express=require('express')
const accountController =require('../controller/account.controller')
const authMiddleWare=require('../middleware/auth.middleware')
const router=express.Router()


// POST  /api/accounts
router.post('/',authMiddleWare.authMiddleWare,accountController.createAccountController)


// GET accounts

router.get('/',authMiddleWare.authMiddleWare,accountController.getUserAccountsController)


// GET /api/accounts/balance/:accountId

router.get('/balance/:accountId',authMiddleWare.authMiddleWare,accountController.getAccountBalanceController)


module.exports=router
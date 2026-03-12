const express=require('express')
const authMiddleware=require('../middleware/auth.middleware')
const transactionController=require('../controller/transaction.controller')
const router=express.Router()



// POST api/transactions => create new transaction

router.post('/',authMiddleware.authMiddleWare,transactionController.createTransaction)

// POST /api/transactions/system/intial-funds

router.post('/system/intial-funds',authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

module.exports=router
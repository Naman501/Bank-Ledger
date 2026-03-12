// * 1. Validate request
// * 2. Validate idempotency key
// * 3. Check account status
// * 4. Derive sender balance from ledger
// * 5. Create transaction (PENDING)
// * 6. Create DEBIT ledger entry
// * 7. Create CREDIT ledger entry
// * 8. Mark transaction COMPLETED
// * 9. Commit MongoDB session
// * 10. Send email notification


const accountModel=require('../models/account.model')
const ledgerModel=require('../models/ledger.model')
const transactionModel=require('../models/transactiion.model')
const mongoose=require('mongoose')
const emailService=require('../services/email.service')

// 1. Validate Request
async function createTransaction(req,res) {
    const {fromAccount,toAccount,amount,idempotencyKey}=req.body

    if(!fromAccount || !toAccount || !amount || !idempotencyKey){
     return res.status(400).json({
            message:"Missing details"
        })
    }

    const fromUserAccount= await accountModel.findOne({
        _id:fromAccount
    })
    const toUserAccount=await accountModel.findOne({
        _id:toAccount
    })

    if(!fromUserAccount || !toUserAccount){
        console.log("status user currency =>",fromAccount.status,fromAccount.user,fromAccount.currency)
        return res.status(400).json({
            message:"Invalid fromAccount or UserAccount"
        })
    }

// * 2. Validate idempotency key
const isTransactionAlreadyExisting=await transactionModel.findOne({
        idempotencyKey:idempotencyKey
            })

            if(isTransactionAlreadyExisting){
               
                if(isTransactionAlreadyExisting.status==="COMPLETED"){
              return  res.status(200).json({
                    message:"Transaction Already Processed."
                })
               }
               
                  if(isTransactionAlreadyExisting.status==="PENDING"){
               return res.status(200).json({
                    message:"Transaction is stil processing."
                })
               }

                  if(isTransactionAlreadyExisting.status==="FAILED"){
              return  res.status(500).json({
                message:"Transaction processing failed, please retry."
                })
               }
               
                  if(isTransactionAlreadyExisting.status==="REVERSED"){
              return  res.status(200).json({
                    message:"Transaction processingwas  reversed, please retry."
                })
               }
            }

        // * 3. Check account status
      if(fromUserAccount.status !== "ACTIVE" || toUserAccount.status !=="ACTIVE"){
      return  res.status(400).json({
        message:"Both from Account and toAccount must be ACTIVE to process transaction"
      })
      }


        // * 4. Derive sender balance from ledger

         const balance=await fromUserAccount.getbalance()

         if(balance<amount){
            res.status(400).json({
                message:`Insufficient balance.Current Blance is ${balance}.Requested amount is ${amount} `
            })
         }

// * 5. Create transaction (PENDING)

         const session=await mongoose.startSession()
         session.startTransaction()

         const transaction=await transactionModel.create({
            fromAccount,
            toAccount,
            amount,
            idempotencyKey,
            status:"PENDING"
         },{session})
        
// * 6. Create DEBIT ledger entry

            const debitLedgerEntry= await ledgerModel.create({
                account:fromAccount,
                amount:amount,
                transaction:transaction._id,
                type:"DEBIT"
            },{session})
           

// * 7. Create CREDIT ledger entry
   const creditLedgerEntry= await ledgerModel.create({
                account:toAccount,
                amount:amount,
                transaction:transaction._id,
                type:"CREDIT"
            },{session})
    
    
        // * 8. Mark transaction COMPLETED
        transaction.status="COMPLETED"
        await transaction.save({session})

        // * 9. Commit MongoDB session
            await session.commitTransaction()
            session.endSession()


        // * 10. Send email notification

        await emailService.sendingTransactionEmail(
        req,user.name, req.user.email,amount,toAccount
        )


res.status(201).json({
    message:"Transaction completed successfully",
    transaction:transaction
})
}




async function createInitialFundsTransaction(req,res){
    const { toAccount , amount , idempotencyKey }=req.body

}

module.exports={createTransaction,createInitialFundsTransaction}
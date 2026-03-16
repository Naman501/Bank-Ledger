const mongoose=require('mongoose')

const LedgerSchema=new mongoose.Schema({
    account:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Account",
        required:[true,"Ledger must be associated with an account."]
        ,index:true,
        immutable:true
    },
    amount:{
        type:Number,
        immutable:true,
        required:[true,"Amount is required for creating a ledger entry."]
    },
    transaction:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Transaction',
        index:true,
        immutable:true,
        required:[true,"Ledger must be associated with a transaction."]
    },
    type:{
        type:String, 
        required:[true,"Ledger Type is required."],
        immutable:true,
        enum:{
            values:["CREDIT","DEBIT"],
            message:"Type can either be DEBIT or CREDIT."
        }
    }
},{
    timestamps:true
})

function preventLedgerModificaiton(){
    throw new Error("Ledger entries are immutable and cannot be modified or deleted.")
}
 
LedgerSchema.pre('findOneAndUpdate',preventLedgerModificaiton)
LedgerSchema.pre('updateOne',preventLedgerModificaiton)
LedgerSchema.pre('deleteOne',preventLedgerModificaiton)
LedgerSchema.pre('remove',preventLedgerModificaiton)
LedgerSchema.pre('deleteMany',preventLedgerModificaiton)
LedgerSchema.pre('updateMany',preventLedgerModificaiton)
LedgerSchema.pre('findOneAndDelete',preventLedgerModificaiton)
LedgerSchema.pre('findOneAndReplace',preventLedgerModificaiton)

module.exports=mongoose.model("Ledger",LedgerSchema)
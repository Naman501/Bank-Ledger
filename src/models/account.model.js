const mongoose = require("mongoose");

const ledgerModel=require('../models/ledger.model')

const AccountSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    status: {
      type: String,
      enum: {
        values: ["ACTIVE", "FROZEN", "CLOSED"],
        message: "Status can either be ACTIVE,FROZEN or CLOSED.",
      },
      default: "ACTIVE",
    },

    currency: {
      type: String,
      required: [true, "Currency is requierd for creating an account."],
      default: "INR",
    },
  },
  {
    timestamps: true,
  },
);


AccountSchema.methods.getBalance= async function(){
  const balanceData= await ledgerModel.aggregate([
    {$match :{account :this._id}}, {
      $group:{
        _id:null,
        totalDebit:{
          $sum:{
            $cond:
            [
             { $eq:["$type","DEBIT"]},
            "$amount"
            ,0   
          ]
        }
       },
         totalCredit:{
          $sum:{
            $cond:
            [
             { $eq:["$type","CREDIT"]}
              ,
            "$amount"
            ,0
            ]}}  }
    },
    {
$project:{
  _id:0,
  _balance:{
    $subtract:["$totalCredit","$totalDebit"]
  }
}
    }
  ])

  if(balanceData.length===0){
    console.log("length 0 hai")
    return 0;
  }
  console.log("Balance Data",balanceData)

  return balanceData[0]._balance
}

//COMPOUND INDEX
AccountSchema.index({ user: 1, status: 1 });

module.exports = mongoose.model("Account", AccountSchema);

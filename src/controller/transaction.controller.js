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

const accountModel = require("../models/account.model");
const ledgerModel = require("../models/ledger.model");
const transactionModel = require("../models/transactiion.model");
const mongoose = require("mongoose");
const emailService = require("../services/email.service");

async function createTransaction(req, res) {
  // 1. Validate Request
  
  const { fromAccount, toAccount, amount, idempotencyKey } = req.body;

  if (!fromAccount || !toAccount || !amount || !idempotencyKey) {
    return res.status(400).json({
      message: "Missing details",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    _id: fromAccount,
  });
  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!fromUserAccount || !toUserAccount) {
    console.log(
      "status user currency =>",
      fromAccount.status,
      fromAccount.user,
      fromAccount.currency,
    );
    return res.status(400).json({
      message: "Invalid fromAccount or UserAccount",
    });
  }

  // * 2. Validate idempotency key
  const isTransactionAlreadyExisting = await transactionModel.findOne({
    idempotencyKey: idempotencyKey,
  });

  if (isTransactionAlreadyExisting) {
    if (isTransactionAlreadyExisting.status === "COMPLETED") {
      return res.status(200).json({
        message: "Transaction Already Processed.",
      });
    }

    if (isTransactionAlreadyExisting.status === "PENDING") {
      return res.status(200).json({
        message: "Transaction is stil processing.",
      });
    }

    if (isTransactionAlreadyExisting.status === "FAILED") {
      return res.status(500).json({
        message: "Transaction processing failed, please retry.",
      });
    }

    if (isTransactionAlreadyExisting.status === "REVERSED") {
      return res.status(200).json({
        message: "Transaction processingwas  reversed, please retry.",
      });
    }
  }

  // * 3. Check account status
  if (
    fromUserAccount.status !== "ACTIVE" ||
    toUserAccount.status !== "ACTIVE"
  ) {
    return res.status(400).json({
      message:
        "Both from Account and toAccount must be ACTIVE to process transaction",
    });
  }

  // * 4. Derive sender balance from ledger

  const balance = await fromUserAccount.getBalance();

  if (balance < amount) {
   return res.status(400).json({
      message: `Insufficient balance.Current Blance is ${balance}.Requested amount is ${amount} `,
    });
  }





  // * 5. Create transaction (PENDING)

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = (await transactionModel.create(
  [  {
      fromAccount,
      toAccount,
      amount,
      idempotencyKey,
      status: "PENDING",
    }],{session}))[0]

await (()=>{
  return new Promise((resolve)=>
     setTimeout(resolve,16*1000))
})()


  // * 6. Create DEBIT ledger entry

  const debitLedgerEntry = await ledgerModel.create([
    {
      account: fromAccount,
      amount: amount,
      transaction: transaction._id,
      type: "DEBIT",
    }],
    { session },
  );

  // * 7. Create CREDIT ledger entry
  const creditLedgerEntry = await ledgerModel.create([
    {
      account: toAccount,
      amount: amount,
      transaction: transaction._id,
      type: "CREDIT",
    }],
    { session },
  );

  // * 8. Mark transaction COMPLETED
  transaction.status = "COMPLETED";
  await transaction.save({ session });

  // * 9. Commit MongoDB session
  await session.commitTransaction();
  session.endSession();

  // * 10. Send email notification

  await emailService.sendingTransactionEmail(
    req,
    req.user.name,
    req.user.email,
    amount,
    toAccount,
  );

 return res.status(201).json({
    message: "Transaction completed successfully",
    transaction: transaction,
  });
}

async function createInitialFundsTransaction(req, res) {

  const { toAccount, amount, idempotencyKey } = req.body;

  if (!toAccount || !amount || !idempotencyKey) {
       return  res.status(400).json({
      message: "toAccount, amount and idempotencyKey are required.",
    });
  }

  const toUserAccount = await accountModel.findOne({
    _id: toAccount,
  });

  if (!toUserAccount) {
    return res.status(400).json({
      message: "Invalid toAccount",
    });
  }

  const fromUserAccount = await accountModel.findOne({
    // systemUser: true,
    user: req.user._id,
  });
console.log(fromUserAccount,"from Account")
  if (!fromUserAccount) {
    return res.status(400).json({
      message: "System User Account not found.",
    });
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  const transaction = await transactionModel.create({
    fromAccount: fromUserAccount._id,
    toAccount,
    amount,
    idempotencyKey,
    status: "PENDING",
  });

  const debitLedgerEntry = await ledgerModel.create(
    [
      {
        account: fromUserAccount._id,
        amount: amount,
        transaction: transaction._id,
        type: "DEBIT",
      },
    ],
    { session },
  );

  const creditLedgerEntry = await ledgerModel.create(
    [
      {
        account: toAccount,
        amount: amount,
        transaction: transaction._id,
        type: "CREDIT",
      },
    ],
    { session },
  )

  // transaction.status = "COMPLETED";
  // await transaction.save({ session });
await transactionModel.findOneAndUpdate(
  {_id:transaction._id},
  {status:"COMPLETED"},
  {session}
)
  await session.commitTransaction();
  session.endSession();

  return res.status(201).json({
    transaction,
    message: "Initial Funds Transaction Completed Successfully.",
  });
}

module.exports = { createTransaction, createInitialFundsTransaction };

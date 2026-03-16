const express=require('express')
const authMiddleware=require('../middleware/auth.middleware')
const transactionController=require('../controller/transaction.controller')
const router=express.Router()



// POST api/transactions => create new transaction
/**
 * @swagger
 * /api/transactions:
 *   post:
 *     summary: Create a new transaction between accounts
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               fromAccount:
 *                 type: string
 *                 example: 64f3a2b8c2d9a1b3e4f12345
 *               toAccount:
 *                 type: string
 *                 example: 64f3a2b8c2d9a1b3e4f67890
 *               amount:
 *                 type: number
 *                 example: 500
 *               idempotencyKey:
 *                 type: string
 *                 example: txn-12345
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Invalid request
 *       401:
 *         description: Unauthorized
 */
router.post('/',authMiddleware.authMiddleWare,transactionController.createTransaction)

// POST /api/transactions/system/intial-funds
/**
 * @swagger
 * /api/transactions/system/initial-funds:
 *   post:
 *     summary: Create initial funds transaction (system user only)
 *     tags: [Transactions]
 *     security:
 *       - bearerAuth: []
 *     description: This endpoint allows the system user to initialize funds in an account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               toAccount:
 *                 type: string
 *                 example: 64f3a2b8c2d9a1b3e4f67890
 *               amount:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Initial funds added successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (only system user allowed)
 */
router.post('/system/initial-funds',authMiddleware.authSystemUserMiddleware,transactionController.createInitialFundsTransaction)

module.exports=router
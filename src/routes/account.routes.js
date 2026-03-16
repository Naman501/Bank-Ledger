const express=require('express')
const accountController =require('../controller/account.controller')
const authMiddleWare=require('../middleware/auth.middleware')
const router=express.Router()

/**
 * @swagger
 * /api/accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountType:
 *                 type: string
 *                 example: savings
 *               initialBalance:
 *                 type: number
 *                 example: 1000
 *     responses:
 *       201:
 *         description: Account created successfully
 *       401:
 *         description: Unauthorized
 */
// POST  /api/accounts
router.post('/',authMiddleWare.authMiddleWare,accountController.createAccountController)




/**
 * @swagger
 * /api/accounts:
 *   get:
 *     summary: Get all accounts for the logged-in user
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user accounts
 *       401:
 *         description: Unauthorized
 */
// GET accounts

router.get('/',authMiddleWare.authMiddleWare,accountController.getUserAccountsController)

/**
 * @swagger
 * /api/accounts/balance/{accountId}:
 *   get:
 *     summary: Get balance of a specific account
 *     tags: [Accounts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: Account ID
 *     responses:
 *       200:
 *         description: Account balance returned successfully
 *       404:
 *         description: Account not found
 *       401:
 *         description: Unauthorized
 */
// GET /api/accounts/balance/:accountId

router.get('/balance/:accountId',authMiddleWare.authMiddleWare,accountController.getAccountBalanceController)


module.exports=router
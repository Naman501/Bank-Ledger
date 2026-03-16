const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Bank Ledger API",
      version: "1.0.0",
      description: "API documentation for the backend ledger",
    },

    servers: [
      {
        url: "http://localhost:2000",
      },
    ],

    tags: [
      { name: "Auth", description: "Authentication APIs" },
      { name: "Accounts", description: "Account management APIs" },
      { name: "Transactions", description: "Transaction APIs" },
    ],

    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },

      schemas: {
        User: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64fa7a9f3c12a34567b12345",
            },
            name: {
              type: "string",
              example: "Naman Mittal",
            },
            email: {
              type: "string",
              example: "naman@email.com",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Account: {
          type: "object",
          properties: {
            _id: {
              type: "string",
              example: "64fa7a9f3c12a34567b12345",
            },
            user: {
              type: "string",
              description: "User ID",
              example: "64fa7a9f3c12a34567b11111",
            },
            status: {
              type: "string",
              enum: ["ACTIVE", "FROZEN", "CLOSED"],
              example: "ACTIVE",
            },
            currency: {
              type: "string",
              example: "INR",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Transaction: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            fromAccount: {
              type: "string",
              description: "Account ID sending funds",
              example: "64fa7a9f3c12a34567b11111",
            },
            toAccount: {
              type: "string",
              description: "Account ID receiving funds",
              example: "64fa7a9f3c12a34567b22222",
            },
            amount: {
              type: "number",
              example: 1000,
            },
            status: {
              type: "string",
              enum: ["PENDING", "COMPLETED", "FAILED", "REVERSED"],
              example: "PENDING",
            },
            idempotencyKey: {
              type: "string",
              example: "txn-unique-key-123",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
            updatedAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        Ledger: {
          type: "object",
          properties: {
            _id: {
              type: "string",
            },
            account: {
              type: "string",
              example: "64fa7a9f3c12a34567b11111",
            },
            transaction: {
              type: "string",
              example: "64fa7a9f3c12a34567b99999",
            },
            amount: {
              type: "number",
              example: 500,
            },
            type: {
              type: "string",
              enum: ["CREDIT", "DEBIT"],
              example: "DEBIT",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },

        TokenBlacklist: {
          type: "object",
          properties: {
            token: {
              type: "string",
              example: "jwt_token_here",
            },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
      },
    },
  },

  apis: ["./src/routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
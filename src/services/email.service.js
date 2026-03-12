require('dotenv').config();
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    type: 'OAuth2',
    user: process.env.EMAIL_USER,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    refreshToken: process.env.REFRESH_TOKEN,
  },
});


transporter.verify((error,SUCCESS) => {
  if (error) {
    console.error('Error connecting to email server:', error);
  } else {
    console.log('Email server is ready to send messages');
  }
});

// Function to send email
const sendEmail = async (to, subject, text, html) => {
  try {
    const info = await transporter.sendMail({
      from: `"Bank Ledger" <${process.env.EMAIL_USER}>`, // sender address
      to, // list of receivers
      subject, // Subject line
      text, // plain text body
      html, // html body
    });

    console.log('Message sent: %s', info.messageId);
    console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
  } catch (error) {
    console.error('Error sending email:', error);
  }
};

async function sendingRegistrationEmail(name, userEmail) {
  const subject = " Welcome to Bank Ledger! Your Financial Journey Starts Now!";

  const text = `
Hello ${name},

Welcome to Bank Ledger!

We're excited to have you on board. You can now track your transactions, manage expenses, and stay financially organized.

Best regards,
The Bank Ledger Team
`;

  const html = `
  <!DOCTYPE html>
  <html>
  <head>
    <meta charset="UTF-8" />
  </head>
  <body style="margin:0;padding:0;background-color:#f4f6f9;font-family:Arial,Helvetica,sans-serif;">
    
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
      <tr>
        <td align="center">
          
          <!-- Main Card -->
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 10px 25px rgba(0,0,0,0.08);">
            
            <!-- Header -->
            <tr>
              <td align="center" style="background:linear-gradient(90deg,#4e73df,#1cc88a);padding:30px;">
                <h1 style="color:#ffffff;margin:0;font-size:28px;">
                  Welcome to Bank Ledger 
                </h1>
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:40px 30px;color:#333333;">
                
                <h2 style="margin-top:0;color:#4e73df;">
                  Hello ${name},
                </h2>

                <p style="font-size:16px;line-height:1.6;color:#555;">
                  Thank you for registering with <strong>Bank Ledger</strong>.
                  We're excited to have you on board! 
                </p>

                <p style="font-size:16px;line-height:1.6;color:#555;">
                  You can now:
                </p>

                <ul style="font-size:15px;color:#555;line-height:1.8;">
                  <li>Track your transactions</li>
                  <li>Manage your expenses</li>
                  <li>Monitor financial growth</li>
                  <li>Enjoy secure banking logs</li>
                </ul>

                <!-- CTA Button -->
                <div style="text-align:center;margin:30px 0;">
                  <a href="http://localhost:3000/login"
                     style="background:#4e73df;color:#ffffff;text-decoration:none;
                     padding:12px 28px;border-radius:6px;font-size:16px;
                     display:inline-block;">
                     Go to Dashboard
                  </a>
                </div>

                <p style="font-size:14px;color:#888;margin-top:30px;">
                  If you did not create this account, please ignore this email.
                </p>

              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td align="center" style="background:#f8f9fc;padding:20px;font-size:13px;color:#999;">
                © ${new Date().getFullYear()} Bank Ledger. All rights reserved.
              </td>
            </tr>

          </table>

        </td>
      </tr>
    </table>

  </body>
  </html>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendingTransactionEmail(name, userEmail,amount,toAccount) {
  const subject = "💰 Transaction Successful!";

  const text = `
Hello ${name},

Your transaction of $${amount} to account ${toAccount} was successfully processed.

If you did not initiate this transaction, please contact support immediately.

Best regards,
Bank Ledger Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg, #4CAF50, #2e7d32); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Transaction Successful 🎉</h2>
      </div>

      <div style="padding: 25px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          Your transaction has been successfully completed. Below are the details:
        </p>

        <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 15px 0;">
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount}</p>
          <p style="margin: 5px 0;"><strong>Transferred To:</strong> ${toAccount}</p>
          <p style="margin: 5px 0; color: #4CAF50;"><strong>Status:</strong> Successful</p>
        </div>

        <p style="font-size: 14px; color: #555;">
          If you did not authorize this transaction, please contact our support team immediately.
        </p>

        <p style="margin-top: 25px; font-size: 14px;">
          Best regards,<br/>
          <strong>Bank Ledger Team</strong>
        </p>
      </div>

      <div style="background-color: #f4f6f8; text-align: center; padding: 15px; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} Bank Ledger. All rights reserved.
      </div>

    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

async function sendTransactionFailureEmail(userEmail, name, amount, toAccount) {
  const subject = "❌ Transaction Failed";

  const text = `
Hello ${name},

We regret to inform you that your transaction of $${amount} to account ${toAccount} could not be processed.

Please verify your details and try again. If the issue persists, contact our support team.

Best regards,
Bank Ledger Team
`;

  const html = `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.08);">
      
      <div style="background: linear-gradient(135deg, #e53935, #b71c1c); padding: 20px; text-align: center; color: white;">
        <h2 style="margin: 0;">Transaction Failed ⚠️</h2>
      </div>

      <div style="padding: 25px; color: #333;">
        <p style="font-size: 16px;">Hello <strong>${name}</strong>,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          Unfortunately, we were unable to process your recent transaction. Below are the details:
        </p>

        <div style="background-color: #fff5f5; padding: 15px; border-radius: 8px; margin: 15px 0; border-left: 4px solid #e53935;">
          <p style="margin: 5px 0;"><strong>Amount:</strong> $${amount}</p>
          <p style="margin: 5px 0;"><strong>Attempted To:</strong> ${toAccount}</p>
          <p style="margin: 5px 0; color: #e53935;"><strong>Status:</strong> Failed</p>
        </div>

        <p style="font-size: 14px; color: #555;">
          Please verify your account balance and recipient details before trying again.
          If you did not initiate this transaction, contact our support team immediately.
        </p>

        <p style="margin-top: 25px; font-size: 14px;">
          Best regards,<br/>
          <strong>Bank Ledger Team</strong>
        </p>
      </div>

      <div style="background-color: #f4f6f8; text-align: center; padding: 15px; font-size: 12px; color: #888;">
        © ${new Date().getFullYear()} Bank Ledger. All rights reserved.
      </div>

    </div>
  </div>
  `;

  await sendEmail(userEmail, subject, text, html);
}

module.exports = transporter;

module.exports = {
    sendingRegistrationEmail,sendingTransactionEmail,sendTransactionFailureEmail
}
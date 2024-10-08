import nodemailer from 'nodemailer';
import { generateReceipt } from './generateReceipt.js';

// Reusable function to create a Nodemailer transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: 'smtp.gmail.com', // Replace with your SMTP server
        port: 465, // Secure port (TLS)
        secure: true, // Use true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER, // Your email address from environment
            pass: process.env.EMAIL_PASSWORD, // Your email password or app-specific password
        },
    });
};

// Function to send reset password email
export async function sendResetPasswordEmail(toEmail, resetTokenurl) {
    const transporter = createTransporter();

    // Email options for reset password
    const mailOptions = {
        from: 'info@exhibitorsdata.com', // Sender address
        to: toEmail, // Recipient email
        subject: 'Password Reset Request', // Email subject
        html: `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Click the link below to reset your password:</p>
            <a href="${resetTokenurl}" target="_blank">Reset Password</a>
            <p>If you did not request this, please ignore this email.</p>
        `, // HTML content for the email
    };

    // Send the email
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Password reset email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending password reset email:', error);
        throw error;
    }
}

// Function to send invoice email with a downloadable PDF
export async function sendInvoiceEmail(toEmail, orderDetails) {
    const transporter = createTransporter();

    // Generate the invoice PDF
    const pdfPath = await generateReceipt(orderDetails);

    // Email options for invoice
    const mailOptions = {
        from: 'info@exhibitorsdata.com', // Sender address
        to: toEmail, // Recipient email
        subject: `Invoice for Order #${orderDetails.orderid}`, // Email subject
        html: `
            <h1>Thank you for your order</h1>
            <p>Dear ${orderDetails.name},</p>
            <p>Attached is your invoice for the order #${orderDetails.orderid}.</p>
            <p>Order Amount: ${orderDetails.amount} ${orderDetails.currency}</p>
            <p>Order Date: ${orderDetails.order_date}</p>
            <p>If you have any questions, feel free to contact us.</p>
        `,
        attachments: [
            {
                filename: `${orderDetails.orderid}.pdf`, // PDF filename
                path: pdfPath, // Path to the generated PDF
                contentType: 'application/pdf', // Content type for PDF
            },
        ],
    };

    // Send the invoice email with PDF attachment
    try {
        let info = await transporter.sendMail(mailOptions);
        console.log('Invoice email sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending invoice email:', error);
        throw error;
    }
}

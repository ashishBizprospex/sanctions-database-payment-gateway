import Razorpay from 'razorpay';

import Order from '../model/orderModel.js'; // Ensure this is a valid model for your database
import axios from 'axios';
import { generateReceipt } from '../utils/generateReceipt.js';
import { sendInvoiceEmail } from '../utils/sendEmail.js';

const razorpay = new Razorpay({
  key_id: process.env.TEST_RAZORPAY_KEY_ID,
  key_secret: process.env.TEST_RAZORPAY_KEY_SECRET,
});

// Create Razorpay Order
import { v4 as uuidv4 } from 'uuid'; // Import UUID library to generate unique IDs

export const createRazorpayOrder = async (req, res) => {
  const { amount, currency, name, email, user_id, product_id } = req.body;
  console.log("Payment detail", amount, currency, name, email, user_id, product_id);

  // Save the original amount (before conversion)
  const originalAmount = amount;

  // Convert amount to smallest unit depending on currency
  let amountInSmallestUnit;
  if (currency === 'INR' || currency === 'USD' || currency === 'EUR') {
    amountInSmallestUnit = amount * 100; // Multiply by 100 for INR, USD, EUR
  } else {
    // Default to the provided amount
    amountInSmallestUnit = amount;
  }

  try {
    // Generate a unique receipt ID
    const uniquePart = uuidv4().split('-')[0]; // First part of UUID
    const timestamp = Date.now();
    const receiptId = `receipt_${uniquePart}${timestamp}`.slice(0, 39);

    const options = {
      amount: amountInSmallestUnit, // Amount in smallest currency unit
      currency, // Currency from frontend
      receipt: receiptId, // Use generated receipt ID
    };

    // Create the Razorpay order
    const order = await razorpay.orders.create(options);
    console.log("Order created:", order);

    // Save the actual amount (before conversion) and order details in your DB
    await Order.create({
      orderid: order.id,
      user_id,
      amount: originalAmount, // Store the original amount
      currency: order.currency,
      status: order.status,
      productid: product_id,
      receiptid: receiptId // Store the receipt ID in the database
    });

    // Return order to frontend
    res.status(200).json({ data: order, });
  } catch (error) {
    console.error('Error creating Razorpay order:', error);
    res.status(500).json({ error: 'Failed to create order' });
  }
};



// Update Order Status on Payment Success
export const paymentSuccess = async (req, res) => {
  const { order_id, name, email } = req.body;

  console.log("Order ID in payment success:", order_id);

  try {
    // Update the order status in the database to 'paid'
    const [updated] = await Order.update({ status: 'paid' }, { where: { orderid: order_id } });

    if (updated) {
      // Fetch the updated order details including the receipt ID and original amount
      const orderDetails = await Order.findOne({ where: { orderid: order_id } });

      if (orderDetails) {
        const { receiptid, amount, currency, status } = orderDetails; // Get the stored details

        // Send invoice email with the original amount and other details
        await sendInvoiceEmail(email, {
          orderid: orderDetails.orderid,
          amount, // Send the original amount (not converted)
          currency: orderDetails.currency,
          status: orderDetails.status,
          name, // Include the name of the user
          receiptid, // Include the receipt ID in the email
          created_date:orderDetails.created_date
        });

        // Send success response
        res.status(200).json({ message: 'Payment successful and invoice sent', order_id });
      } else {
        res.status(404).json({ error: 'Order details not found' });
      }
    } else {
      res.status(404).json({ error: 'Order not found' });
    }
  } catch (error) {
    console.error('Payment success error:', error);
    res.status(500).json({ error: 'Payment success failed' });
  }
};


const verifyRazorpayCredentials = async () => {
  try {
    // Basic authentication using key_id and key_secret
    const response = await axios({
      method: 'post',
      url: 'https://api.razorpay.com/v1/orders',
      auth: {
        username: process.env.RAZORPAY_KEY_ID,
        password: process.env.RAZORPAY_KEY_SECRET,
      },
      data: {
        amount: 100, // 1 INR in paisa
        currency: 'INR',
        receipt: 'receipt#1',
      },
    });

    console.log('Razorpay credentials are valid');
    console.log('Order created:', response.data);
  } catch (error) {
    console.error('Invalid Razorpay credentials:', error.response);
  }
};

// verifyRazorpayCredentials();

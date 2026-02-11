// Example server-side Razorpay configuration and order creation
// This file is an example — run it in a Node.js server (Express recommended).

require('dotenv').config();
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET
});

// Example: create order (called by frontend to get order_id)
async function createOrder(amountInRupees, currency = 'INR', receipt = 'receipt#1') {
  const options = {
    amount: amountInRupees * 100, // amount in paise
    currency,
    receipt,
    payment_capture: 1
  };

  return await razorpay.orders.create(options);
}

module.exports = { razorpay, createOrder };

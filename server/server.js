require("dotenv").config();
const express = require("express");
const Razorpay = require("razorpay");
const cors = require("cors");
const crypto = require("crypto");
const path = require("path");

const app = express();

// Enable CORS for all origins in development
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from the parent directory
app.use(express.static(path.join(__dirname, '..')));

// Initialize Razorpay
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

console.log('✅ Razorpay initialized with Key ID:', process.env.RAZORPAY_KEY_ID);

// 🟢 Create Order API
app.post("/create-order", async (req, res) => {
  try {
    const { amount, bookId, bookTitle } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }

    const options = {
      amount: amount * 100, // convert to paisa
      currency: "INR",
      receipt: `receipt_${bookId || 'book'}_${Date.now()}`,
      notes: {
        bookId: bookId || '',
        bookTitle: bookTitle || ''
      }
    };

    console.log('Creating order:', options);
    const order = await razorpay.orders.create(options);
    console.log('Order created:', order.id);
    res.json(order);
  } catch (err) {
    console.error('Order creation error:', err);
    res.status(500).json({ error: err.message });
  }
});

// 🟢 Verify Payment API
app.post("/verify-payment", (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, error: "Missing required fields" });
    }

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature === razorpay_signature) {
      console.log('✅ Payment verified successfully for order:', razorpay_order_id);
      res.json({ 
        success: true, 
        message: "Payment verified successfully",
        paymentId: razorpay_payment_id,
        orderId: razorpay_order_id
      });
    } else {
      console.log('❌ Payment verification failed for order:', razorpay_order_id);
      res.status(400).json({ success: false, error: "Invalid signature" });
    }
  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// 🟢 Health check endpoint
app.get("/health", (req, res) => {
  res.json({ 
    status: "OK", 
    message: "Server is running",
    razorpay: !!process.env.RAZORPAY_KEY_ID
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log('\n🚀 OpenReaders Payment Server');
  console.log('================================');
  console.log(`✅ Server running on http://localhost:${PORT}`);
  console.log(`✅ Razorpay Key: ${process.env.RAZORPAY_KEY_ID}`);
  console.log('✅ CORS enabled for all origins');
  console.log('================================\n');
});

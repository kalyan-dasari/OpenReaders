const Razorpay = require("razorpay");

module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { amount, bookId, bookTitle } = req.body;

    console.log('📥 Order request received:', { amount, bookId, bookTitle });

    if (!amount || amount <= 0) {
      console.log('❌ Invalid amount:', amount);
      return res.status(400).json({ error: "Invalid amount" });
    }

    // Initialize Razorpay
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const options = {
      amount: amount * 100, // convert to paisa
      currency: "INR",
      receipt: `receipt_${bookId || 'book'}_${Date.now()}`,
      notes: {
        bookId: bookId || '',
        bookTitle: bookTitle || ''
      }
    };

    console.log('📤 Creating Razorpay order with:', options);
    const order = await razorpay.orders.create(options);
    console.log('✅ Order created successfully:', order.id);
    
    res.status(200).json(order);
  } catch (err) {
    console.error('❌ Order creation error:', err.message);
    console.error('Full error:', err);
    res.status(500).json({ error: err.message });
  }
};

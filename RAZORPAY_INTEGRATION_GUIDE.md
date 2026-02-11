# Razorpay Payment Integration Guide

## Table of Contents
1. [What You Need](#what-you-need)
2. [Prerequisites](#prerequisites)
3. [Step-by-Step Integration](#step-by-step-integration)
4. [Dynamic Price Management](#dynamic-price-management)
5. [Code Examples](#code-examples)
6. [Testing](#testing)
7. [Troubleshooting](#troubleshooting)

---

## What You Need

### 1. **Razorpay Account**
   - Sign up at [razorpay.com](https://razorpay.com)
   - Verify your email and phone number
   - Complete KYC verification (Know Your Customer)
   - Get your API keys (Key ID and Key Secret)

### 2. **API Keys**
   - **Key ID (Public Key)**: Used in frontend for Razorpay checkout
   - **Key Secret (Private Key)**: Used in backend for verification (keep it SECRET!)

### 3. **Server-Side Setup**
   - Node.js with Express (or any backend framework)
   - npm package: `razorpay` or `axios` for API calls

### 4. **Frontend Setup**
   - HTML form for payment
   - Razorpay's hosted JavaScript checkout library

---

## Prerequisites

### A. Create Razorpay Account
1. Go to https://razorpay.com
2. Sign up with email
3. Complete email verification
4. Complete phone verification
5. Submit KYC documents
6. Once approved, go to **Dashboard** → **Settings** → **API Keys**
7. Copy your **Key ID** and **Key Secret**

### B. Backend Requirements
- Node.js installed
- npm installed
- Basic understanding of Express.js or your backend framework

### C. Frontend Requirements
- Basic HTML/JavaScript knowledge
- Internet connection for loading Razorpay library

---

## Step-by-Step Integration

### Step 1: Install Razorpay Package (Backend)

```bash
npm install razorpay
```

### Step 2: Set Up Environment Variables

Create a `.env` file in your project root:

```
RAZORPAY_KEY_ID=your_key_id_here
RAZORPAY_KEY_SECRET=your_key_secret_here
MERCHANT_EMAIL=your_email@example.com
MERCHANT_NAME=Your Store Name
```

### Step 3: Update Backend Configuration (Node.js + Express)

Create a new file `razorpay-config.js`:

```javascript
require('dotenv').config();
const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

module.exports = razorpayInstance;
```

### Step 4: Create Payment Routes (Backend)

Add to your Express server (e.g., `server.js`):

```javascript
const express = require('express');
const razorpay = require('./razorpay-config');
const crypto = require('crypto');

const app = express();
app.use(express.json());

// Route 1: Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, currency = 'INR', receipt, description } = req.body;

    const order = await razorpay.orders.create({
      amount: Math.round(amount * 100), // Convert to paise (smallest unit)
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
      description: description || 'Payment for Books/Services',
      notes: {
        merchant_name: process.env.MERCHANT_NAME,
        email: process.env.MERCHANT_EMAIL,
      },
    });

    res.json(order);
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Route 2: Verify Payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    // Create signature hash
    const body = order_id + '|' + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    // Compare signatures
    if (expectedSignature === signature) {
      // Payment is verified
      res.json({ 
        success: true, 
        message: 'Payment verified successfully',
        paymentId: payment_id,
        orderId: order_id 
      });
    } else {
      // Payment verification failed
      res.status(400).json({ 
        success: false, 
        message: 'Payment verification failed' 
      });
    }
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### Step 5: Create Frontend Payment Form

Create `payment.html`:

```html
<!DOCTYPE html>
<html>
<head>
  <title>Razorpay Payment Integration</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      max-width: 600px;
      margin: 50px auto;
      padding: 20px;
    }
    .payment-form {
      border: 1px solid #ddd;
      padding: 20px;
      border-radius: 8px;
    }
    .form-group {
      margin-bottom: 15px;
    }
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: bold;
    }
    input, select {
      width: 100%;
      padding: 8px;
      border: 1px solid #ccc;
      border-radius: 4px;
      box-sizing: border-box;
    }
    button {
      background-color: #3b5998;
      color: white;
      padding: 10px 20px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 16px;
      width: 100%;
    }
    button:hover {
      background-color: #2d4373;
    }
    .message {
      margin-top: 20px;
      padding: 10px;
      border-radius: 4px;
      display: none;
    }
    .message.success {
      background-color: #d4edda;
      color: #155724;
      display: block;
    }
    .message.error {
      background-color: #f8d7da;
      color: #721c24;
      display: block;
    }
  </style>
</head>
<body>
  <div class="payment-form">
    <h2>Payment Gateway</h2>
    
    <form id="paymentForm">
      <div class="form-group">
        <label for="productName">Product/Service Name:</label>
        <input type="text" id="productName" placeholder="e.g., Book Purchase" required>
      </div>

      <div class="form-group">
        <label for="amount">Amount (₹):</label>
        <input type="number" id="amount" placeholder="e.g., 499.99" min="1" step="0.01" required>
      </div>

      <div class="form-group">
        <label for="customerName">Your Name:</label>
        <input type="text" id="customerName" placeholder="Full Name" required>
      </div>

      <div class="form-group">
        <label for="customerEmail">Email:</label>
        <input type="email" id="customerEmail" placeholder="your@email.com" required>
      </div>

      <div class="form-group">
        <label for="customerPhone">Phone:</label>
        <input type="tel" id="customerPhone" placeholder="10-digit mobile number" required>
      </div>

      <button type="submit">Pay Now</button>
    </form>

    <div id="message" class="message"></div>
  </div>

  <!-- Razorpay Checkout Script -->
  <script src="https://checkout.razorpay.com/v1/checkout.js"></script>

  <script>
    const form = document.getElementById('paymentForm');
    const messageDiv = document.getElementById('message');

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const amount = parseFloat(document.getElementById('amount').value);
      const customerName = document.getElementById('customerName').value;
      const customerEmail = document.getElementById('customerEmail').value;
      const customerPhone = document.getElementById('customerPhone').value;
      const productName = document.getElementById('productName').value;

      try {
        // Step 1: Create order from backend
        const orderResponse = await fetch('/api/create-order', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            amount: amount,
            currency: 'INR',
            description: productName,
            receipt: `receipt_${Date.now()}`,
          }),
        });

        if (!orderResponse.ok) {
          throw new Error('Failed to create order');
        }

        const order = await orderResponse.json();

        // Step 2: Open Razorpay Checkout
        const options = {
          key: 'YOUR_RAZORPAY_KEY_ID', // Replace with your Key ID
          amount: order.amount,
          currency: order.currency,
          name: 'Your Store Name',
          description: productName,
          order_id: order.id,
          handler: async (response) => {
            // Step 3: Verify payment on backend
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                order_id: response.razorpay_order_id,
                payment_id: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            const verifyResult = await verifyResponse.json();

            if (verifyResult.success) {
              showMessage('Payment successful! Thank you for your purchase.', 'success');
              form.reset();
              // You can redirect to success page here
              // window.location.href = '/success.html';
            } else {
              showMessage('Payment verification failed. Please try again.', 'error');
            }
          },
          prefill: {
            name: customerName,
            email: customerEmail,
            contact: customerPhone,
          },
          theme: {
            color: '#3b5998',
          },
          modal: {
            ondismiss: () => {
              showMessage('Payment cancelled. Please try again.', 'error');
            },
          },
        };

        const rzp = new Razorpay(options);
        rzp.open();
      } catch (error) {
        console.error('Error:', error);
        showMessage('Error: ' + error.message, 'error');
      }
    });

    function showMessage(text, type) {
      messageDiv.textContent = text;
      messageDiv.className = 'message ' + type;
    }
  </script>
</body>
</html>
```

---

## Dynamic Price Management

### YES! You Can Change Prices Anytime

### Method 1: Change Price in Frontend (Simple)

```html
<div class="price-selector">
  <label for="priceDropdown">Select Price:</label>
  <select id="priceDropdown" onchange="updatePrice()">
    <option value="99">₹99 - Basic</option>
    <option value="299">₹299 - Standard</option>
    <option value="599">₹599 - Premium</option>
    <option value="custom">Custom Price</option>
  </select>
  
  <div id="customPriceDiv" style="display: none; margin-top: 10px;">
    <input type="number" id="customPrice" placeholder="Enter custom price" min="1">
  </div>
</div>

<script>
  function updatePrice() {
    const dropdown = document.getElementById('priceDropdown');
    const customDiv = document.getElementById('customPriceDiv');
    const amountInput = document.getElementById('amount');
    
    if (dropdown.value === 'custom') {
      customDiv.style.display = 'block';
    } else {
      customDiv.style.display = 'none';
      amountInput.value = dropdown.value;
    }
  }
</script>
```

### Method 2: Change Price in Database (Recommended)

Update your `books.json` or `incidents.json`:

```json
{
  "id": 1,
  "title": "Book Name",
  "price": 299,
  "currency": "INR",
  "lastPriceUpdate": "2026-02-05"
}
```

Fetch price dynamically:

```javascript
async function getProductPrice(productId) {
  const response = await fetch(`/api/get-product/${productId}`);
  const product = await response.json();
  return product.price; // Always gets current price
}
```

### Method 3: Admin Panel for Price Management

Add to your `admin-panel.html`:

```html
<section class="price-management">
  <h3>Update Prices</h3>
  
  <form id="updatePriceForm">
    <div>
      <label for="productId">Select Product:</label>
      <select id="productId" required>
        <option value="">-- Select --</option>
        <option value="1">Book 1</option>
        <option value="2">Book 2</option>
        <option value="3">Book 3</option>
      </select>
    </div>

    <div>
      <label for="newPrice">New Price (₹):</label>
      <input type="number" id="newPrice" placeholder="Enter new price" min="1" step="0.01" required>
    </div>

    <button type="submit">Update Price</button>
  </form>
</section>

<script>
  document.getElementById('updatePriceForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const productId = document.getElementById('productId').value;
    const newPrice = parseFloat(document.getElementById('newPrice').value);

    try {
      const response = await fetch('/api/update-price', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, price: newPrice }),
      });

      const result = await response.json();
      if (result.success) {
        alert('Price updated successfully!');
        document.getElementById('updatePriceForm').reset();
      }
    } catch (error) {
      alert('Error updating price: ' + error.message);
    }
  });
</script>
```

Backend route to update price:

```javascript
app.put('/api/update-price', (req, res) => {
  const { productId, price } = req.body;
  
  // Read books.json
  let books = JSON.parse(fs.readFileSync('./data/books.json', 'utf-8'));
  
  // Find and update
  const book = books.find(b => b.id == productId);
  if (book) {
    book.price = price;
    book.lastPriceUpdate = new Date().toISOString();
    
    // Write back to file
    fs.writeFileSync('./data/books.json', JSON.stringify(books, null, 2));
    
    res.json({ success: true, message: 'Price updated' });
  } else {
    res.status(404).json({ success: false, message: 'Product not found' });
  }
});
```

---

## Code Examples

### Complete Backend Example (Express + Razorpay)

```javascript
const express = require('express');
const razorpay = require('razorpay');
const crypto = require('crypto');
require('dotenv').config();
const fs = require('fs');

const app = express();
app.use(express.json());
app.use(express.static('public'));

// Initialize Razorpay
const razorpayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

// Create Order
app.post('/api/create-order', async (req, res) => {
  try {
    const { amount, description, bookId } = req.body;

    // Fetch current price from books.json if needed
    const books = JSON.parse(fs.readFileSync('./data/books.json', 'utf-8'));
    const book = books.find(b => b.id == bookId);

    const order = await razorpayInstance.orders.create({
      amount: Math.round(amount * 100), // Convert to paise
      currency: 'INR',
      description: description || book?.title || 'Payment',
      receipt: `receipt_${Date.now()}`,
    });

    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Verify Payment
app.post('/api/verify-payment', (req, res) => {
  try {
    const { order_id, payment_id, signature } = req.body;

    const body = order_id + '|' + payment_id;
    const expectedSignature = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');

    if (expectedSignature === signature) {
      // Log transaction
      const transaction = {
        paymentId: payment_id,
        orderId: order_id,
        timestamp: new Date().toISOString(),
        status: 'completed',
      };
      console.log('Payment verified:', transaction);

      res.json({ success: true, message: 'Payment verified' });
    } else {
      res.status(400).json({ success: false, message: 'Verification failed' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get Product Price
app.get('/api/get-product/:id', (req, res) => {
  try {
    const books = JSON.parse(fs.readFileSync('./data/books.json', 'utf-8'));
    const book = books.find(b => b.id == req.params.id);
    
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Update Price
app.put('/api/update-price', (req, res) => {
  try {
    const { productId, price } = req.body;
    let books = JSON.parse(fs.readFileSync('./data/books.json', 'utf-8'));
    
    const book = books.find(b => b.id == productId);
    if (book) {
      book.price = price;
      book.lastPriceUpdate = new Date().toISOString();
      fs.writeFileSync('./data/books.json', JSON.stringify(books, null, 2));
      
      res.json({ success: true, message: 'Price updated' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

---

## Testing

### Test Cards (Razorpay Sandbox Mode)

Before going live, test with these cards in sandbox:

| Card Type | Card Number | Expiry | CVV |
|-----------|------------|--------|-----|
| **Visa** | 4111 1111 1111 1111 | Any Future | Any 3 digits |
| **Mastercard** | 5555 5555 5555 4444 | Any Future | Any 3 digits |
| **Failed Payment** | 4000 0000 0000 0002 | Any Future | Any 3 digits |

### Test OTP
Use any 6-digit number for OTP verification.

### Steps to Test:
1. Enter any amount (₹1 or more)
2. Fill customer details
3. Click "Pay Now"
4. Use test card from above
5. Enter any OTP (6 digits)
6. Verify payment succeeded

---

## Troubleshooting

### Issue 1: "Key ID not found" or "Unauthorized"
**Solution:**
- Verify you're using the correct Key ID (not Key Secret)
- Check environment variables are loaded properly
- Confirm API key hasn't been rotated

### Issue 2: Payment amount too low
**Solution:**
- Minimum amount in Razorpay India: ₹1
- Check if you're converting to paise correctly (multiply by 100)

### Issue 3: Signature mismatch
**Solution:**
- Ensure Key Secret is kept private
- Verify you're using the correct formula: `order_id|payment_id`
- Check for extra spaces or encoding issues

### Issue 4: CORS errors
**Solution:**
- Make sure your server has CORS enabled:
```javascript
const cors = require('cors');
app.use(cors());
```

### Issue 5: "Payment verification failed"
**Solution:**
- Check if payment was actually captured in Razorpay dashboard
- Verify signature calculation
- Enable debug logging

---

## Security Checklist

- ✅ Never expose Key Secret in frontend
- ✅ Always verify signatures on backend
- ✅ Use HTTPS in production
- ✅ Validate all inputs on server-side
- ✅ Store transactions securely
- ✅ Don't trust client-side data for critical operations
- ✅ Use environment variables for sensitive keys
- ✅ Implement rate limiting on payment routes
- ✅ Log all transactions for auditing
- ✅ Test thoroughly in sandbox mode first

---

## Next Steps

1. ✅ Create Razorpay account and get API keys
2. ✅ Set up backend with Express and Razorpay SDK
3. ✅ Create payment routes (create-order, verify-payment)
4. ✅ Create frontend payment form
5. ✅ Replace `YOUR_RAZORPAY_KEY_ID` with your actual Key ID
6. ✅ Test in sandbox mode with test cards
7. ✅ Go live when ready
8. ✅ Implement price management system
9. ✅ Monitor transactions in Razorpay dashboard
10. ✅ Handle refunds if needed

---

## Useful Resources

- Razorpay Documentation: https://razorpay.com/docs/
- Razorpay API Reference: https://razorpay.com/api/
- Razorpay Dashboard: https://dashboard.razorpay.com/
- Node.js Razorpay SDK: https://github.com/razorpay/razorpay-node

---

**Last Updated:** February 5, 2026

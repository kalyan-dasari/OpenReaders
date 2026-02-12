# OpenReaders - Razorpay Integration Setup & Testing Guide

## ✅ Setup Complete!

Your Razorpay integration is now fully configured and ready to use. Here's how to run and test it.

---

## 🚀 Quick Start

### Step 1: Install Dependencies

First, make sure all npm packages are installed:

```bash
npm install
```

This will install:
- `express` - Web server
- `razorpay` - Razorpay SDK
- `cors` - Cross-origin resource sharing
- `dotenv` - Environment variable management
- `crypto` - Payment signature verification

### Step 2: Start the Payment Server

Run the server using npm:

```bash
npm start
```

Or directly with Node:

```bash
node server/server.js
```

You should see:
```
🚀 OpenReaders Payment Server
================================
✅ Server running on http://localhost:5000
✅ Razorpay Key: rzp_live_SEukaWyI7cU4x0
✅ CORS enabled for all origins
================================
```

### Step 3: Open the Website

Open your website in a browser. You can:

1. **Option A: Double-click the HTML file**
   - Navigate to your project folder
   - Double-click `index.html` to open in browser
   
2. **Option B: Use a local server (recommended)**
   - Install Live Server in VS Code
   - Right-click `index.html` → "Open with Live Server"
   
3. **Option C: Use Python's simple server**
   ```bash
   python -m http.server 8000
   ```
   Then visit: `http://localhost:8000`

---

## 🧪 Testing the Payment Flow

### Test Scenario 1: Preview Book (Free)

1. Go to the **Books** page
2. Click **"Preview"** button on any book
3. You should see:
   - First 10 pages of the PDF
   - A locked page at the end with "Unlock Full Book" button

### Test Scenario 2: Purchase from Preview Modal

1. After previewing a book, scroll to the locked page
2. Click **"Unlock Full Book • ₹299"** button
3. Razorpay payment modal should open with:
   - Book title and price
   - Payment options (Card, UPI, Netbanking, Wallets)

### Test Scenario 3: Purchase from Book Card

1. On the Books page
2. Click **"Unlock Full →"** button directly on any book card
3. Razorpay payment modal opens immediately

### Test Scenario 4: Complete Purchase

**IMPORTANT**: You're using **LIVE** Razorpay keys, so real money will be charged!

**For Testing Without Real Money:**
1. Go to Razorpay Dashboard → Settings → API Keys
2. Switch to **Test Mode** 
3. Copy the **Test Key ID** and **Test Key Secret**
4. Update your `.env` file with test keys
5. Restart the server

**Test Card Details (Test Mode Only):**
- Card Number: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**Complete the flow:**
1. Click "Unlock Full" button
2. Fill in payment details
3. Click "Pay Now"
4. After successful payment:
   - You'll see: "🎉 Payment successful! Unlocking full book..."
   - PDF modal auto-reloads with all pages unlocked
   - Book stays unlocked (stored in localStorage)

### Test Scenario 5: Already Purchased Book

1. Try to unlock the same book again
2. It should say: "You have already purchased this book! Opening it now..."
3. PDF opens immediately without payment

---

## 🔍 Verification & Debugging

### Check Server is Running

Open in browser or use curl:
```bash
curl http://localhost:5000/health
```

Should return:
```json
{
  "status": "OK",
  "message": "Server is running",
  "razorpay": true
}
```

### Check Console Logs

**Browser Console (F12):**
- Payment initiation logs
- Order creation logs
- Payment verification logs
- Any errors

**Server Terminal:**
- Order creation details
- Payment verification status
- Request/response logs

### Check Purchased Books

Open browser console (F12) and run:
```javascript
localStorage.getItem('openreaders_paid_books')
```

You should see your purchased books with payment details.

---

## 📊 Payment Flow Architecture

Here's what happens when a user clicks "Unlock Full":

```
1. Frontend: User clicks "Unlock Full" button
   ↓
2. Frontend → Server: POST /create-order
   Request: { amount: 299, bookId: 1, bookTitle: "..." }
   ↓
3. Server → Razorpay: Create order
   ↓
4. Server → Frontend: Order details { id, amount, currency }
   ↓
5. Frontend: Open Razorpay checkout modal
   ↓
6. User: Completes payment on Razorpay
   ↓
7. Razorpay → Frontend: Payment response
   { razorpay_order_id, razorpay_payment_id, razorpay_signature }
   ↓
8. Frontend → Server: POST /verify-payment
   ↓
9. Server: Verify signature with HMAC-SHA256
   ↓
10. Server → Frontend: { success: true }
    ↓
11. Frontend: Save to localStorage, unlock book, reload PDF
    ↓
12. User: Can now read full book!
```

---

## 🛠️ Troubleshooting

### Issue: "Payment system not configured"
**Fix**: Make sure server is running on port 5000

### Issue: "Failed to create order"
**Fix**: 
- Check server is running (`npm start`)
- Check `.env` file has correct keys
- Check server logs for errors

### Issue: CORS errors
**Fix**: Server already has CORS enabled for all origins

### Issue: Payment succeeds but book doesn't unlock
**Fix**: 
- Check browser console for errors
- Check localStorage permissions
- Check server verification logs

### Issue: Using Test Keys but getting real payment screen
**Fix**: 
- Make sure you copied TEST keys, not LIVE keys
- Test keys start with `rzp_test_`
- Live keys start with `rzp_live_`

---

## 🔐 Security Features

✅ **Server-side signature verification** - Prevents payment tampering
✅ **Environment variables** - Keys stored in `.env` (not in code)
✅ **HTTPS required in production** - Razorpay enforces secure connections
✅ **Order-based flow** - Each payment linked to a unique order
✅ **Receipt generation** - Unique receipt for each transaction

---

## 📱 Testing on Mobile

1. Make sure both your phone and computer are on same WiFi
2. Get your computer's IP address:
   ```bash
   ipconfig
   ```
   Look for IPv4 Address (e.g., 192.168.1.5)
   
3. Update `config.js`:
   ```javascript
   serverUrl: "http://192.168.1.5:5000"
   ```

4. On your phone browser, visit:
   ```
   http://192.168.1.5:8000
   ```

---

## 🎯 Next Steps

1. **Switch to Test Mode** for safe testing (highly recommended!)
2. Test all payment scenarios
3. Check Razorpay Dashboard for payment records
4. When ready for production:
   - Ensure you have LIVE keys
   - Deploy server to a hosting service
   - Update `serverUrl` in config.js
   - Enable HTTPS

---

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check server terminal logs
3. Check Razorpay Dashboard → Payments
4. Verify `.env` file is in root folder
5. Ensure server is running before testing

---

## ✨ Features Implemented

✅ Book preview (first 10 pages free)
✅ "Unlock Full" button in preview modal
✅ "Unlock Full" button on book cards
✅ Order creation with Razorpay
✅ Payment signature verification
✅ Secure CORS handling
✅ Local storage for purchased books
✅ Auto-unlock after purchase
✅ Already purchased detection
✅ Error handling and user-friendly messages
✅ Server health check endpoint

---

**Ready to test!** 🚀

Start the server with `npm start` and open your website to try making a test purchase!

# ⚡ Quick Reference - PDF-Only Book System

## TL;DR - Do This

### For Each Book:

```bash
1. Save book as PDF
   Word → Save As → PDF
   
2. Move to assets/pdfs/
   file: echoes-of-the-heart.pdf
   
3. Edit data/books.json
   Add:
   {
     "id": 1,
     "title": "Book Name",
     "pdfUrl": "assets/pdfs/echoes-of-the-heart.pdf",
     "freePages": 10,
     "totalPages": 120,
     "price": 299,
     ...
   }
   
4. Test
   Open pages/books.html
   Click "Read Free (10 Pages)"
   Should work!
```

---

## What's in Each Book Entry (Required)

```json
{
  "id": 1,                                            // Unique number
  "title": "Echoes of the Heart",                     // Book name
  "author": "Your Name",                              // Author
  "cover": "assets/images/book1.jpg",                 // Cover image
  "price": 299,                                       // Price in INR
  "currency": "INR",                                  // Currency
  "description": "...",                               // Long description
  "shortDesc": "A poetic journey",                    // Short description
  "category": "Fiction",                              // Genre
  "pdfUrl": "assets/pdfs/echoes-of-the-heart.pdf",   // PDF file path ⭐
  "freePages": 10,                                    // Free pages limit ⭐
  "totalPages": 120,                                  // Total pages ⭐
  "externalLinks": {                                  // Buy links (optional)
    "amazon": "https://amazon.in/...",
    "flipkart": "https://flipkart.com/...",
    "goodreads": "https://goodreads.com/..."
  },
  "views": 567,                                       // Stats
  "likes": 89,
  "comments": [],
  "rating": 4.5,
  "reviews": 23
}
```

⭐ = Must update

---

## Folder Structure

```
OpenreadersC/
├── assets/
│   ├── pdfs/                      ← Your PDFs here
│   │   ├── echoes-of-the-heart.pdf
│   │   ├── neon-nights.pdf
│   │   └── the-last-trip.pdf
│   └── images/                    ← Cover images
├── data/
│   └── books.json                 ← Edit this file
├── pages/
│   └── books.html                 ← View books here
└── ...
```

---

## Buttons on Book Card

```
┌─────────────────────────────────────┐
│      [Read Free (10 Pages)]          │  ← Opens PDF with limit
│      [Unlock Full Book]              │  ← Payment button
└─────────────────────────────────────┘
```

---

## How It Works

```
Reader clicks "Read Free (10 Pages)"
              ↓
        PDF opens
              ↓
   Shows first 10 pages
        Can scroll freely
              ↓
   After page 10 → "Unlock Full Book" appears
              ↓
        Reader can either:
        A) Click button → Payment → Full PDF
        B) Click external link → Buy on Amazon/etc
```

---

## JSON File Location

**Path:** `c:\Users\kalya\Desktop\OpenreadersC\data\books.json`

**Format:** Valid JSON (no trailing commas, proper brackets)

**Validation:** Use https://jsonlint.com to check syntax

---

## Page Count

How to find how many pages your PDF has:

```
1. Open PDF in any PDF reader
2. Look at bottom of window
3. Usually shows "Page 1 of 120"
4. That number (120) is totalPages
```

---

## Free Pages (Recommendations)

| Situation | Free Pages |
|-----------|-----------|
| Want many sales | 5-8 |
| Balanced approach | 10 |
| Build trust | 15-20 |

**Default:** Use 10 for all books

---

## Price Suggestions

| Book Length | Suggested Price |
|-----------|--------|
| Short (< 50 pages) | ₹99 - ₹199 |
| Medium (50-150 pages) | ₹199 - ₹399 |
| Long (150+ pages) | ₹399 - ₹699 |

---

## Common Mistakes

❌ **Wrong:** `"pdfUrl": "echoes.pdf"`  
✅ **Correct:** `"pdfUrl": "assets/pdfs/echoes-of-the-heart.pdf"`

❌ **Wrong:** `"freePages": "10"`  
✅ **Correct:** `"freePages": 10`

❌ **Wrong:** File not in `assets/pdfs/` folder  
✅ **Correct:** File placed in `assets/pdfs/` folder

❌ **Wrong:** Missing comma between fields  
✅ **Correct:** All fields have commas (except last one)

---

## Testing

```
1. Save JSON
2. Open pages/books.html in browser
3. Find your book
4. Click "Read Free (10 Pages)"
5. PDF should open
6. Scroll through pages
7. After page 10 → See "Unlock Full Book"
8. Click button → Razorpay opens (if configured)
9. Test card: 4111 1111 1111 1111
10. Click Pay → Should show full PDF
```

---

## If Something Breaks

**Book not showing:**
- Check JSON syntax (jsonlint.com)
- Check all required fields present
- Refresh browser (Ctrl+Shift+R)

**PDF not loading:**
- Check file exists in `assets/pdfs/`
- Check filename in `pdfUrl` matches exactly
- Check no spaces in path

**Unlock button not working:**
- Check Razorpay configured
- Check browser console (F12 → Console tab)
- Try different browser

**Not enough pages showing:**
- Check `freePages` value
- Make sure it's a number, not text
- Check `totalPages` is correct

---

## Documentation Files

📄 **SYSTEM_UPDATE.md** - What changed (this is summary)  
📄 **PDF_ONLY_GUIDE.md** - Complete setup guide  
📄 **BOOKS_PDF_GUIDE.md** - More detailed guide (older)  

Read **PDF_ONLY_GUIDE.md** for full details!

---

## Support Commands

**Check JSON:** https://jsonlint.com (paste content)  
**Count PDF pages:** Open in Adobe Reader (show page count)  
**Test payment card:** 4111 1111 1111 1111 (test mode only)  

---

**That's it! Simple and clean.** 🚀


/* ========================================
   CONTENT MANAGER
   ======================================== */

class ContentManager {
    constructor() {
        this.stories = null;
        this.books = null;
        this.storiesInitialized = false;
        this.booksInitialized = false;
    }

    // Get the correct base path depending on where the script is loaded from
    getBasePath() {
        // Check if we're in the pages folder by looking at current URL
        const path = window.location.pathname;
        return path.includes('/pages/') ? '../' : '';
    }

    async loadStories() {
        if (this.storiesInitialized && this.stories) {
            return this.stories;
        }

        try {
            const basePath = this.getBasePath();
            const url = basePath + 'data/incidents.json';
            console.log('Loading incidents from:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to load incidents: ' + response.statusText);
            const data = await response.json();
            this.stories = data.incidents || [];
            this.storiesInitialized = true;
            console.log('Loaded incidents:', this.stories.length);
            return this.stories;
        } catch (error) {
            console.error('Error loading incidents:', error);
            return [];
        }
    }

    async loadBooks() {
        if (this.booksInitialized && this.books) {
            return this.books;
        }

        try {
            const basePath = this.getBasePath();
            const url = basePath + 'data/books.json';
            console.log('Loading books from:', url);
            const response = await fetch(url);
            if (!response.ok) throw new Error('Failed to load books: ' + response.statusText);
            const data = await response.json();
            this.books = data.books || [];
            this.booksInitialized = true;
            console.log('Loaded books:', this.books.length);
            return this.books;
        } catch (error) {
            console.error('Error loading books:', error);
            return [];
        }
    }

    async getStories() {
        return await this.loadStories();
    }

    async getBooks() {
        return await this.loadBooks();
    }

    async getStoryById(id) {
        const stories = await this.getStories();
        return stories.find(story => story.id === parseInt(id));
    }

    async getBookById(id) {
        const books = await this.getBooks();
        return books.find(book => book.id === parseInt(id));
    }

    async getLatestStories(count = 3) {
        const stories = await this.getStories();
        return stories.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, count);
    }

    async getSortedStories(sortBy = 'newest') {
        let stories = await this.getStories();
        
        switch(sortBy) {
            case 'newest':
                stories.sort((a, b) => new Date(b.date) - new Date(a.date));
                break;
            case 'oldest':
                stories.sort((a, b) => new Date(a.date) - new Date(b.date));
                break;
            case 'popular':
                stories.sort((a, b) => b.likes - a.likes);
                break;
            case 'views':
                stories.sort((a, b) => b.views - a.views);
                break;
        }
        
        return stories;
    }

    async searchStories(query) {
        const stories = await this.getStories();
        const lowerQuery = query.toLowerCase();
        
        return stories.filter(story =>
            story.title.toLowerCase().includes(lowerQuery) ||
            story.preview.toLowerCase().includes(lowerQuery)
        );
    }

    async getStoriesByCategory(category) {
        const stories = await this.getStories();
        return stories.filter(story => story.category === category);
    }

    // Update story data (for likes, views, etc.)
    async updateStoryData(storyId, data) {
        const stories = await this.getStories();
        const story = stories.find(s => s.id === storyId);
        
        if (story) {
            Object.assign(story, data);
            // In a real app, this would be saved to a backend
            saveToLocalStorage('updatedStories', stories);
        }
        
        return story;
    }
}

// Global content manager instance
const contentManager = new ContentManager();

/* ========================================
   HTML BUILDERS
   ======================================== */

function buildStoryCard(story) {
    return `
        <div class="story-card" data-story-id="${story.id}">
            <div class="story-date">${formatDate(story.date)}</div>
            <h3 class="story-title">${story.title}</h3>
            <p class="story-preview">${story.preview}</p>
            <div class="story-meta">
                <span class="meta-item">
                    <span>👁️</span>
                    <span>${story.views} views</span>
                </span>
                <span class="meta-item">
                    <span>❤️</span>
                    <span>${story.likes} likes</span>
                </span>
            </div>
        </div>
    `;
}

function buildWhatsNewCard(story) {
    return `
        <div class="whats-new-card" data-story-id="${story.id}">
            <div class="whats-new-inner">
                <div class="whats-new-badge">Latest</div>
                <h3 class="whats-new-title">${story.title}</h3>
                <p class="whats-new-preview">${story.preview}</p>
                <div class="whats-new-date">${formatDate(story.date)}</div>
            </div>
        </div>
    `;
}

function buildBookCard(book, isHomePreview = false) {
    // Get the correct base path for asset loading
    // Use absolute path for Razorpay compatibility (always start with /)
    const coverPath = '/' + book.cover;
    
    if (isHomePreview) {
        // Home page version - redirect to books page
        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-cover" style="background-image: url('${coverPath}');">
                    <img src="${coverPath}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 10px;">by ${book.author}</p>
                <p class="book-description">${book.shortDesc}</p>
                <div class="book-price">₹${book.price}</div>
                <div class="book-buttons">
                    <a href="pages/books.html" class="btn-sample" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">Preview (${book.freePages || 10}p)</a>
                    <a href="pages/books.html" class="btn-buy" style="text-decoration: none; display: flex; align-items: center; justify-content: center;">View Full →</a>
                </div>
                <div class="story-meta" style="margin-top: 15px; padding-top: 15px;">
                    <span class="meta-item">
                        <span>👁️</span>
                        <span>${book.views}</span>
                    </span>
                    <span class="meta-item">
                        <span>❤️</span>
                        <span>${book.likes}</span>
                    </span>
                </div>
            </div>
        `;
    } else {
        // Books page version - direct interaction
        return `
            <div class="book-card" data-book-id="${book.id}">
                <div class="book-cover" style="background-image: url('${coverPath}');">
                    <img src="${coverPath}" alt="${book.title}" style="width: 100%; height: 100%; object-fit: cover; border-radius: 8px;">
                </div>
                <h3 class="book-title">${book.title}</h3>
                <p class="book-author" style="color: var(--text-secondary); font-size: 0.9rem; margin-bottom: 10px;">by ${book.author}</p>
                <p class="book-description">${book.shortDesc}</p>
                <div class="book-price">₹${book.price}</div>
                <div class="book-buttons">
                    <button class="btn-sample btn-preview" data-book-id="${book.id}" style="border: none; width: 100%;">Preview (${book.freePages || 10}p)</button>
                    <button class="btn-buy btn-unlock" data-book-id="${book.id}" style="border: 2px solid var(--accent-primary); width: 100%;">Unlock Full →</button>
                </div>
                <div class="story-meta" style="margin-top: 15px; padding-top: 15px;">
                    <span class="meta-item">
                        <span>👁️</span>
                        <span>${book.views}</span>
                    </span>
                    <span class="meta-item">
                        <span>❤️</span>
                        <span>${book.likes}</span>
                    </span>
                </div>
            </div>
        `;
    }
}

/* ========================================
   PDF Viewer (Books only)
   Uses PDF.js (included via CDN in pages/books.html)
   ======================================== */

let activePdfBookId = null;
let pdfDocCache = null;

async function openBookPDF(bookId) {
    console.log('openBookPDF called with bookId:', bookId, typeof bookId);
    const book = await contentManager.getBookById(parseInt(bookId));
    if (!book) {
        console.error('Book not found for ID:', bookId);
        showToast('Book not found!', 'error');
        return;
    }
    console.log('Opening PDF for book:', book.title);
    activePdfBookId = parseInt(bookId);

    const modal = document.getElementById('pdfModal');
    const titleEl = document.getElementById('pdfModalTitle');
    const actionsEl = document.getElementById('pdfModalActions');
    const viewerContainer = document.getElementById('pdfViewerContainer');
    const viewer = document.getElementById('pdfViewer');
    const overlay = document.getElementById('pdfUnlockOverlay');
    const unlockBtn = document.getElementById('pdfUnlockBtn');

    titleEl.textContent = book.title + ' • Sample Pages (' + (book.freePages || 10) + ' pages free, ' + (book.totalPages || 0) + ' total)';
    actionsEl.innerHTML = '';
    viewer.innerHTML = '';
    overlay.style.display = 'none';

    // Close handler
    document.getElementById('pdfModalClose').onclick = closePdfModal;

    // Unlock button triggers purchase
    unlockBtn.onclick = () => initiatePurchase(bookId);

    modal.classList.add('show');
    document.body.style.overflow = 'hidden';

    try {
        // Determine base path for local assets
        const basePath = contentManager.getBasePath();
        const url = basePath + (book.pdfUrl || '');

        // Ensure pdfjs is available
        if (typeof pdfjsLib === 'undefined') {
            showToast('PDF viewer not available. Please check your internet connection.', 'error');
            return;
        }

        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/2.16.105/pdf.worker.min.js';

        // Load PDF only once per modal open
        const loadingTask = pdfjsLib.getDocument(url);
        const pdf = await loadingTask.promise;
        pdfDocCache = pdf;

        // Get free pages limit (default 10 pages)
        const freePages = book.freePages || 10;

        // Check if user purchased this book
        const paidBooks = getFromLocalStorage('paid_books') || {};
        const isPurchased = paidBooks[bookId] ? true : false;

        // Render pages - all pages if purchased, only free pages if not
        const pagesToRender = isPurchased ? pdf.numPages : Math.min(freePages, pdf.numPages);

        const containerWidth = viewerContainer?.clientWidth || 900;
        const containerPadding = 16;
        const availableWidth = Math.max(containerWidth - containerPadding, 280);

        for (let p = 1; p <= pagesToRender; p++) {
            const page = await pdf.getPage(p);
            const baseViewport = page.getViewport({ scale: 1 });
            const fitScale = availableWidth / baseViewport.width;
            const scale = Math.min(1.5, fitScale);
            const viewport = page.getViewport({ scale });
            const outputScale = Math.min(2, window.devicePixelRatio || 1);
            const scaledViewport = page.getViewport({ scale: scale * outputScale });
            const canvas = document.createElement('canvas');
            const context = canvas.getContext('2d');
            canvas.width = scaledViewport.width;
            canvas.height = scaledViewport.height;
            canvas.style.width = `${viewport.width}px`;
            canvas.style.height = `${viewport.height}px`;

            await page.render({ canvasContext: context, viewport: scaledViewport }).promise;

            const pageWrap = document.createElement('div');
            pageWrap.className = 'pdf-page';
            pageWrap.appendChild(canvas);
            viewer.appendChild(pageWrap);
        }

        // If not purchased and there are more pages, show unlock message
        if (!isPurchased && pdf.numPages > freePages) {
            const morePages = pdf.numPages - freePages;
            const pageWrap = document.createElement('div');
            pageWrap.className = 'pdf-page';
            pageWrap.innerHTML = `
                <div style="
                    background: var(--tertiary-dark);
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    height: 100%;
                    padding: 40px;
                    text-align: center;
                    color: var(--text-secondary);
                    border: 2px dashed var(--accent-primary);
                ">
                    <div style="font-size: 48px; margin-bottom: 20px;">🔒</div>
                    <h3 style="color: var(--accent-primary); margin-bottom: 10px; font-size: 1.4rem;">Continue Reading?</h3>
                    <p style="margin-bottom: 20px; font-size: 15px;">You've enjoyed the first ${book.freePages || 10} sample pages!</p>
                    <p style="margin-bottom: 30px; font-size: 13px; color: var(--text-tertiary);\"><strong>${morePages} more pages</strong> waiting in the complete book (${pdf.numPages} pages total).</p>
                    <button class="cta-button" onclick="initiatePurchase(${bookId})" style="padding: 12px 30px; width: 100%; max-width: 250px; cursor: pointer;">Unlock Full Book • ₹${book.price}</button>
                </div>
            `;
            viewer.appendChild(pageWrap);
        }

    } catch (err) {
        console.error('PDF load error:', err);
        showToast('Failed to load PDF. Check console for details.', 'error');
    }
}

function closePdfModal() {
    const modal = document.getElementById('pdfModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
    const viewer = document.getElementById('pdfViewer');
    if (viewer) viewer.innerHTML = '';
    pdfDocCache = null;
    activePdfBookId = null;
}

function buildStoryModal(story) {
    const isLiked = hasUserLiked(story.id, 'story');
    
    return `
        <div class="story-modal-body">
            <h2 class="story-modal-title">${story.title}</h2>
            
            <div class="story-modal-meta">
                <span><strong>Published:</strong> ${formatDate(story.date)}</span>
                <span><strong>Category:</strong> ${story.category}</span>
                <span><strong>Views:</strong> ${story.views}</span>
                <span><strong>Likes:</strong> ${story.likes}</span>
            </div>
            
            <div class="story-modal-content">
                ${story.content.split('\n').filter(p => p.trim()).map(para => `<p>${para.trim()}</p>`).join('')}
            </div>
            
            <div class="story-interaction">
                <button class="interaction-btn ${isLiked ? 'liked' : ''}" onclick="likeStory(${story.id})">
                    <span>${isLiked ? '❤️' : '🤍'}</span>
                    <span>${isLiked ? 'Liked' : 'Like'}</span>
                </button>
                <button class="interaction-btn" onclick="scrollToComments()">
                    <span>💬</span>
                    <span>Comment</span>
                </button>
                <button class="interaction-btn" onclick="shareStory('${story.title}')">
                    <span>📤</span>
                    <span>Share</span>
                </button>
            </div>
            
            <div class="comment-section" id="commentSection">
                <h3 style="margin-bottom: 20px; color: var(--text-primary);">Comments (${story.comments ? story.comments.length : 0})</h3>
                
                <form class="comment-form" onsubmit="addComment(event, ${story.id})">
                    <input type="text" class="comment-input" id="commentInput" placeholder="Share your thoughts..." required>
                    <button type="submit" class="btn-comment">Post</button>
                </form>
                
                <ul class="comments-list" id="commentsList">
                    ${buildCommentsList(story.comments || [])}
                </ul>
            </div>
        </div>
    `;
}

function buildCommentsList(comments) {
    if (!comments || comments.length === 0) {
        return '<li style="color: var(--text-tertiary); text-align: center; padding: 20px;">No comments yet. Be the first to share your thoughts!</li>';
    }
    
    return comments.map(comment => `
        <li class="comment-item">
            <div class="comment-author">${comment.author}</div>
            <div class="comment-text">${comment.text}</div>
            <div class="comment-date">${getTimeAgo(comment.date)}</div>
        </li>
    `).join('');
}

/* ========================================
   RENDER FUNCTIONS
   ======================================== */

async function renderWhatsNew() {
    const grid = document.getElementById('whatsNewGrid');
    if (!grid) return;
    
    const stories = await contentManager.getLatestStories(3);
    grid.innerHTML = stories.map(story => buildWhatsNewCard(story)).join('');
    
    // Add click handlers
    document.querySelectorAll('.whats-new-card').forEach(card => {
        card.addEventListener('click', () => openStoryModal(parseInt(card.dataset.storyId)));
    });
}

async function renderIncidents() {
    const grid = document.getElementById('incidentsGrid');
    if (!grid) return;
    
    const stories = await contentManager.getSortedStories('newest');
    grid.innerHTML = stories.map(story => buildStoryCard(story)).join('');
    
    // Add click handlers
    document.querySelectorAll('.story-card').forEach(card => {
        card.addEventListener('click', () => openStoryModal(parseInt(card.dataset.storyId)));
    });
    
    // Observe for animations
    observeElements('.story-card');
}

async function renderBooks() {
    const grid = document.getElementById('booksGrid');
    if (!grid) return;
    
    const books = await contentManager.getBooks();
    // Pass true to indicate this is the home page preview (shows navigation links)
    grid.innerHTML = books.map(book => buildBookCard(book, true)).join('');
    
    // Observe for animations
    observeElements('.book-card');
}

// ========================================
// MODAL FUNCTIONS
// ========================================

async function openStoryModal(storyId) {
    const story = await contentManager.getStoryById(storyId);
    if (!story) return;
    
    // Add view count
    story.views = (story.views || 0) + 1;
    addViewCount(storyId, 'story');
    
    const modal = document.getElementById('storyModal');
    const modalBody = document.getElementById('storyModalBody');
    
    modalBody.innerHTML = buildStoryModal(story);
    modal.classList.add('show');
    document.body.style.overflow = 'hidden';
    
    // Close modal on close button
    document.querySelector('.modal-close').addEventListener('click', closeStoryModal);
}

function closeStoryModal() {
    const modal = document.getElementById('storyModal');
    modal.classList.remove('show');
    document.body.style.overflow = 'auto';
}

function scrollToComments() {
    const commentSection = document.getElementById('commentSection');
    if (commentSection) {
        commentSection.scrollIntoView({ behavior: 'smooth' });
        document.getElementById('commentInput')?.focus();
    }
}

async function addComment(event, storyId) {
    event.preventDefault();
    
    const input = document.getElementById('commentInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    const story = await contentManager.getStoryById(storyId);
    if (!story) return;
    
    if (!story.comments) story.comments = [];
    
    story.comments.push({
        id: generateId(),
        author: 'Reader',
        text: text,
        date: new Date().toISOString()
    });
    
    // Update the UI
    const commentsList = document.getElementById('commentsList');
    commentsList.innerHTML = buildCommentsList(story.comments);
    
    input.value = '';
    showToast('Comment posted successfully!', 'success');
}

function likeStory(storyId) {
    const hasLiked = hasUserLiked(storyId, 'story');
    toggleLike(storyId, 'story');
    
    const btn = event.target.closest('.interaction-btn');
    if (hasLiked) {
        btn.classList.remove('liked');
        btn.innerHTML = '<span>🤍</span><span>Like</span>';
    } else {
        btn.classList.add('liked');
        btn.innerHTML = '<span>❤️</span><span>Liked</span>';
    }
    
    showToast(hasLiked ? 'Unliked' : 'Liked', 'success');
}

function shareStory(title) {
    const url = window.location.href;
    const text = `Check out "${title}" on OpenReaders!`;
    
    if (navigator.share) {
        navigator.share({
            title: 'OpenReaders',
            text: text,
            url: url
        });
    } else {
        // Fallback: copy to clipboard
        navigator.clipboard.writeText(`${text} ${url}`);
        showToast('Link copied to clipboard!', 'success');
    }
}

// ========================================
// BOOK FUNCTIONS
// ========================================

async function initiatePurchase(bookId) {
    console.log('initiatePurchase called with bookId:', bookId, typeof bookId);
    const book = await contentManager.getBookById(parseInt(bookId));
    if (!book) {
        console.error('Book not found for ID:', bookId);
        showToast('Book not found!', 'error');
        return;
    }
    console.log('Book found:', book.title);
    
    // Check if Razorpay is available
    if (typeof Razorpay === 'undefined') {
        showToast('Payment system not configured yet. Please contact support.', 'error');
        return;
    }
    
    // Check if already purchased
    const paidBooks = getFromLocalStorage('paid_books') || {};
    if (paidBooks[bookId]) {
        showToast('You have already purchased this book! Opening it now...', 'success');
        setTimeout(() => openBookPDF(bookId), 500);
        return;
    }
    
    // Get Razorpay Key from config
    const razorpayKey = CONFIG.payment?.razorpay?.keyId;
    if (!razorpayKey || razorpayKey === 'YOUR_RAZORPAY_KEY_ID') {
        showToast('Payment system not configured. Please check config.js', 'error');
        console.error('Razorpay Key ID not configured in config.js');
        return;
    }

    const serverUrl = CONFIG.payment?.razorpay?.serverUrl || '';

    try {
        // Step 1: Create order on server
        showToast('Initializing payment...', 'info');
        const orderResponse = await fetch(`${serverUrl}/api/create-order`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount: book.price,
                bookId: bookId,
                bookTitle: book.title
            }),
        });

        if (!orderResponse.ok) {
            throw new Error('Failed to create order. Please ensure the server is running.');
        }

        const orderData = await orderResponse.json();
        console.log('Order created:', orderData);

        // Step 2: Initialize Razorpay payment
        const options = {
            key: razorpayKey,
            amount: orderData.amount,
            currency: orderData.currency,
            order_id: orderData.id,
            name: CONFIG.site?.name || 'OpenReaders',
            description: `Purchase: ${book.title}`,
            image: book.cover || CONFIG.content?.defaultCover,
            handler: async function(response) {
                console.log('Payment response:', response);
                
                // Step 3: Verify payment on server
                try {
                    showToast('Verifying payment...', 'info');
                    const verifyResponse = await fetch(`${serverUrl}/api/verify-payment`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            bookId: bookId
                        }),
                    });

                    const verifyData = await verifyResponse.json();

                    if (verifyData.success) {
                        // Payment verified - record purchase
                        const paidBooks = getFromLocalStorage('paid_books') || {};
                        paidBooks[bookId] = {
                            bookTitle: book.title,
                            amount: book.price,
                            currency: 'INR',
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                            purchaseDate: new Date().toISOString(),
                            purchaseDateFormatted: new Date().toLocaleString('en-IN'),
                            status: 'verified'
                        };
                        
                        saveToLocalStorage('paid_books', paidBooks);
                        console.log('✅ Payment verified - Book ID:', bookId);
                        
                        showToast('🎉 Payment successful! Unlocking full book...', 'success');
                        
                        // Reload PDF to show full book
                        setTimeout(() => {
                            closePdfModal();
                            setTimeout(() => openBookPDF(bookId), 300);
                        }, 500);
                    } else {
                        showToast('❌ Payment verification failed. Please contact support.', 'error');
                    }
                } catch (error) {
                    console.error('Verification error:', error);
                    showToast('❌ Payment verification failed: ' + error.message, 'error');
                }
            },
            prefill: {
                name: '',
                email: '',
                contact: ''
            },
            theme: {
                color: CONFIG.payment?.razorpay?.theme || '#e94560'
            },
            modal: {
                ondismiss: function() {
                    console.log('Payment cancelled by user');
                    showToast('Payment cancelled. Book not unlocked.', 'warning');
                }
            }
        };
        
        const razorpay = new Razorpay(options);
        razorpay.open();

    } catch (error) {
        console.error('Purchase initiation error:', error);
        showToast('❌ Failed to initiate payment: ' + error.message, 'error');
    }
}

/* ========================================
   MAIN APPLICATION
   ======================================== */

document.addEventListener('DOMContentLoaded', () => {
    initializeApp();
});

async function initializeApp() {
    // Initialize navigation
    initializeNavigation();
    
    // Load and render content
    if (document.getElementById('whatsNewGrid')) {
        await renderWhatsNew();
    }
    
    if (document.getElementById('incidentsGrid')) {
        await renderIncidents();
    }
    
    if (document.getElementById('booksGrid')) {
        await renderBooks();
    }
    
    // Initialize event listeners
    initializeEventListeners();
    
    // Initialize animations
    observeElements('.story-card');
    observeElements('.book-card');
    observeElements('.whats-new-card');
}

/* ========================================
   NAVIGATION
   ======================================== */

function initializeNavigation() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Hamburger menu toggle
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    // Close menu when link is clicked
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            // Set active state
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
        });
    });
    
    // Update active nav link based on current page
    updateActiveNavLink();
    
    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.nav-container')) {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
        }
    });
}

function updateActiveNavLink() {
    const navLinks = document.querySelectorAll('.nav-link');
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    navLinks.forEach(link => {
        const href = link.getAttribute('href').split('/').pop();
        if (href === currentPage) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });
}

/* ========================================
   EVENT LISTENERS
   ======================================== */

function initializeEventListeners() {
    // Modal close button
    const modal = document.getElementById('storyModal');
    const closeBtn = document.querySelector('.modal-close');
    
    if (modal && closeBtn) {
        closeBtn.addEventListener('click', closeStoryModal);
        
        // Close modal when clicking outside
        window.addEventListener('click', (event) => {
            if (event.target === modal) {
                closeStoryModal();
            }
        });
    }
    
    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }
    
    // Scroll animations
    setupScrollAnimations();
    
    // Mobile responsiveness
    setupResponsiveListeners();
}

function handleNewsletterSubmit(e) {
    e.preventDefault();
    
    const email = e.target.querySelector('input[type="email"]').value;
    const subscribers = getFromLocalStorage('subscribers') || [];
    
    if (!subscribers.includes(email)) {
        subscribers.push(email);
        saveToLocalStorage('subscribers', subscribers);
    }
    
    e.target.reset();
    showToast('Successfully subscribed! We\'ll keep you updated.', 'success');
}

function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.story-card, .book-card, .whats-new-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });
}

function setupResponsiveListeners() {
    window.addEventListener('resize', debounce(() => {
        updateActiveNavLink();
    }, 250));
}

/* ========================================
   ADVANCED FEATURES
   ======================================== */

// Search functionality
function searchStories(query) {
    const lowerQuery = query.toLowerCase();
    const cards = document.querySelectorAll('.story-card');
    
    cards.forEach(card => {
        const title = card.querySelector('.story-title').textContent.toLowerCase();
        const preview = card.querySelector('.story-preview').textContent.toLowerCase();
        
        if (title.includes(lowerQuery) || preview.includes(lowerQuery)) {
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
}

// Reading progress bar
function initReadingProgressBar() {
    const progressBar = document.createElement('div');
    progressBar.className = 'reading-progress-bar';
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 4px;
        background: linear-gradient(90deg, #e94560, #7c3aed, #06b6d4);
        z-index: 999;
        width: 0%;
        transition: width 0.3s ease;
    `;
    document.body.appendChild(progressBar);
    
    window.addEventListener('scroll', () => {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });
}

// Analytics-ready structure
class Analytics {
    static trackPageView(page) {
        const analytics = getFromLocalStorage('analytics') || {};
        if (!analytics.pageViews) analytics.pageViews = {};
        analytics.pageViews[page] = (analytics.pageViews[page] || 0) + 1;
        saveToLocalStorage('analytics', analytics);
    }
    
    static trackStoryView(storyId) {
        const analytics = getFromLocalStorage('analytics') || {};
        if (!analytics.stories) analytics.stories = {};
        analytics.stories[storyId] = (analytics.stories[storyId] || 0) + 1;
        saveToLocalStorage('analytics', analytics);
    }
    
    static trackBookView(bookId) {
        const analytics = getFromLocalStorage('analytics') || {};
        if (!analytics.books) analytics.books = {};
        analytics.books[bookId] = (analytics.books[bookId] || 0) + 1;
        saveToLocalStorage('analytics', analytics);
    }
    
    static trackPurchase(bookId, amount) {
        const analytics = getFromLocalStorage('analytics') || {};
        if (!analytics.purchases) analytics.purchases = [];
        analytics.purchases.push({
            bookId,
            amount,
            date: new Date().toISOString()
        });
        saveToLocalStorage('analytics', analytics);
    }
    
    static getAnalytics() {
        return getFromLocalStorage('analytics') || {};
    }
}

// Initialize reading progress bar on modal open
document.addEventListener('DOMContentLoaded', () => {
    // Track initial page view
    Analytics.trackPageView(window.location.pathname);
});

/* ========================================
   KEYBOARD SHORTCUTS
   ======================================== */

document.addEventListener('keydown', (e) => {
    // Escape key to close modal
    if (e.key === 'Escape') {
        const modal = document.getElementById('storyModal');
        if (modal && modal.classList.contains('show')) {
            closeStoryModal();
        }
    }
    
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.focus();
        }
    }
});

/* ========================================
   PERFORMANCE OPTIMIZATION
   ======================================== */

// Lazy load images
function lazyLoadImages() {
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    }
}

// Initialize lazy loading
document.addEventListener('DOMContentLoaded', lazyLoadImages);

/* ========================================
   ACCESSIBILITY
   ======================================== */

// Add ARIA labels to interactive elements
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[role="button"]').forEach(btn => {
        if (!btn.getAttribute('aria-label')) {
            btn.setAttribute('aria-label', btn.textContent.trim());
        }
    });
});

/* ========================================
   DEBUG & DEVELOPMENT
   ======================================== */

function debugMode() {
    window.debug = {
        analytics: Analytics.getAnalytics(),
        subscribers: getFromLocalStorage('subscribers'),
        likedContent: getFromLocalStorage('likedContent'),
        viewedContent: getFromLocalStorage('viewedContent'),
        purchases: getFromLocalStorage('purchased_items') || [],
        clearAll: () => {
            localStorage.clear();
            console.log('LocalStorage cleared');
        },
        exportAnalytics: () => {
            return JSON.stringify(Analytics.getAnalytics(), null, 2);
        }
    };
    
    console.log('Debug mode enabled. Use window.debug to access data.');
}

// Uncomment for debugging
// debugMode();

/* ========================================
   INITIALIZATION COMPLETE
   ======================================== */

// Ensure DOM is fully loaded before running app
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeApp);
} else {
    initializeApp();
}
// Payment Function
async function payNow(amount) {
  const serverUrl = CONFIG.payment?.razorpay?.serverUrl || '';
  const response = await fetch(`${serverUrl}/api/create-order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount }),
  });

  const order = await response.json();

  const options = {
    key: CONFIG.payment.razorpay.keyId,
    amount: order.amount,
    currency: "INR",
    name: "OpenReaders",
    description: "Book Purchase",
    order_id: order.id,
    handler: async function (response) {
      const verifyRes = await fetch(`${serverUrl}/api/verify-payment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(response),
      });

      const result = await verifyRes.json();

      if (result.success) {
        alert("Payment Successful 🎉");
      } else {
        alert("Payment Verification Failed");
      }
    },
    theme: {
      color: "#6C63FF",
    },
  };

  const rzp = new Razorpay(options);
  rzp.open();
}

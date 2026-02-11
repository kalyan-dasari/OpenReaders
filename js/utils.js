/* ========================================
   UTILITIES
   ======================================== */

// Format date
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

// Get time ago
function getTimeAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    if (seconds < 3600) return Math.floor(seconds / 60) + 'm ago';
    if (seconds < 86400) return Math.floor(seconds / 3600) + 'h ago';
    if (seconds < 2592000) return Math.floor(seconds / 86400) + 'd ago';
    
    return formatDate(dateString);
}

// Truncate text
function truncateText(text, length) {
    if (text.length <= length) return text;
    return text.substr(0, length).trim() + '...';
}

// Generate unique ID
function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Save to localStorage
function saveToLocalStorage(key, data) {
    localStorage.setItem(key, JSON.stringify(data));
}

// Get from localStorage
function getFromLocalStorage(key) {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
}

// Debounce function
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Smooth scroll
function smoothScroll(element) {
    element.scrollIntoView({ behavior: 'smooth' });
}

// Show toast notification
function showToast(message, type = 'info', duration = 3000) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.textContent = message;
    
    const style = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        padding: 15px 20px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideInUp 0.3s ease-out;
        font-weight: 500;
    `;
    
    toast.style.cssText = style;
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slideOutDown 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Check if user liked content
function hasUserLiked(contentId, contentType) {
    const likedContent = getFromLocalStorage('likedContent') || {};
    const key = `${contentType}-${contentId}`;
    return likedContent[key] === true;
}

// Toggle like
function toggleLike(contentId, contentType) {
    const likedContent = getFromLocalStorage('likedContent') || {};
    const key = `${contentType}-${contentId}`;
    
    if (likedContent[key]) {
        delete likedContent[key];
    } else {
        likedContent[key] = true;
    }
    
    saveToLocalStorage('likedContent', likedContent);
    return !likedContent[key] === false;
}

// Add view count
function addViewCount(contentId, contentType) {
    const views = getFromLocalStorage('viewedContent') || {};
    const key = `${contentType}-${contentId}`;
    views[key] = (views[key] || 0) + 1;
    saveToLocalStorage('viewedContent', views);
}

// Initialize animations on scroll
function observeElements(selector) {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeIn 0.6s ease-out forwards';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll(selector).forEach(el => {
        observer.observe(el);
    });
}

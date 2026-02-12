// OpenReaders Configuration File
// Customize your site here without touching code

const CONFIG = {
    // Site Information
    site: {
        name: "OpenReaders",
        tagline: "Where Stories Breathe",
        description: "A platform where stories matter, writers shine, and readers discover magic in words",
        logo: "📖",
        url: "https://openreaders.com",
        author: "Your Name Here"
    },

    // Contact Information
    contact: {
        email: "hello@openreaders.com",
        twitter: "https://twitter.com/openreaders",
        instagram: "https://instagram.com/openreaders",
        facebook: "https://facebook.com/openreaders"
    },

    // Payment Configuration
    payment: {
        razorpay: {
            // The public Key ID (Razorpay). It is safe to expose client-side.
            // This value will prefer a runtime override from `window.__ENV.RAZORPAY_KEY_ID`
            // or `process.env.RAZORPAY_KEY_ID` when available (for build-time injection).
            keyId: (typeof window !== 'undefined' && window.__ENV && window.__ENV.RAZORPAY_KEY_ID) ||
                   (typeof process !== 'undefined' && process.env && process.env.RAZORPAY_KEY_ID) ||
                   "rzp_test_SF5FUt53kArMSm", // Updated to match .env test key
            enabled: true,
            currency: "INR",
            theme: "#e94560",
            serverUrl: "http://localhost:5000" // Backend server URL
        },
        testMode: true // Set to false in production (currently using TEST keys)
    },

    // Content Settings
    content: {
        storiesPerPage: 12,
        booksPerPage: 6,
        previewLength: 120, // Characters for preview
        freeChapters: 2, // Number of free chapters
        defaultCover: "📚" // Emoji fallback for book covers
    },

    // Analytics
    analytics: {
        googleAnalyticsId: "GA_MEASUREMENT_ID", // Optional
        enableTracking: false,
        trackPageViews: true,
        trackUserActions: true
    },

    // Design Customization
    theme: {
        colors: {
            primaryDark: "#0f0f1e",
            secondaryDark: "#1a1a2e",
            tertiaryDark: "#16213e",
            accentPrimary: "#e94560",      // Main color
            accentSecondary: "#7c3aed",    // Secondary
            accentTertiary: "#06b6d4",     // Tertiary
            textPrimary: "#f5f5f7",
            textSecondary: "#b0b0b8",
            textTertiary: "#808088",
            borderColor: "#2d2d3d"
        },
        fonts: {
            primary: "'Poppins', sans-serif",
            secondary: "'Crimson Text', serif"
        },
        animations: {
            enabled: true,
            transitionFast: "0.2s",
            transitionSmooth: "0.3s",
            transitionSlow: "0.5s"
        }
    },

    // Feature Flags
    features: {
        comments: true,
        likes: true,
        shares: true,
        reading_progress: true,
        newsletter: true,
        dark_mode_toggle: false, // For future
        user_accounts: false, // For future
        advanced_search: true,
        book_samples: true,
        payment_system: true,
        analytics: true,
        admin_panel: true
    },

    // SEO Settings
    seo: {
        metaDescription: "Discover compelling short stories, incidents, and books on OpenReaders",
        keywords: ["stories", "books", "short stories", "reading platform", "indie authors"],
        ogImage: "assets/images/og-image.jpg",
        twitter: "@openreaders",
        language: "en-US",
        robots: "index, follow"
    },

    // Email Configuration (for future backend)
    email: {
        provider: "sendgrid", // or "mailgun", "smtp"
        apiKey: "YOUR_EMAIL_API_KEY",
        fromEmail: "noreply@openreaders.com",
        fromName: "OpenReaders"
    },

    // Notifications
    notifications: {
        enabled: true,
        toastDuration: 3000, // milliseconds
        positions: {
            success: "bottom-right",
            error: "bottom-right",
            info: "bottom-right",
            warning: "bottom-right"
        }
    },

    // Advanced Settings
    advanced: {
        localStorage: {
            enabled: true,
            prefix: "openreaders_"
        },
        debugMode: false, // Set to true for debugging
        apiEndpoint: "/api/", // For future backend integration
        cacheContent: true,
        cacheDuration: 3600000 // 1 hour
    }
};

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}

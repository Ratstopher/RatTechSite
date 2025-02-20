const CONFIG = {
    API: {
        baseUrl: window.location.hostname === 'localhost' 
            ? 'http://localhost:5000/api'  // Development
            : 'https://api.rattech.com',   // Production
        key: 'RAT_TECH_PUBLIC_KEY_2024',
        timeout: 5000 // 5 seconds timeout
    },
    AUTH: {
        tokenKey: 'rat_tech_auth_token',
        refreshInterval: 3600000 // 1 hour
    }
};

// Add error handling for API availability
const checkApiAvailability = async () => {
    try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), CONFIG.API.timeout);
        
        const response = await fetch(`${CONFIG.API.baseUrl}/health`, {
            signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        return response.ok;
    } catch (error) {
        console.warn('API Health Check Failed:', error);
        return false;
    }
};

// Initialize API health check
checkApiAvailability().then(isAvailable => {
    if (!isAvailable) {
        console.warn('API is not available, falling back to offline mode');
        // Implement offline fallback if needed
    }
}); 
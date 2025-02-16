class AuthService {
    constructor() {
        this.baseUrl = CONFIG.API.baseUrl;
        this.token = localStorage.getItem(CONFIG.AUTH.tokenKey);
        this.retryAttempts = 3;
        this.retryDelay = 1000; // 1 second
    }

    async login(email, password) {
        let attempt = 0;
        while (attempt < this.retryAttempts) {
            try {
                const response = await fetch(`${this.baseUrl}/login`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'X-API-Key': CONFIG.API.key
                    },
                    body: JSON.stringify({ email, password })
                });

                if (!response.ok) {
                    if (response.status === 503) {
                        throw new Error('Service temporarily unavailable');
                    }
                    throw new Error('Login failed');
                }

                const data = await response.json();
                this.token = data.token;
                localStorage.setItem(CONFIG.AUTH.tokenKey, data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                return data;
            } catch (error) {
                console.error(`Login attempt ${attempt + 1} failed:`, error);
                if (attempt === this.retryAttempts - 1) {
                    throw new Error('Unable to connect to the server. Please try again later.');
                }
                await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                attempt++;
            }
        }
    }

    async register(userData) {
        try {
            const response = await fetch(`${this.baseUrl}/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                throw new Error('Registration failed');
            }

            return await response.json();
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    }

    logout() {
        localStorage.removeItem(CONFIG.AUTH.tokenKey);
        localStorage.removeItem('user');
        window.location.href = '/login.html';
    }

    isAuthenticated() {
        return !!this.token;
    }

    getToken() {
        return this.token;
    }
}

// Add offline detection
window.addEventListener('online', () => {
    checkApiAvailability().then(isAvailable => {
        if (isAvailable) {
            console.log('Connection restored, resuming normal operation');
            // Implement reconnection logic
        }
    });
});

window.addEventListener('offline', () => {
    console.warn('Connection lost, switching to offline mode');
    // Implement offline mode logic
});

const auth = new AuthService(); 
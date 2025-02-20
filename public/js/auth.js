class AuthService {
    constructor() {
        this.baseUrl = CONFIG.API.baseUrl;
        this.token = localStorage.getItem(CONFIG.AUTH.tokenKey);
    }

    async login(email, password) {
        try {
            const response = await this.makeRequest('/login', {
                method: 'POST',
                body: { email, password }
            });

            if (response.token) {
                this.setSession(response);
                return response;
            }
            throw new Error('Login failed');
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    }

    async register(userData) {
        try {
            const response = await this.makeRequest('/register', {
                method: 'POST',
                body: userData
            });

            if (response.token) {
                this.setSession(response);
                return response;
            }
            throw new Error('Registration failed');
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
        return !!this.token && !this.isTokenExpired();
    }

    async makeRequest(endpoint, options = {}) {
        try {
            const response = await fetch(`${this.baseUrl}${endpoint}`, {
                ...options,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': this.token ? `Bearer ${this.token}` : '',
                    ...options.headers
                },
                body: options.body ? JSON.stringify(options.body) : null
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    setSession(authResult) {
        this.token = authResult.token;
        localStorage.setItem(CONFIG.AUTH.tokenKey, authResult.token);
        localStorage.setItem('user', JSON.stringify(authResult.user));
    }

    isTokenExpired() {
        try {
            const token = this.token;
            if (!token) return true;
            
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp < Date.now() / 1000;
        } catch (error) {
            return true;
        }
    }
}

const auth = new AuthService();

// Add offline support
window.addEventListener('online', async () => {
    const isAvailable = await checkApiAvailability();
    if (isAvailable) {
        // Sync any offline data
        console.log('Connection restored');
    }
});

window.addEventListener('offline', () => {
    console.log('Connection lost - working offline');
}); 
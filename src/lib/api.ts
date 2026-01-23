// API client for FoodDay - Calls local Next.js API routes
// Las rutas locales hacen de proxy al backend (más seguro)

interface ApiOptions {
    method?: string;
    body?: any;
    token?: string;
}

async function apiCall(endpoint: string, options: ApiOptions = {}) {
    const { method = 'GET', body, token } = options;

    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    const config: RequestInit = {
        method,
        headers,
    };

    if (body && method !== 'GET') {
        config.body = JSON.stringify(body);
    }

    const response = await fetch(endpoint, config);

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'API Error' }));
        throw new Error(errorData.message || `Error ${response.status}`);
    }

    return response.json();
}

export const foodDayApi = {
    // Request magic link
    requestMagicLink: async (email: string) => {
        return apiCall('/api/auth/request-magic-link', {
            method: 'POST',
            body: { email },
        });
    },

    // Validate token and set password
    setPassword: async (token: string, password: string, confirmPassword: string) => {
        return apiCall('/api/auth/set-password', {
            method: 'POST',
            body: { token, password, confirmPassword },
        });
    },

    // Login
    login: async (email: string, password: string) => {
        return apiCall('/api/auth/login', {
            method: 'POST',
            body: { email, password },
        });
    },

    // Get my tickets (requires JWT)
    getMyTickets: async (token: string) => {
        return apiCall('/api/tickets', {
            method: 'GET',
            token,
        });
    },

    // Update ticket (requires JWT)
    updateTicket: async (token: string, prodinfoid: number, data: any) => {
        return apiCall(`/api/tickets/${prodinfoid}`, {
            method: 'PUT',
            token,
            body: data,
        });
    },

    // Forgot password
    forgotPassword: async (email: string) => {
        return apiCall('/api/auth/forgot-password', {
            method: 'POST',
            body: { email },
        });
    },

    // NEW: Login with magic link token
    loginWithMagicLink: async (token: string) => {
        return apiCall('/api/auth/login-magic-link', {
            method: 'POST',
            body: { token },
        });
    },
};

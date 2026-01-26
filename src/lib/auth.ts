// JWT and authentication utilities
const JWT_KEY = 'foodday_session_token';

export const authUtils = {
    // Save JWT to localStorage
    saveToken: (token: string) => {
        if (typeof window !== 'undefined') {
            localStorage.setItem(JWT_KEY, token);
        }
    },

    // Get JWT from localStorage
    getToken: (): string | null => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem(JWT_KEY);
        }
        return null;
    },

    // Remove JWT (logout)
    clearToken: () => {
        if (typeof window !== 'undefined') {
            localStorage.removeItem(JWT_KEY);
        }
    },

    // Check if user is authenticated
    isAuthenticated: (): boolean => {
        return !!authUtils.getToken();
    },

    // Decode JWT payload (simple, no verification - server does that)
    decodeToken: (token: string): any => {
        try {
            const payload = token.split('.')[1];
            return JSON.parse(atob(payload));
        } catch {
            return null;
        }
    },

    // Check if token is expired (client-side only, server validates too)
    isTokenExpired: (token: string): boolean => {
        const decoded = authUtils.decodeToken(token);
        if (!decoded || !decoded.exp) return true;

        return decoded.exp * 1000 < Date.now();
    },
};

// Provincias de Argentina
export const PROVINCIAS_ARGENTINA = [
    'Buenos Aires',
    'CABA',
    'Catamarca',
    'Chaco',
    'Chubut',
    'Córdoba',
    'Corrientes',
    'Entre Ríos',
    'Formosa',
    'Jujuy',
    'La Pampa',
    'La Rioja',
    'Mendoza',
    'Misiones',
    'Neuquén',
    'Río Negro',
    'Salta',
    'San Juan',
    'San Luis',
    'Santa Cruz',
    'Santa Fe',
    'Santiago del Estero',
    'Tierra del Fuego',
    'Tucumán',
];

// Industrias
export const INDUSTRIAS = [
    'Pizzas',
    'Hamburguesas',
    'Sushi',
    'Cocina italiana',
    'Cocina mexicana',
    'Parrilla / carnes',
    'Pollo / alitas',
    'Comida saludable',
    'Cafetería / bakery',
    'Postres / heladería',
    'Logística / última milla',
    'Marketplace / agregadores',
    'Sistemas y ERPs',
    'Otros'
];


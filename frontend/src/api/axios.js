import axios from 'axios';

const getBaseURL = () => {
    if (import.meta.env.VITE_API_URL) {
        return import.meta.env.VITE_API_URL;
    }
    if (typeof window !== 'undefined' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')) {
        return 'http://localhost:5000/api';
    }
    return 'https://campushire-backend-ojiu.onrender.com/api';
};

const API = axios.create({
    baseURL: getBaseURL(),
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// ✅ Attach Bearer Token to Every Request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

// ✅ Response Interceptor - 401 Unauthorized handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            const url = error.config?.url || '';
            const isAuthRoute =
                url.includes('/auth/login') ||
                url.includes('/auth/signup') ||
                url.includes('/auth/me') ||
                url.includes('/auth/forgot-password') ||
                url.includes('/auth/reset-password');

            if (!isAuthRoute) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/login')) {
                    window.location.href = '/login';
                }
            }
        }
        return Promise.reject(error);
    }
);

export default API;
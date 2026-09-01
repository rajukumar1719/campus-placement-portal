import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    withCredentials: true,  // ✅ Cookie automatically send hogi
    headers: {
        'Content-Type': 'application/json'
    }
});

// ✅ REMOVED: Request Interceptor (no need to manually send token)

// ✅ Response Interceptor - 401 error pe logout karo
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired ya invalid
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
import axios from 'axios';

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'https://campushire-backend-ojiu.onrender.com/api',
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Response Interceptor - 401 Unauthorized handling
API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default API;
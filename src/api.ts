import axios from 'axios';
import { getRefreshToken, saveTokens, clearTokens } from './utils/token';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
});

api.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            const refreshToken = getRefreshToken();
            if (refreshToken) {
                try {
                    const response = await api.post('/auth/refresh', { // Изменено на api.post
                        refreshToken,
                    });
                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    saveTokens(accessToken, newRefreshToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return api(originalRequest);
                } catch (refreshError) {
                    clearTokens();
                    window.location.href = '/sign-in';
                    return Promise.reject(refreshError);
                }
            } else {
                clearTokens();
                window.location.href = '/sign-in';
            }
        }
        return Promise.reject(error);
    }
);

export default api;
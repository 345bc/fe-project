import axios from 'axios';

const tokenBearer = axios.create({
    baseURL: 'http://localhost:8080',
});

tokenBearer.interceptors.request.use(
    (config) => {
        if (typeof window !== 'undefined') {
            const token = localStorage.getItem('token');
            if (token) {
                config.headers.Authorization = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export default tokenBearer;
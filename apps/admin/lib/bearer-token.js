import axios from "axios";

const tokenBearer = axios.create({
  baseURL: "http://localhost:8080",
});

tokenBearer.interceptors.request.use((config) => {
  // Do not send Authorization header for authentication endpoints to prevent Spring Security from rejecting requests with expired tokens
  if (config.url && (config.url.includes("/auth/sign-in") || config.url.includes("/auth/admin/sign-in"))) {
    return config;
  }

  const token = document.cookie
    .split(';')
    .find(row => row.trim().startsWith('access_token='))
    ?.trim()
    ?.split('=')[1];

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default tokenBearer;

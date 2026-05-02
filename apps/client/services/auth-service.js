import axios from 'axios';
import tokenBearer from '@/lib/bearer-token'

const API_URL = 'http://localhost:8080';
const authService = {
  // Sign Up
  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}/users`, {
        name: userData.name,
        email: userData.email,
        password: userData.password,
      });
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Sign-Up failed'
      };
    }
  },

  // Sign In
  async signIn(credentials) {
    try {
      const response = await tokenBearer.post("/auth/signin", {
        username: credentials.username,
        password: credentials.password
      });
      
      const springData = response.data.data; 

      if (springData && springData.token) {
      localStorage.setItem('token', springData.token);
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Sign-in failed'
      };
    }
  },

  // Logout
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Lấy user hiện tại
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  // Kiểm tra đã login chưa
  isAuthenticated() {
    return localStorage.getItem('token') !== null;
  }
};

export default authService;
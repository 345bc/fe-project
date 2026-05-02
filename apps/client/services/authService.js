import axios from 'axios';

const API_URL = 'http://localhost:8080/users';
const authService = {
  // Sign Up
  async signup(userData) {
    try {
      const response = await axios.post(`${API_URL}`, {
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

  // Đăng nhập (sẽ làm sau)
  async login(credentials) {
    try {
      const response = await axios.post(`${API_URL}/login`, {
        username: credentials.username,
        password: credentials.password
      });
      
      if (response.data.token) {
        // Lưu token vào localStorage
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || 'Login failed'
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
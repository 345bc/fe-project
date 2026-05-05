import tokenBearer from '@/lib/bearer-token'

const API_URL = 'http://localhost:8080';
const authService = {
  // Sign In
  async signIn(credentials) {
  try {
    const response = await tokenBearer.post("/auth/admin/sign-in", {
      username: credentials.username,
      password: credentials.password
    });

    const springData = response.data.data;

    if (springData?.token) {
      document.cookie = `access_token=${springData.token}; path=/`;
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
  document.cookie = "access_token=; Max-Age=0; path=/";
  window.location.href = "/sign-in";
}

};

export default authService;
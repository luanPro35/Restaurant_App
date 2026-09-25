import api from "./axios.instance";

export const authApi = {
  // POST: http://localhost:4000/api/v1/auth/register
  register: async (userData: any) => {
    const response = await api.post("/auth/register", userData);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/login
  login: async (credentials: any) => {
    const response = await api.post("/auth/login", credentials);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/google
  googleLogin: async (data: {
    code?: string;
    redirectUri?: string;
    token?: string;
    email?: string;
    name?: string;
    photo?: string;
    googleId?: string;
  }) => {
    const response = await api.post("/auth/google", data);
    return response.data;
  },


  // POST: http://localhost:4000/api/v1/auth/login/admin
  adminLogin: async (credentials: any) => {
    const response = await api.post("/auth/login/admin", credentials);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/refresh-token
  refreshToken: async (token: string) => {
    const response = await api.post("/auth/refresh-token", {
      refreshToken: token,
    });
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/logout
  logout: async () => {
    const response = await api.post("/auth/logout");
    return response.data;
  },

  // GET: http://localhost:4000/api/v1/auth/profile
  getProfile: async () => {
    const response = await api.get("/auth/profile");
    return response.data;
  },

  // PATCH: http://localhost:4000/api/v1/auth/profile
  updateProfile: async (data: any) => {
    const response = await api.patch("/auth/profile", data);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/forgot-password
  forgotPassword: async (email: string) => {
    const response = await api.post("/auth/forgot-password", { email });
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/reset-password
  resetPassword: async (data: any) => {
    const response = await api.post("/auth/reset-password", data);
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/send-otp
  sendOtp: async (email: string) => {
    const response = await api.post("/auth/send-otp", { email });
    return response.data;
  },

  // POST: http://localhost:4000/api/v1/auth/verify-otp
  verifyOtp: async (email: string, otp: string) => {
    const response = await api.post("/auth/verify-otp", { email, otp });
    return response.data;
  },
};

export default authApi;

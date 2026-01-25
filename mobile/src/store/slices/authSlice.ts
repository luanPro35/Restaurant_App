// import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  isAuthenticated: false,
};

export const authSlice = {
  name: "auth",
  initialState,
  reducers: {
    login: (state: any, action: any) => {},
    logout: (state: any) => {},
  },
};

// export const { login, logout } = authSlice.actions;
// export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";
import { useEffect } from "react";

const token = localStorage.getItem("token");
const userData = localStorage.getItem("userData");
const initialState = {
  users: userData ? JSON.parse(userData) : {},
  isAuthenticated: userData?true :false,
  token: token ? token : "",
};

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action) => {
      const { user, token } = action.payload;
      state.users = user;
      state.isAuthenticated = true;
      state.token = token;
    },
    removeUser: (state, { payload }) => {
      state.users = payload;
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, removeUser } = userSlice.actions;

export default userSlice.reducer;

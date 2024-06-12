import { createSlice } from "@reduxjs/toolkit";

export const authSlice = createSlice({
  name: "auth",
  initialState: {
    accessToken: localStorage.getItem("access_token") || null,
    user: JSON.parse(localStorage.getItem("user")) || null,
  },
  reducers: {
    setCredentials: (state, action) => {
        console.log("function called")

      state.accessToken = action.payload.token;
      state.user = action.payload.user;
      //state.role = action.payload.auth.user.role;
      localStorage.setItem("access_token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      //localStorage.setItem("user role",JSON.stringify(action.payload.role))
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    logout: (state) => {
      state.accessToken = null;
      state.user = null
      localStorage.clear()
    },
  },
});

export const { setCredentials, logout } = authSlice.actions;

export const selectAccessToken = (state) => state.auth.accessToken;

export const selectUser = (state) => {
  //console.log('selectUser:', state.auth.user);
  return state.auth.user;
};

// export const selectUser = (state) => {
//   //console.log('selectUser:', state.auth.user);
//   return state.auth.user;
// };
//export const selectUser = (state) => state.auth.user && state.auth.user.role;

export const setUser =(user) => {
  return { type: 'SET_USER', payload: user };
}

export default authSlice.reducer;

import { createSlice } from "@reduxjs/toolkit";

// Load initial authentication state from localStorage safely
const storedOwner = localStorage.getItem("loggedInOwner");
const storedIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";

const initialState = {
  owner: storedOwner ? JSON.parse(storedOwner) : null,
  isLoggedIn: storedIsLoggedIn,
};

const ownerSlice = createSlice({
  name: "owner",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      state.owner = action.payload;
      state.isLoggedIn = true;
      
      // Keep localStorage in sync
      localStorage.setItem("loggedInOwner", JSON.stringify(action.payload));
      localStorage.setItem("isLoggedIn", "true");
    },
    logoutSuccess: (state) => {
      state.owner = null;
      state.isLoggedIn = false;
      
      // Clean up localStorage
      localStorage.removeItem("loggedInOwner");
      localStorage.removeItem("isLoggedIn");
    },
    updateProfile: (state, action) => {
      state.owner = { ...state.owner, ...action.payload };
      localStorage.setItem("loggedInOwner", JSON.stringify(state.owner));
    }
  },
});

export const { loginSuccess, logoutSuccess, updateProfile } = ownerSlice.actions;
export default ownerSlice.reducer;
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  saved: JSON.parse(localStorage.getItem("savedProperties")) || [],
};

const savedPropertiesSlice = createSlice({
  name: "savedProperties",
  initialState,
  reducers: {
    addToSaved: (state, action) => {
      const exists = state.saved.find((prop) => prop.id === action.payload.id);
      if (!exists) {
        state.saved.push(action.payload);
        localStorage.setItem("savedProperties", JSON.stringify(state.saved));
      }
    },
    removeFromSaved: (state, action) => {
      state.saved = state.saved.filter((prop) => prop.id !== action.payload);
      localStorage.setItem("savedProperties", JSON.stringify(state.saved));
    },
    clearSaved: (state) => {
      state.saved = [];
      localStorage.removeItem("savedProperties");
    },
  },
});

export const { addToSaved, removeFromSaved, clearSaved } = savedPropertiesSlice.actions;
export default savedPropertiesSlice.reducer;

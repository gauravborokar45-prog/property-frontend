import { configureStore } from "@reduxjs/toolkit";
import savedPropertiesReducer from "./savedPropertiesSlice";
import ownerReducer from "./ownerSlice"; // Import your new owner slice reducer

export const store = configureStore({
  reducer: {
    savedProperties: savedPropertiesReducer,
    owner: ownerReducer, // Mount the owner slice state globally
  },
});
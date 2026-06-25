import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";

import "./index.css";
import { store } from "./redux/Store";
import { OwnerProvider } from "./context/OwnerContext";
import { UserProvider } from "./context/UserContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
      <OwnerProvider> 
        <UserProvider>
        <App />
         </UserProvider>
         </OwnerProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);

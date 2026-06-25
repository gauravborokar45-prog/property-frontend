import React, { createContext, useContext, useState, useEffect } from "react";

// 1. Create the Context Store
const OwnerContext = createContext(null);

// 2. Create the Provider Component
export function OwnerProvider({ children }) {
  const [owner, setOwner] = useState(() => {
    // Sync state directly with localStorage on initial application load
    const storedOwner = localStorage.getItem("loggedInOwner");
    return storedOwner ? JSON.parse(storedOwner) : null;
  });

  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem("isLoggedIn") === "true";
  });

  // Watch state changes and mirror them into localStorage
  useEffect(() => {
    if (owner && isLoggedIn) {
      localStorage.setItem("loggedInOwner", JSON.stringify(owner));
      localStorage.setItem("isLoggedIn", "true");
    } else {
      localStorage.removeItem("loggedInOwner");
      localStorage.removeItem("isLoggedIn");
    }
  }, [owner, isLoggedIn]);

  // Handle updates when a user logs in (Expects the complete Owner object payload)
  const login = (ownerData) => {
    setOwner(ownerData);
    setIsLoggedIn(true);
  };

  // Handle resets when a user logs out
  const logout = () => {
    setOwner(null);
    setIsLoggedIn(false);
  };

  return (
    <OwnerContext.Provider value={{ owner, isLoggedIn, login, logout }}>
      {children}
    </OwnerContext.Provider>
  );
}

// 3. Custom Hook for clean consumption in components
export function useOwner() {
  const context = useContext(OwnerContext);
  if (!context) {
    throw new Error("useOwner must be used within an OwnerProvider");
  }
  return context;
}
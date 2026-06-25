import React, { createContext, useContext, useState, useEffect } from "react";

// Initialize the global React Context for Users
const UserContext = createContext();

/**
 * Global User Session Provider.
 * Separates user (renter) authentication states from owner accounts.
 */
export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  // Sync and restore user session from LocalStorage when the app first loads
  useEffect(() => {
    const storedUser = localStorage.getItem("app_user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setIsUserLoggedIn(true);
      } catch (error) {
        console.error("Session restoration failed. Clearing corrupted data:", error);
        localStorage.removeItem("app_user");
      }
    }
    setLoading(false);
  }, []);

  /**
   * Logs a user in and saves their session state locally.
   * @param {Object} userData - The authenticated User object returned from the backend.
   */
  const loginUser = (userData) => {
    setUser(userData);
    setIsUserLoggedIn(true);
    localStorage.setItem("app_user", JSON.stringify(userData));
  };

  /**
   * Clears the user state and destroys the active local session.
   */
  const logoutUser = () => {
    setUser(null);
    setIsUserLoggedIn(false);
    localStorage.removeItem("app_user");
  };

  return (
    <UserContext.Provider value={{ user, isUserLoggedIn, loginUser, logoutUser, loading }}>
      {!loading && children}
    </UserContext.Provider>
  );
}

/**
 * Custom hook to easily grab user context parameters in individual components.
 */
export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used inside a child component within a <UserProvider> wrapper.");
  }
  return context;
}
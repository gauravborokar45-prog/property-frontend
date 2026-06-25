import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useUser } from "../context/UserContext"; // 📦 Import your User Context hook
import { Heart, Menu, X, User, LogOut } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false); 
  const [isProfileOpen, setIsProfileOpen] = useState(false); 
  const navigate = useNavigate();

  // 1. Consume the user object details from your custom context hook
  const { user, logoutUser } = useUser();

  const savedCount = useSelector((state) => state.savedProperties.saved.length);
  
  // 🔐 Account Type Lookups
  const isOwnerAuthenticated = localStorage.getItem("isLoggedIn") === "true";
  
  // Checks for "isUserLoggedIn", or if a user context object exists safely
  const isUserAuthenticated = 
    localStorage.getItem("isUserLoggedIn") === "true" || !!user;
  
  // True if either an Owner or a User is logged in
  const anyAuthenticated = isOwnerAuthenticated || isUserAuthenticated;

  // Unified Sign Out Handler
  const handleLogout = () => {
    // Context clean-up for the renter profile session
    if (typeof logoutUser === "function") {
      logoutUser();
    }

    // Clear absolutely everything out of browser storage to force a clean slate
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("isUserLoggedIn");
    localStorage.removeItem("userToken");
    localStorage.removeItem("user");
    
    setIsProfileOpen(false);
    setIsOpen(false);
    
    // Redirect cleanly based on who logged out
    if (isOwnerAuthenticated) {
      navigate("/login-owner");
    } else {
      navigate("/login-user");
    }
  };

  return (
    <nav className="bg-gradient-to-r from-white via-blue-50 to-white shadow-sm p-4 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Brand Logo */}
        <Link
          to="/"
          className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-500 via-teal-500 via-blue-600 to-indigo-700 text-transparent bg-clip-text hover:opacity-90 transition"
        >
          YouShell
        </Link>

        {/* --- DESKTOP NAVIGATION --- */}
        <ul className="hidden md:flex gap-8 text-gray-700 items-center font-medium">
          <li>
            <Link to="/" className="hover:text-indigo-600 transition">Home</Link>
          </li>
          <li>
            <Link to="/all-properties" className="hover:text-indigo-600 transition">Options</Link>
          </li>
          {/* Hide favorites pipeline counter if active session is an Owner */}
          {!isOwnerAuthenticated && (
            <li>
              <Link
                to="/saved-properties"
                className="hover:text-indigo-600 flex items-center gap-1 relative transition"
              >
                <Heart className="w-5 h-5" />
                {savedCount > 0 && (
                  <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full shadow">
                    {savedCount}
                  </span>
                )}
              </Link>
            </li>
          )}
          <li>
            <Link to="#" className="hover:text-indigo-600 transition">About</Link>
          </li>
          <li>
            <Link to="#" className="hover:text-indigo-600 transition">Contact</Link>
          </li>
        </ul>

        {/* --- DESKTOP PORTAL ACTIONS --- */}
        <div className="hidden md:flex gap-3 items-center relative">
          
          {/* Restrict "List Property" so regular Users can't see or access it */}
          {!isUserAuthenticated && (
            <Link
              to="/list-property"
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition font-medium mr-2"
            >
              List Property
            </Link>
          )}

          {anyAuthenticated ? (
            /* SHOWS THIS SECTION IF ANYONE (USER OR OWNER) IS LOGGED IN */
            <div className="flex items-center gap-3">
              
              {/* Profile Avatar Control */}
              <div className="relative">
                <button
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="flex items-center gap-2 border p-2 rounded-full hover:bg-gray-100 transition focus:outline-none cursor-pointer"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white shadow-sm ${
                    isOwnerAuthenticated ? "bg-indigo-600" : "bg-emerald-600"
                  }`}>
                    {/* Display first initial dynamically if the object matches */}
                    {isOwnerAuthenticated ? "O" : (user?.name ? user.name.charAt(0).toUpperCase() : "U")}
                  </div>
                </button>

                {isProfileOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white border rounded-xl shadow-lg py-2 z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <span className="text-xs text-gray-400 block font-semibold uppercase tracking-wider">
                        {isOwnerAuthenticated ? "Landlord Account" : "Renter Profile"}
                      </span>
                      {/* 🛠️ Dynamic Data Display Injection */}
                      {!isOwnerAuthenticated && user && (
                        <div className="mt-1">
                          <p className="text-sm font-semibold text-gray-800 truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                      )}
                    </div>

                    {isOwnerAuthenticated ? (
                      <Link 
                        to="/owner-profile" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-indigo-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <User className="w-4 h-4 text-indigo-500" /> Dashboard Profile
                      </Link>
                    ) : (
                      <Link 
                        to="/saved-properties" 
                        className="flex items-center gap-2 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 transition"
                        onClick={() => setIsProfileOpen(false)}
                      >
                        <Heart className="w-4 h-4 text-emerald-500" /> My Saved List
                      </Link>
                    )}

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 text-left cursor-pointer border-0 bg-transparent mt-1 pt-2 border-t border-gray-100 font-medium"
                    >
                      <LogOut className="w-4 h-4" /> Sign Out
                    </button>
                  </div>
                )}
              </div>

              {/* 🚪 SURFACED SIGN OUT BUTTON (Visible to both Users and Owners) */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3.5 py-2 rounded-lg text-sm font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-100 transition shadow-sm cursor-pointer bg-white"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>

            </div>
          ) : (
            /* SHOWS THIS SECTION IF LOGGED OUT */
            <div className="flex gap-2">
              <Link
                to="/login-user"
                className="text-gray-700 font-medium hover:text-indigo-600 px-3 py-2 transition text-sm"
              >
                User Login
              </Link>
              <Link
                to="/login-owner"
                className="border border-indigo-600 text-indigo-600 font-medium px-4 py-2 rounded-lg hover:bg-indigo-50 transition text-sm"
              >
                Owner Portal
              </Link>
            </div>
          )}
        </div>

        {/* --- MOBILE DISPLAY CONTROLS --- */}
        <div className="flex items-center gap-4 md:hidden">
          {!isOwnerAuthenticated && (
            <Link to="/saved-properties" className="relative text-gray-600 hover:text-indigo-600">
              <Heart className="w-6 h-6" />
              {savedCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow">
                  {savedCount}
                </span>
              )}
            </Link>
          )}
          <button className="text-gray-600 focus:outline-none cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* --- MOBILE DISPLAY PANELS --- */}
      {isOpen && (
        <div className="md:hidden mt-3 space-y-2 text-center text-gray-700 bg-white shadow rounded-lg py-4 px-4">
          {anyAuthenticated && !isOwnerAuthenticated && user && (
            <div className="bg-gray-50 p-2.5 rounded-xl mb-2 text-left px-4 border border-gray-100">
              <p className="text-xs text-gray-400 font-medium uppercase">Active User</p>
              <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          )}

          <Link to="/" className="block py-1 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Home</Link>
          <Link to="/all-properties" className="block py-1 hover:text-indigo-600" onClick={() => setIsOpen(false)}>Properties</Link>
          
          {!isUserAuthenticated && (
            <Link to="/list-property" className="block bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 font-medium" onClick={() => setIsOpen(false)}>
              List Property
            </Link>
          )}

          <hr className="my-2 border-gray-100" />

          {anyAuthenticated ? (
            <div className="space-y-2">
              {isOwnerAuthenticated && (
                <Link to="/owner-profile" className="block py-2 text-gray-700 hover:text-indigo-600" onClick={() => setIsOpen(false)}>
                  My Profile
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full bg-red-50 text-red-600 py-2 rounded-lg font-medium hover:bg-red-100 transition flex items-center justify-center gap-2 border-0 cursor-pointer text-sm"
              >
                <LogOut className="w-4 h-4" /> Sign Out Account
              </button>
            </div>
          ) : (
            <div className="flex flex-col gap-2 pt-1">
              <Link
                to="/login-user"
                className="block w-full border py-2 rounded-lg text-gray-700 hover:bg-gray-50"
                onClick={() => setIsOpen(false)}
              >
                Login as User
              </Link>
              <Link
                to="/login-owner"
                className="block w-full border border-indigo-600 text-indigo-600 py-2 rounded-lg hover:bg-indigo-50"
                onClick={() => setIsOpen(false)}
              >
                Login as Owner
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
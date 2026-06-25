import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { Mail, Lock, AlertCircle, Loader2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function LoginUser() {
  const navigate = useNavigate();
  const { loginUser } = useUser();
  
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Post login data to your Spring Boot Backend API endpoint
      const response = await axios.post(`${API_BASE_URL}/api/users/login`, formData);
      
      // 2. Commit the user details to Context state and LocalStorage
      loginUser(response.data); 

      // 🛠️ THE FIX: Explicitly set the key your Navbar is listening for!
      localStorage.setItem("isUserLoggedIn", "true");
      
      // Safety step: Clean up any leftover owner authentication states to prevent role conflicts
      localStorage.removeItem("isLoggedIn"); 
      
      // 3. Redirect back to browsing property listings
      navigate("/"); 
    } catch (err) {
      // Catches customized bad credentials or missing account messages from your UserService
      setError(err.response?.data || "Invalid email address or password configuration.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm">
        
        {/* Header Display */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Renter Sign In</h2>
          <p className="mt-2 text-sm text-gray-500">
            Log in to view complete contact channels for verified properties.
          </p>
        </div>

        {/* Conditional Error Alerts */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Email Parameter Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="name@example.com"
              />
            </div>
          </div>

          {/* Password Parameter Input */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Form Action Submit Trigger */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm disabled:opacity-50 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Authenticating...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        {/* Redirection Router links */}
        <div className="text-center pt-2 border-t border-gray-100 space-y-2 text-sm text-gray-500">
          <p>
            Don't have a user account?{" "}
            <Link to="/register-user" className="text-indigo-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
          <div className="h-px bg-gray-200/60 my-4" />
          <p>
            Are you a landlord?{" "}
            <Link to="/login-owner" className="text-emerald-600 font-semibold hover:underline">
              Switch to Owner Portal
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
}
import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useUser } from "../context/UserContext";
import { User, Mail, Phone, Lock, AlertCircle, Loader2, CheckCircle2 } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

export default function RegisterUser() {
  const navigate = useNavigate();
  const { loginUser } = useUser();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // 1. Client-side Validation: Match Passwords
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      // Create exact payload structure required by User.java entity
      const registerPayload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password
      };

      // 2. HTTP POST call to your Spring Boot Backend Controller mapping
      const response = await axios.post(`${API_BASE_URL}/api/users/register`, registerPayload);
      
      // 3. Save returned user payload into context session & LocalStorage
      loginUser(response.data);
      
      // 4. Redirect to dashboard properties feed 
      navigate("/properties"); 
    } catch (err) {
      // Catches custom RuntimeException messages thrown from your UserService layer (e.g. duplicate emails)
      setError(err.response?.data || "Registration failed. Please verify your inputs.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50/50 px-4 py-12 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl border border-gray-200/80 shadow-sm">
        
        {/* Title Brand Header */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Create User Account</h2>
          <p className="mt-2 text-sm text-gray-500">
            Sign up to access verified landlord contact pipelines instantly.
          </p>
        </div>

        {/* Dynamic Warning Notification Alerts */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3.5 rounded-xl text-sm font-medium flex items-center gap-2 border border-red-100">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          
          {/* Full Name Input Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Full Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="John Doe"
              />
            </div>
          </div>

          {/* Email Address Input Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Contact Mobile Phone Input Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Phone Number</label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="9876543210"
              />
            </div>
          </div>

          {/* Password Input Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Password</label>
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

          {/* Confirm Password Verification Input Field */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-1">Confirm Password</label>
            <div className="relative">
              <CheckCircle2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="password"
                name="confirmPassword"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-50/50 border border-gray-200 rounded-xl text-sm focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Interactive Form Action Submission Triggers */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center items-center gap-2 bg-indigo-600 text-white py-2.5 px-4 rounded-xl font-medium text-sm hover:bg-indigo-700 active:bg-indigo-800 transition shadow-sm disabled:opacity-50 cursor-pointer mt-6"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Creating Account...</span>
              </>
            ) : (
              "Sign Up as Tenant"
            )}
          </button>
        </form>

        <div className="text-center pt-2 border-t border-gray-100 text-sm text-gray-500">
          Already have a renter profile?{" "}
          <Link to="/login-user" className="text-indigo-600 font-semibold hover:underline">
            Login here
          </Link>
        </div>

      </div>
    </div>
  );
}
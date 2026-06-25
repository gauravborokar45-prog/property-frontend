import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom"; // 📦 Import Link for explicit page routing

// 🛠️ Added fallback port address if environment setup is offline
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

const OwnerRegistrationForm = () => {
  const [owner, setOwner] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Visibility Toggles
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const newErrors = {};

    if (!owner.name.trim()) newErrors.name = "Name is required";
    if (!owner.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(owner.email)) {
      newErrors.email = "Enter a valid email address";
    }
    if (!owner.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(owner.phone)) {
      newErrors.phone = "Enter a valid 10-digit mobile number";
    }
    if (!owner.password) {
      newErrors.password = "Password is required";
    } else if (owner.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters long";
    }
    if (owner.password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setOwner({ ...owner, [e.target.name]: e.target.value });
    // 🛠️ Fixed: clear the specific input error field dynamically on type
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validate()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/owners/register`, owner);
      
      // If backend returns an object or text, handle safely
      setMessage(typeof response.data === "string" ? response.data : "Registration successful! You can now log in.");
      setOwner({ name: "", email: "", phone: "", password: "" });
      setConfirmPassword("");
    } catch (err) {
      // If your backend responds with a validation message string, we print it here
      setError(err.response?.data || "Something went wrong. Please check your network connection.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl relative z-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Owner Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="text" name="name" value={owner.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input type="email" name="email" value={owner.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input type="text" name="phone" value={owner.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none transition" maxLength="10" />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
        </div>

        {/* Password input with toggle */}
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={owner.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer z-20">
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
        </div>

        {/* Confirm Password input with toggle */}
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={(e) => { setConfirmPassword(e.target.value); setErrors({...errors, confirmPassword: ""}) }}
            placeholder="Re-enter Password"
            className="w-full px-4 py-2 border rounded pr-10 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer z-20">
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 font-medium transition-colors cursor-pointer">
          Register
        </button>
      </form>

      {message && <p className="text-green-600 mt-4 text-center font-medium">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}

      {/* --- 🛠️ FIXED BOTTOM ROUTING LINK TO ELIMINATE THE ONTOGGLEFORM PROP CRASH --- */}
      <p className="mt-6 text-center text-sm text-gray-600 pt-4 border-t border-gray-100">
        Already have an account?{" "}
        <Link 
          to="/login-owner" 
          className="text-blue-600 hover:underline font-semibold cursor-pointer inline-block"
        >
          Login here
        </Link>
      </p>
    </div>
  );
};

export default OwnerRegistrationForm;
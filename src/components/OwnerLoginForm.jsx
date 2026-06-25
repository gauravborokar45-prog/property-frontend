import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom"; // 📦 Import Link here
import { useOwner } from "../context/OwnerContext"; 

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OwnerLoginForm = () => {
  const { login } = useOwner(); 
  const navigate = useNavigate(); 

  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const validate = () => {
    const newErrors = {};
    if (!credentials.username.trim())
      newErrors.username = "Email or Phone number is required";
    if (!credentials.password) newErrors.password = "Password is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validate()) return;

    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/owners/login`,
        credentials
      );

      const ownerData = response.data;

      // Update context and write matching token key to localStorage
      login(ownerData);
      localStorage.setItem("isLoggedIn", "true"); 

      setMessage(`Login successful! Welcome back, ${ownerData.name}`);
      setCredentials({ username: "", password: "" });

      setTimeout(() => {
        navigate("/list-property");
      }, 1000);

    } catch (err) {
      setError(err.response?.data || "Invalid username or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl relative z-10">
      <h2 className="text-2xl font-semibold mb-4 text-center text-gray-800">Owner Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Email or Phone Number"
            className="w-full px-4 py-2 border rounded focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={credentials.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded pr-10 focus:ring-2 focus:ring-green-500 outline-none transition"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700 cursor-pointer z-20"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition-colors cursor-pointer"
        >
          Login
        </button>
      </form>

      {message && <p className="text-green-600 mt-4 text-center font-medium">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}

      {/* --- 🛠️ UPDATED FOOTER LINKS WITH EXPLICIT CLICK ROUTING LAYERS --- */}
      <div className="mt-6 text-center text-sm text-gray-600 pt-4 border-t border-gray-100 space-y-2 relative z-20">
        <p>
          Don't have an owner account?{" "}
          <Link
            to="/register-owner"
            className="text-blue-600 hover:underline font-semibold cursor-pointer inline-block"
          >
            Register here
          </Link>
        </p>
        <div className="h-px bg-gray-100 my-2" />
        <p>
          Looking for a rental property?{" "}
          <Link
            to="/login-user"
            className="text-emerald-600 hover:underline font-semibold cursor-pointer inline-block"
          >
            Switch to Renter Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default OwnerLoginForm;
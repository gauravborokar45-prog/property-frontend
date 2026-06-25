import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useOwner } from "../context/OwnerContext"; // Import your custom context hook

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OwnerLoginForm = ({ onToggleForm }) => {
  const { login } = useOwner(); // Destructure the login function from context
  const navigate = useNavigate(); // For smooth single-page routing redirects

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
      // Hit the updated login API endpoint
      const response = await axios.post(
        `${API_BASE_URL}/api/owners/login`,
        credentials
      );

      // Your backend now returns the complete Owner object on successful login
      const ownerData = response.data;

      // Update the global context state (this automatically sets localStorage too)
      login(ownerData);

      setMessage(`Login successful! Welcome back, ${ownerData.name}`);

      // Clear form inputs
      setCredentials({ username: "", password: "" });

      // Clean redirect to your listing pipeline dashboard
      setTimeout(() => {
        navigate("/list-property");
      }, 1000);

    } catch (err) {
      setError(err.response?.data || "Invalid username or password.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Owner Login</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="text"
            name="username"
            value={credentials.username}
            onChange={handleChange}
            placeholder="Email or Phone Number"
            className="w-full px-4 py-2 border rounded"
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
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm text-gray-500 hover:text-gray-700"
          >
            {showPassword ? "🙈" : "👁️"}
          </button>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-medium transition-colors"
        >
          Login
        </button>
      </form>

      {message && <p className="text-green-600 mt-4 text-center font-medium">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center font-medium">{error}</p>}

      <p className="mt-4 text-center text-sm text-gray-600">
        Don't have an account?{" "}
        <button
          onClick={onToggleForm}
          className="text-blue-600 hover:underline font-medium"
        >
          Register here
        </button>
      </p>
    </div>
  );
};

export default OwnerLoginForm;
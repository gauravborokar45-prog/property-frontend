import React, { useState } from "react";
import axios from "axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const OwnerRegistrationForm = ({ onToggleForm }) => {
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
    setErrors({ ...errors, [e.target.name]: "" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!validate()) return;

    try {
      const response = await axios.post(`${API_BASE_URL}/api/owners/register`, owner);
      setMessage(response.data);
      setOwner({ name: "", email: "", phone: "", password: "" });
      setConfirmPassword("");
    } catch (err) {
      setError(err.response?.data || "Something went wrong. Please try again.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-lg rounded-xl">
      <h2 className="text-2xl font-semibold mb-4 text-center">Owner Registration</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input type="text" name="name" value={owner.name} onChange={handleChange} placeholder="Full Name" className="w-full px-4 py-2 border rounded" />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
        </div>

        <div>
          <input type="email" name="email" value={owner.email} onChange={handleChange} placeholder="Email" className="w-full px-4 py-2 border rounded" />
          {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
        </div>

        <div>
          <input type="text" name="phone" value={owner.phone} onChange={handleChange} placeholder="Phone Number" className="w-full px-4 py-2 border rounded" maxLength="10" />
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
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm">
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
            className="w-full px-4 py-2 border rounded pr-10"
          />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm">
            {showConfirmPassword ? "🙈" : "👁️"}
          </button>
          {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
        </div>

        <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700">Register</button>
      </form>

      {message && <p className="text-green-600 mt-4 text-center">{message}</p>}
      {error && <p className="text-red-600 mt-4 text-center">{error}</p>}

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account? <button onClick={onToggleForm} className="text-blue-600 hover:underline">Login here</button>
      </p>
    </div>
  );
};

export default OwnerRegistrationForm;
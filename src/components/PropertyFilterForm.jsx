import React, { useState } from "react";
import { Range } from "react-range";
import axios from "axios";
import { Search } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ use Vite env variable

const PropertyFilterForm = ({ onFilter }) => {
  const [filters, setFilters] = useState({
    priceRange: [5000, 50000],
    city: "Pune", // Default city
    area: "",
    type: "",
    gender: "",
    furnishing: "",
  });

  const [areaSuggestions, setAreaSuggestions] = useState([]);
  const [typingTimeout, setTypingTimeout] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));

    if (name === "area" && filters.city) {
      if (typingTimeout) clearTimeout(typingTimeout);

      if (value.trim() === "") {
        setAreaSuggestions([]);
        return;
      }

      const timeout = setTimeout(() => {
        fetchAreaSuggestions(filters.city, value);
      }, 300);
      setTypingTimeout(timeout);
    }
  };

  const fetchAreaSuggestions = async (city, query) => {
    try {
      const res = await axios.get(
        `${API_BASE_URL}/api/addresses/areas?city=${city}&query=${query}`
      );
      setAreaSuggestions(res.data);
    } catch (err) {
      console.error("Area suggestions fetch error:", err);
    }
  };

  const handleSliderChange = (e, index) => {
    const newRange = [...filters.priceRange];
    newRange[index] = parseInt(e.target.value);
    setFilters((prev) => ({ ...prev, priceRange: newRange }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter(filters);
  };

  const handleSuggestionClick = (area) => {
    setFilters((prev) => ({ ...prev, area }));
    setAreaSuggestions([]);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-gradient-to-br from-white to-gray-50 shadow-lg rounded-2xl p-8 grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 border border-gray-200"
    >
            {/* Price Range */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Rent
        </label>
        <p className="text-xs text-gray-500 mb-2">
          ₹{filters.priceRange[0]} - ₹{filters.priceRange[1]}
        </p>

        <Range
          step={500}
          min={2000}
          max={50000}
          values={filters.priceRange}
          onChange={(values) =>
            setFilters((prev) => ({ ...prev, priceRange: values }))
          }
          renderTrack={({ props, children }) => (
            <div {...props} className="w-full h-2 rounded bg-gray-200 relative">
              <div
                className="absolute h-2 bg-blue-500 rounded"
                style={{
                  left: `${
                    ((filters.priceRange[0] - 2000) / (50000 - 2000)) * 100
                  }%`,
                  width: `${
                    ((filters.priceRange[1] - filters.priceRange[0]) /
                      (50000 - 2000)) *
                    100
                  }%`,
                }}
              />
              {children}
            </div>
          )}
          renderThumb={({ props }) => (
            <div
              {...props}
              className="h-4 w-4 bg-blue-600 rounded-full shadow-md border border-white"
            />
          )}
        />
      </div>
      {/* City */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          City
        </label>
        <input
          type="text"
          name="city"
          value={filters.city}
          disabled
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100 text-gray-700 cursor-not-allowed"
        />
      </div>

      {/* Area */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Area / Location
        </label>
        <div className="relative">
          <input
            type="text"
            name="area"
            value={filters.area}
            onChange={handleChange}
            placeholder="Search area..."
            className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <Search className="absolute right-3 top-3 w-4 h-4 text-gray-400" />
        </div>
        {areaSuggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border border-gray-200 rounded-lg mt-1 w-full max-h-40 overflow-y-auto shadow-md">
            {areaSuggestions.map((suggestion, i) => (
              <li
                key={i}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-2 hover:bg-blue-100 cursor-pointer text-sm"
              >
                {suggestion}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Property Type */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Property Type
        </label>
        <select
          name="type"
          value={filters.type}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="FLAT">Flat</option>
          <option value="PG">PG</option>
          <option value="HOSTEL">Hostel</option>
        </select>
      </div>

      {/* Suitable For */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Suitable For
        </label>
        <select
          name="gender"
          value={filters.gender}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All</option>
          <option value="BOYS">Boys</option>
          <option value="GIRLS">Girls</option>
          <option value="FAMILY">Family</option>
        </select>
      </div>

      {/* Furnishing */}
      <div>
        <label className="block text-sm font-semibold text-gray-700 mb-1">
          Furnishing
        </label>
        <select
          name="furnishing"
          value={filters.furnishing}
          onChange={handleChange}
          className="mt-1 block w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Any</option>
          <option value="FURNISHED">Furnished</option>
          <option value="SEMIFURNISHED">Semi-Furnished</option>
          <option value="UNFURNISHED">Unfurnished</option>
        </select>
      </div>



      {/* Submit */}
      <div className="md:col-span-2 lg:col-span-3 flex justify-end">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 shadow-md transition"
        >
          Apply Filters
        </button>
      </div>
    </form>
  );
};

export default PropertyFilterForm;

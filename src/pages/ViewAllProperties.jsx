import React, { useEffect, useState } from "react";
import axios from "axios";
import PropertyCard from "../components/PropertyCard";
import PropertyFilterForm from "../components/PropertyFilterForm";
import { Filter, X } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const ViewAllProperties = () => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(
    parseInt(localStorage.getItem("currentPage")) || 0
  );
  const [totalPages, setTotalPages] = useState(0);
  const [lastFilters, setLastFilters] = useState({});
  const [showFilters, setShowFilters] = useState(false);

  // Fetch properties from backend
  const fetchProperties = async (filters = {}, page = 0) => {
    try {
      setLoading(true);

      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.area) params.append("area", filters.area);
      if (filters.type) params.append("type", filters.type);
      if (filters.gender) params.append("gender", filters.gender);
      if (filters.furnishing) params.append("furnish", filters.furnishing);
      if (filters.priceRange) {
        params.append("minPrice", filters.priceRange[0]);
        params.append("maxPrice", filters.priceRange[1]);
      }
      params.append("page", page);
      params.append("size", 6);

      const res = await axios.get(
        `${API_BASE_URL}/api/properties/paginated?${params.toString()}`
      );

      setProperties(res.data?.properties || []);
      setCurrentPage(res.data?.currentPage ?? 0);
      setTotalPages(res.data?.totalPages ?? 0);
      localStorage.setItem("currentPage", res.data?.currentPage ?? 0);
      setError("");
    } catch (err) {
      console.error("Error fetching properties:", err);
      setError("Failed to load properties. Please try again later.");
      setProperties([]);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    fetchProperties({}, currentPage);
  }, []);

  // Handle filters
  const handleFilter = (filters) => {
    setLastFilters(filters);
    setCurrentPage(0);
    localStorage.setItem("currentPage", 0);
    fetchProperties(filters, 0);
  };

  // Handle pagination
  const handlePageChange = (page) => {
    if (page >= 0 && page < totalPages) {
      fetchProperties(lastFilters, page);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      {/* Title + Filter Toggle */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-blue-700">Explore Properties</h1>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center px-4 py-2 bg-gray-100 text-gray-800 rounded-lg shadow hover:bg-gray-200 transition"
        >
          {showFilters ? (
            <>
              <X className="w-5 h-5 mr-2" /> Hide Filters
            </>
          ) : (
            <>
              <Filter className="w-5 h-5 mr-2" /> Show Filters
            </>
          )}
        </button>
      </div>

      {/* Collapsible Filter Section */}
      {showFilters && (
        <div className="bg-white shadow-md rounded-xl p-6 mb-8">
          <PropertyFilterForm onFilter={handleFilter} />
        </div>
      )}

      {/* Content Section */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="animate-pulse bg-gray-200 h-64 rounded-xl shadow"
            />
          ))}
        </div>
      ) : error ? (
        <p className="text-center text-red-500 text-lg font-medium">{error}</p>
      ) : !properties || properties.length === 0 ? (
        <div className="text-center mt-10">
          <img
            src="https://illustrations.popsy.co/gray/house.svg"
            alt="No properties"
            className="mx-auto w-40 mb-4"
          />
          <p className="text-gray-600 text-lg">
            No properties found. Try adjusting your filters.
          </p>
        </div>
      ) : (
        <>
          {/* Properties Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-8">
            {properties.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center mt-10 space-x-2">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 0}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              ⬅ Prev
            </button>

            {Array.from({ length: 3 }, (_, i) => {
              const start = Math.max(0, Math.min(currentPage - 1, totalPages - 3));
              const pageNumber = start + i;
              if (pageNumber >= totalPages) return null;

              return (
                <button
                  key={pageNumber}
                  onClick={() => handlePageChange(pageNumber)}
                  className={`px-4 py-2 rounded-lg transition ${
                    currentPage === pageNumber
                      ? "bg-blue-600 text-white shadow-md"
                      : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                  }`}
                >
                  {pageNumber + 1}
                </button>
              );
            })}

            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage >= totalPages - 1}
              className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 transition"
            >
              Next ➡
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewAllProperties;

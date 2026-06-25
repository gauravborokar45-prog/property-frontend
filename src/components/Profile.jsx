import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useOwner } from "../context/OwnerContext";
import PropertyCard from "./PropertyCard"; 
import { User, Phone, Mail, Home, PlusCircle, AlertCircle, Loader, Shield, Calendar, IdCard } from "lucide-react";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

export default function Profile() {
  const navigate = useNavigate();
  const { owner, isLoggedIn } = useOwner();
  
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  // Re-usable fetching method to synchronize property state cleanly
  const fetchOwnerProperties = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/properties/phone`, {
        params: { phone: owner.phone }
      });
      setProperties(response.data || []);
    } catch (err) {
      console.error("Error loading profile listings:", err);
      setError("Failed to fetch your listed properties.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isLoggedIn || !owner) {
      navigate("/login-owner");
      return;
    }
    setLoading(true);
    fetchOwnerProperties();
  }, [owner, isLoggedIn, navigate]);

  // Callback to update the layout instantly when a property is deleted
  const handlePropertyDeleted = (deletedPropertyId) => {
    setProperties((prev) => prev.filter((p) => p.id !== deletedPropertyId));
    setSuccessMessage("Property unit successfully deleted from registry.");
    
    // Fade out success notification banner after 3 seconds
    setTimeout(() => {
      setSuccessMessage("");
    }, 3000);
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-gray-500 gap-2 font-medium">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span>Loading Profile Dashboard...</span>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen bg-gray-50/50">
      
      {/* HEADER PORTAL */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-200/80 shadow-sm">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your owner account parameters and real estate listings</p>
        </div>
        <Link
          to="/list-property"
          className="inline-flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-indigo-700 shadow-sm transition-colors self-start sm:self-auto"
        >
          <PlusCircle className="w-4 h-4" /> Add New Property
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* LEFT PROFILE SIDEBAR */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-sm p-6">
            <div className="flex flex-col items-center text-center pb-6 border-b border-gray-100">
              <div className="w-24 h-24 bg-gradient-to-tr from-indigo-500 to-blue-600 text-white rounded-full flex items-center justify-center font-bold text-4xl shadow-md mb-4 relative">
                {owner?.name?.charAt(0).toUpperCase() || "O"}
                <span className="absolute bottom-1 right-1 bg-green-500 border-2 border-white w-4 h-4 rounded-full"></span>
              </div>
              <h2 className="text-xl font-bold text-gray-800">{owner?.name || "Property Owner"}</h2>
              <span className="text-xs font-semibold uppercase tracking-wider text-indigo-700 bg-indigo-50 px-3 py-1 rounded-full mt-2 flex items-center gap-1">
                <Shield className="w-3 h-3" /> Verified Account
              </span>
            </div>

            <div className="mt-6 space-y-4">
              <h3 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-2">Account Parameters</h3>
              
              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <IdCard className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Owner Database ID</p>
                  <p className="text-sm font-semibold text-gray-800 font-mono">#{owner?.id || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <User className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Full Registered Name</p>
                  <p className="text-sm font-semibold text-gray-800">{owner?.name || "N/A"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Primary Email Address</p>
                  <p className="text-sm font-semibold text-gray-800 break-all">{owner?.email || "No email linked"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                <div>
                  <p className="text-xs text-gray-400 font-medium">Mobile Contact Channel</p>
                  <p className="text-sm font-semibold text-gray-800">{owner?.phone || "N/A"}</p>
                </div>
              </div>

              {owner?.createdAt && (
                <div className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="text-xs text-gray-400 font-medium">Partner Since</p>
                    <p className="text-sm font-semibold text-gray-800">
                      {new Date(owner.createdAt).toLocaleDateString("en-IN", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between text-sm bg-gray-50 p-3 rounded-xl">
              <span className="text-gray-500 font-medium flex items-center gap-1.5">
                <Home className="w-4 h-4 text-gray-400" /> Active Inventory:
              </span>
              <span className="font-bold text-indigo-600 bg-white px-2.5 py-0.5 rounded-md border border-gray-200">
                {properties.length} Units
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PROPERTY LISTINGS DISPLAY PANEL */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* ACTION NOTIFICATIONS */}
          {error && (
            <div className="flex items-center gap-2 text-red-600 bg-red-50 p-4 rounded-xl text-sm font-medium">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 p-4 rounded-xl text-sm font-medium animate-in fade-in duration-200">
              <span className="text-base">✔</span>
              <p>{successMessage}</p>
            </div>
          )}

          {properties.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-16 text-center shadow-sm">
              <Home className="w-14 h-14 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-700 font-semibold text-lg mb-1">No listed assets discovered</p>
              <p className="text-sm text-gray-400 max-w-sm mx-auto mb-6">
                You haven't associated any layout units to this database configuration string yet.
              </p>
              <Link
                to="/list-property"
                className="inline-flex bg-indigo-600 text-white font-medium px-5 py-2.5 rounded-xl hover:bg-indigo-700 transition text-sm shadow-sm"
              >
                Deploy Your First Unit
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {properties.map((item) => (
                <PropertyCard 
                  key={item.id} 
                  property={item} 
                  onDeleteSuccess={handlePropertyDeleted} // Links dynamic delete actions
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
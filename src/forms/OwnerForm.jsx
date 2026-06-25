import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";

const OwnerForm = ({ onNext }) => {
  const [owner, setOwner] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Automatically retrieve the authenticated profile object
    const storedOwner = localStorage.getItem("loggedInOwner");
    if (storedOwner) {
      setOwner(JSON.parse(storedOwner));
    }
    setLoading(false);
  }, []);

  // Structural Guard: If local state manipulation occurred or session is cleared
  if (!loading && !owner) {
    return <Navigate to="/login-owner" replace />;
  }

  const handleNext = () => {
    onNext(owner);
  };

  if (loading) {
    return <div className="p-4 text-gray-600">Verifying session...</div>;
  }

  return (
    <div className="p-6 max-w-md mx-auto bg-white shadow rounded-xl border border-gray-100">
      <h2 className="text-xl font-bold mb-1 text-gray-800">
        Step 1: Owner Verification
      </h2>
      <p className="text-sm text-gray-500 mb-4">
        Confirm the profile linked to this listing instance.
      </p>

      {/* Profile summary read-out banner */}
      <div className="text-sm text-gray-700 bg-indigo-50/50 border border-indigo-100 p-4 rounded-lg space-y-2 mb-6">
        <p>
          <strong className="text-gray-500 block text-xs uppercase tracking-wider">Name</strong> 
          <span className="text-base font-medium text-gray-800">{owner.name}</span>
        </p>
        <p>
          <strong className="text-gray-500 block text-xs uppercase tracking-wider">Phone</strong> 
          <span className="text-base font-medium text-gray-800">{owner.phone}</span>
        </p>
        <p>
          <strong className="text-gray-500 block text-xs uppercase tracking-wider">Email</strong> 
          <span className="text-base font-medium text-gray-800">{owner.email || "N/A"}</span>
        </p>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleNext}
          className="px-6 py-2 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 shadow-sm transition-colors"
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
};

export default OwnerForm;
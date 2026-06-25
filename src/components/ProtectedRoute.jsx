import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useUser } from "../context/UserContext";
import { useOwner } from "../context/OwnerContext";
import { Loader } from "lucide-react";

/**
 * Enhanced Protective Route using React Router Layout Outlets.
 * @param {string} allowType - "any" (User or Owner can pass) or "ownerOnly" (Only Owner can pass)
 */
const ProtectedRoute = ({ allowType = "any" }) => {
  const { isUserLoggedIn, loading: userLoading } = useUser();
  const { isLoggedIn: isOwnerLoggedIn, loading: ownerLoading } = useOwner();

  // 1. Prevent early redirects while reading asynchronous storage profiles
  if (userLoading || ownerLoading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-gray-500 gap-2 font-medium bg-gray-50/50">
        <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        <span>Verifying account credentials...</span>
      </div>
    );
  }

  // 2. Enforcement Rule: Both Users and Owners can access the property listings gallery feed
  if (allowType === "any") {
    if (!isUserLoggedIn && !isOwnerLoggedIn) {
      alert("Access Denied: Please sign in as a standard user or property owner to view listings.");
      return <Navigate to="/login-user" replace />;
    }
  }

  // 3. Enforcement Rule: Block standard users entirely from loading owner profile dashboards
  if (allowType === "ownerOnly") {
    if (!isOwnerLoggedIn) {
      alert("Access Denied: This dashboard is reserved exclusively for verified property owners.");
      return <Navigate to="/login-owner" replace />;
    }
  }

  // If validation conditions match up securely, open pipeline to nested targets
  return <Outlet />;
};

export default ProtectedRoute;
import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading, userRole } = useAuth();

  if (loading || userRole === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Checking admin permissions...
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;

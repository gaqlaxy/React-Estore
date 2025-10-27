// import React from "react";
// import { Navigate } from "react-router-dom";
// import useAuth from "../hooks/useAuth";

// const AdminRoute = ({ children }) => {
//   const { currentUser, userRole } = useAuth(); // comes from your auth context

//   // Only allow access if logged in and admin
//   if (!currentUser) {
//     return <Navigate to="/login" replace />;
//   }

//   if (userRole !== "admin") {
//     return <Navigate to="/" replace />;
//   }

//   return children;
// };

// export default AdminRoute;

import React from "react";
import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

const AdminRoute = ({ children }) => {
  const { user, loading, userRole } = useAuth();

  // 1️⃣ If auth or role are still loading, hold off on rendering anything
  if (loading || userRole === null) {
    return (
      <div className="flex items-center justify-center h-screen text-gray-500">
        Checking admin permissions...
      </div>
    );
  }

  // 2️⃣ If not logged in → redirect to login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3️⃣ If logged in but not admin → redirect to home
  if (userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  // 4️⃣ Otherwise → render admin component
  return children;
};

export default AdminRoute;

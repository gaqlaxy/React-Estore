import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { signOut, auth } from "./firebaseConfig";
import useAuth from "./hooks/useAuth";
import AdminPanel from "./pages/AdminPanel";
import AdminOrders from "./pages/AdminOrders";
import AdminRoute from "./components/AdminRoute";

export default function App() {
  const { user, loading, userRole } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>; // Prevent flash before Firebase resolves

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

  console.log("Logged in user role:", userRole);

  return (
    <>
      {/* Navbar */}
      <nav
        style={{
          padding: "1rem",
          background: "#eee",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div>
          <Link to="/" style={{ marginRight: "1rem" }}>
            Home
          </Link>
          <Link to="/products" style={{ marginRight: "1rem" }}>
            Products
          </Link>
          {user && (
            <>
              <Link to="/dashboard" style={{ marginRight: "1rem" }}>
                My Dashboard
              </Link>

              {userRole === "admin" && (
                <Link to="/admin" style={{ marginRight: "1rem", color: "red" }}>
                  Admin Panel
                </Link>
              )}
            </>
          )}
        </div>

        <div>
          {!user ? (
            <Link to="/login">Login</Link>
          ) : (
            <>
              <span style={{ marginRight: "1rem" }}>
                Hi, {user.displayName}
              </span>
              <button
                onClick={handleLogout}
                style={{
                  background: "#e74c3c",
                  color: "#fff",
                  border: "none",
                  padding: "0.5rem 1rem",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Logout
              </button>
            </>
          )}
        </div>
      </nav>

      {/* Routes */}
      <Routes>
        {/* <Route path="/" element={<h2>Welcome to our store!</h2>} /> */}
        <Route
          path="/"
          element={
            user ? <Dashboard user={user} /> : <h2>Welcome to our store!</h2>
          }
        />

        <Route
          path="/products"
          element={
            user ? <Products /> : <h2>Please log in to view our products.</h2>
          }
        />

        <Route path="/login" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            user ? (
              <Dashboard user={user} />
            ) : (
              <h2>Please log in to view your dashboard.</h2>
            )
          }
        />

        <Route
          path="/admin"
          element={
            user && userRole === "admin" ? (
              <AdminPanel />
            ) : (
              <h2 style={{ textAlign: "center", marginTop: "50px" }}>
                🚫 Access Denied — Admins Only
              </h2>
            )
          }
        />
        {/* <Route path="/admin/orders" element={<AdminOrders />} /> */}
        <Route
          path="/admin/orders"
          element={
            <AdminRoute>
              <AdminOrders />
            </AdminRoute>
          }
        />
      </Routes>
    </>
  );
}

// import React from "react";
// import { Routes, Route, Link } from "react-router-dom";
// import Products from "./pages/Products";

// export default function App() {
//   return (
//     <>
//       <nav style={{ padding: "1rem", background: "#eee" }}>
//         <Link to="/" style={{ marginRight: "1rem" }}>
//           Home
//         </Link>
//         <Link to="/products">Products</Link>
//       </nav>

//       <Routes>
//         <Route path="/" element={<h2>Welcome to our store!</h2>} />
//         <Route path="/products" element={<Products />} />
//       </Routes>
//     </>
//   );
// }

// import React, { useState } from "react";
// import { Routes, Route, Link, useNavigate } from "react-router-dom";
// import Products from "./pages/Products";
// import Login from "./components/Login";

// export default function App() {
//   const [user, setUser] = useState(null);
//   const navigate = useNavigate();

//   const handleLogout = () => {
//     setUser(null);
//     navigate("/"); // redirect to home after logout
//   };

//   return (
//     <>
//       {/* Navigation */}
//       <nav
//         style={{
//           padding: "1rem",
//           background: "#eee",
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <div>
//           <Link to="/" style={{ marginRight: "1rem" }}>
//             Home
//           </Link>
//           <Link to="/products" style={{ marginRight: "1rem" }}>
//             Products
//           </Link>
//           {user && (
//             <Link to="/dashboard" style={{ marginRight: "1rem" }}>
//               My Dashboard
//             </Link>
//           )}
//         </div>

//         <div>
//           {!user ? (
//             <Link to="/login">Login</Link>
//           ) : (
//             <>
//               <span style={{ marginRight: "1rem" }}>
//                 Hi, {user.displayName}
//               </span>
//               <button
//                 onClick={handleLogout}
//                 style={{
//                   background: "#e74c3c",
//                   color: "#fff",
//                   border: "none",
//                   padding: "0.5rem 1rem",
//                   borderRadius: "4px",
//                   cursor: "pointer",
//                 }}
//               >
//                 Logout
//               </button>
//             </>
//           )}
//         </div>
//       </nav>

//       {/* Routes */}
//       <Routes>
//         <Route path="/" element={<h2>Welcome to our store!</h2>} />
//         <Route path="/products" element={<Products />} />
//         <Route path="/login" element={<Login onLogin={setUser} />} />
//         <Route
//           path="/dashboard"
//           element={
//             user ? (
//               <h2>Welcome to your Dashboard, {user.displayName}</h2>
//             ) : (
//               <h2>Please log in to view your dashboard.</h2>
//             )
//           }
//         />
//       </Routes>
//     </>
//   );
// }

import React from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import Products from "./pages/Products";
import Login from "./components/Login";
import Dashboard from "./pages/Dashboard";
import { signOut, auth } from "./firebaseConfig";
import useAuth from "./hooks/useAuth";

export default function App() {
  const { user, loading } = useAuth();
  const navigate = useNavigate();

  if (loading) return <p>Loading...</p>; // Prevent flash before Firebase resolves

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/");
  };

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
            <Link to="/dashboard" style={{ marginRight: "1rem" }}>
              My Dashboard
            </Link>
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
      </Routes>
    </>
  );
}

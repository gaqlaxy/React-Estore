// import React from "react";

// export default function Dashboard({ user }) {
//   return (
//     <div style={{ padding: "2rem" }}>
//       <h2>Welcome, {user.displayName}</h2>
//       <p>Email: {user.email}</p>
//       <p>Your personalized dashboard will appear here soon.</p>
//     </div>
//   );
// }

import React, { useState } from "react";
import Wishlist from "../components/Wishlist";
import Cart from "../components/Cart";
import Orders from "../components/Orders";

export default function Dashboard({ user }) {
  const [activeTab, setActiveTab] = useState("wishlist"); // default tab

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Welcome, {user.displayName}</h2>

      {/* Tab Navigation */}
      <div style={{ margin: "1rem 0", display: "flex", gap: "1rem" }}>
        <button
          onClick={() => setActiveTab("wishlist")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border:
              activeTab === "wishlist" ? "2px solid #007bff" : "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Wishlist
        </button>
        <button
          onClick={() => setActiveTab("cart")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border:
              activeTab === "cart" ? "2px solid #007bff" : "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Cart
        </button>
        <button
          onClick={() => setActiveTab("orders")}
          style={{
            padding: "0.5rem 1rem",
            borderRadius: "4px",
            border:
              activeTab === "orders" ? "2px solid #007bff" : "1px solid #ccc",
            cursor: "pointer",
          }}
        >
          Orders
        </button>
      </div>

      {/* Tab Content */}
      <div style={{ marginTop: "2rem" }}>
        {activeTab === "wishlist" && <Wishlist user={user} />}
        {activeTab === "cart" && <Cart user={user} />}
        {activeTab === "orders" && <Orders user={user} />}
      </div>
    </div>
  );
}

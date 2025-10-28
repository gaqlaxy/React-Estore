import React, { useState } from "react";
import Wishlist from "../components/Wishlist";
import Cart from "../components/Cart";
import Orders from "../components/Orders";
import useAuth from "../hooks/useAuth";

export default function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("wishlist");

  if (!user) return <p>Please log in to access your dashboard.</p>;

  const tabs = [
    { key: "wishlist", label: "Wishlist 🧡" },
    { key: "cart", label: "Cart 🛒" },
    { key: "orders", label: "Orders 📦" },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "wishlist":
        return <Wishlist />;
      case "cart":
        return <Cart />;
      case "orders":
        return <Orders user={user} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl p-6">
        {/* Header */}
        <div className="flex justify-between items-center border-b pb-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Welcome, {user.displayName || "User"} 👋
          </h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 rounded-t-lg font-medium transition ${
                activeTab === tab.key
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="animate-fadeIn">{renderTabContent()}</div>
      </div>
    </div>
  );
}

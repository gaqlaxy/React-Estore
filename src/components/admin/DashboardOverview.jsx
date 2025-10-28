import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const DashboardOverview = () => {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    users: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const baseURL = "http://localhost:5000";

        const [productsRes, ordersRes, usersRes] = await Promise.all([
          axios.get(`${baseURL}/products`),
          axios.get(`${baseURL}/orders`),
          axios.get(`${baseURL}/users`),
        ]);

        setStats({
          products: productsRes.data.length,
          orders: ordersRes.data.length,
          users: usersRes.data.length,
        });
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="text-gray-500 text-center py-10">
        Loading dashboard data...
      </div>
    );
  }

  const cards = [
    {
      label: "Total Products",
      value: stats.products,
      color: "bg-blue-100 text-blue-700",
    },
    {
      label: "Total Orders",
      value: stats.orders,
      color: "bg-green-100 text-green-700",
    },
    {
      label: "Total Users",
      value: stats.users,
      color: "bg-purple-100 text-purple-700",
    },
  ];

  return (
    <div className="grid md:grid-cols-3 gap-6 mt-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          className={`p-6 rounded-2xl shadow border ${card.color} transition`}
        >
          <h3 className="text-sm font-medium">{card.label}</h3>
          <p className="text-3xl font-semibold mt-2">{card.value}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardOverview;

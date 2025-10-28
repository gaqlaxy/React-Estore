import React, { useEffect, useState } from "react";
import { fetchOrders } from "../api";

export default function Orders({ user }) {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    async function loadOrders() {
      const data = await fetchOrders(user.email);
      setOrders(data);
    }
    loadOrders();
  }, [user.email]);

  if (!orders.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        You have no orders yet 📦
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Orders</h2>

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded-xl bg-white shadow p-4 mb-4 hover:shadow-lg transition"
        >
          <h4 className="font-semibold text-lg mb-2">Order ID: {order.id}</h4>
          <div className="text-gray-600 text-sm space-y-1 mb-3">
            <p>
              Status: <span className="capitalize">{order.status}</span>
            </p>
            <p>Address: {order.address}</p>
            <p className="text-gray-400">
              Ordered At: {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>

          <div className="border-t pt-3">
            <h5 className="font-medium mb-2">Items:</h5>
            <ul className="space-y-2">
              {order.items.map((item, i) => (
                <li
                  key={i}
                  className="flex justify-between text-gray-700 border-b pb-1"
                >
                  <span>
                    {item.title || "Unknown"} × {item.qty || 0}
                  </span>
                  <span>
                    ₹{item.price ? item.price * (item.qty || 1) : "—"}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-3 text-right font-semibold">
            Total: ₹
            {order.items.reduce(
              (sum, i) => sum + (i.price || 0) * (i.qty || 1),
              0
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

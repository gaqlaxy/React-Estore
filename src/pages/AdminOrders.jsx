import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const API_URL = "http://localhost:5000";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ordersRes, productsRes] = await Promise.all([
          axios.get(`${API_URL}/orders`),
          axios.get(`${API_URL}/products`),
        ]);
        setOrders(ordersRes.data);
        setProducts(productsRes.data);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getProductInfo = (id) => products.find((p) => p.id === id);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      const order = orders.find((o) => o.id === orderId);
      if (!order) return;
      const updated = { ...order, status: newStatus };

      await axios.put(`${API_URL}/orders/${orderId}`, updated);
      setOrders((prev) => prev.map((o) => (o.id === orderId ? updated : o)));
      alert(`Order #${orderId} updated to ${newStatus}`);
    } catch (error) {
      console.error("Failed to update order:", error);
    }
  };

  if (loading) return <p className="text-center mt-8">Loading orders...</p>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6"
    >
      <h2 className="text-2xl font-bold mb-6">🧾 Manage Orders</h2>

      {orders.length === 0 ? (
        <p className="text-gray-600">No orders found.</p>
      ) : (
        <div className="overflow-x-auto bg-white shadow-lg rounded-lg">
          <table className="min-w-full border border-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-left">User</th>
                <th className="px-4 py-3 text-left">Items</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => {
                const total = order.items.reduce((sum, item) => {
                  const p = getProductInfo(item.productId);
                  return sum + (p?.price || 0) * item.qty;
                }, 0);

                return (
                  <tr key={order.id} className="border-t hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm">{order.userEmail}</td>
                    <td className="px-4 py-3 text-sm">
                      {order.items.map((item, i) => {
                        const product = getProductInfo(item.productId);
                        return (
                          <div
                            key={i}
                            className="flex items-center gap-2 mb-1 border-b pb-1"
                          >
                            {product?.image && (
                              <img
                                src={product.image}
                                alt={product.title}
                                className="w-8 h-8 object-cover rounded"
                              />
                            )}
                            <span>
                              {product?.title || "Unknown"} × {item.qty}
                            </span>
                          </div>
                        );
                      })}
                    </td>
                    <td className="px-4 py-3 font-semibold text-green-600">
                      ₹{total}
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          order.status === "Delivered"
                            ? "bg-green-100 text-green-700"
                            : order.status === "Shipped"
                            ? "bg-blue-100 text-blue-700"
                            : order.status === "Cancelled"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-600">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          handleStatusChange(order.id, e.target.value)
                        }
                        className="border rounded px-2 py-1 text-sm"
                      >
                        <option value="On Process">On Process</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  );
};

export default AdminOrders;

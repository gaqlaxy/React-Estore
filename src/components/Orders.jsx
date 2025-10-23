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

  if (!orders.length) return <p>You have no orders yet.</p>;

  return (
    <div>
      {orders.map((order) => (
        <div
          key={order.id}
          style={{
            border: "1px solid #ccc",
            padding: "1rem",
            marginBottom: "1rem",
          }}
        >
          <h4>Order ID: {order.id}</h4>
          <p>Status: {order.status}</p>
          <p>Address: {order.address}</p>
          <p>Ordered At: {new Date(order.createdAt).toLocaleString()}</p>
          <ul>
            {order.items.map((item) => (
              <li key={item.productId}>
                {item.title} - Qty: {item.qty} - ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

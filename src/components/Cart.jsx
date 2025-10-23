import React, { useEffect, useState } from "react";
import { fetchCart, fetchProductsByIds } from "../api";
import ProductCard from "./ProductCard";

export default function Cart({ user }) {
  const [items, setItems] = useState([]);

  useEffect(() => {
    async function loadCart() {
      const cartItems = await fetchCart(user.uid);
      const productIds = cartItems.map((item) => item.productId);
      const products = await fetchProductsByIds(productIds);

      // Merge qty into products
      const merged = products.map((product) => {
        const item = cartItems.find((i) => i.productId === product.id);
        return { ...product, qty: item.qty };
      });

      setItems(merged);
    }
    loadCart();
  }, [user.uid]);

  if (!items.length) return <p>Your cart is empty.</p>;

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {items.map((product) => (
        <div key={product.id}>
          <ProductCard product={product} />
          <p>Quantity: {product.qty}</p>
        </div>
      ))}
    </div>
  );
}

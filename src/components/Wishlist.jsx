import React, { useEffect, useState } from "react";
import { fetchWishlist, fetchProductsByIds } from "../api";
import ProductCard from "./ProductCard";

export default function Wishlist({ user }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      const productIds = await fetchWishlist(user.uid); // user.uid = userId
      const products = await fetchProductsByIds(productIds);
      setProducts(products);
    }
    loadWishlist();
  }, [user.uid]);

  if (!products.length) return <p>Your wishlist is empty.</p>;

  return (
    <div
      style={{
        display: "grid",
        gap: "1rem",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      }}
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}

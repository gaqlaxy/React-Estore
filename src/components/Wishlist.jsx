// import React, { useEffect, useState } from "react";
// import { fetchWishlist, fetchProductsByIds } from "../api";
// import ProductCard from "./ProductCard";

// export default function Wishlist({ user }) {
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function loadWishlist() {
//       const productIds = await fetchWishlist(user.uid); // user.uid = userId
//       const products = await fetchProductsByIds(productIds);
//       setProducts(products);
//     }
//     loadWishlist();
//   }, [user.uid]);

//   if (!products.length) return <p>Your wishlist is empty.</p>;

//   return (
//     <div
//       style={{
//         display: "grid",
//         gap: "1rem",
//         gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
//       }}
//     >
//       {products.map((product) => (
//         <ProductCard key={product.id} product={product} />
//       ))}
//     </div>
//   );
// }

// Wishlist.jsx
import React, { useEffect, useState } from "react";
import { fetchWishlist, fetchProductsByIds, addToCart } from "../api";
import useAuth from "../hooks/useAuth";
import { removeFromWishlist } from "../api"; // we'll create this

export default function Wishlist() {
  const { user } = useAuth();
  const [wishlistIds, setWishlistIds] = useState([]);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) return;
      const ids = await fetchWishlist(user.uid);
      setWishlistIds(ids);

      const prods = await fetchProductsByIds(ids);
      setProducts(prods);
    }
    loadWishlist();
  }, [user]);

  const refreshWishlist = async () => {
    if (!user) return;
    const ids = await fetchWishlist(user.uid);
    setWishlistIds(ids);
    const prods = await fetchProductsByIds(ids);
    setProducts(prods);
  };

  const handleRemove = async (productId) => {
    await removeFromWishlist(user.uid, productId);
    refreshWishlist();
  };

  const handleMoveToCart = async (product) => {
    await addToCart(user.uid, product);
    await handleRemove(product.id); // remove from wishlist
    alert(`${product.title} moved to cart`);
  };

  if (!wishlistIds.length) return <p>Your wishlist is empty</p>;

  return (
    <div>
      <ul>
        {products.map((prod) => (
          <li
            key={prod.id}
            style={{
              marginBottom: "1rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <img
              src={prod.image}
              alt={prod.title}
              style={{
                width: "50px",
                height: "50px",
                objectFit: "cover",
                borderRadius: "4px",
              }}
            />
            <span>{prod.title}</span>
            <button onClick={() => handleMoveToCart(prod)}>Move to Cart</button>
            <button
              onClick={() => handleRemove(prod.id)}
              style={{ color: "red" }}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

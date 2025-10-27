// // Wishlist.jsx
// import React, { useEffect, useState } from "react";
// import { fetchWishlist, fetchProductsByIds, addToCart } from "../api";
// import useAuth from "../hooks/useAuth";
// import { removeFromWishlist } from "../api"; // we'll create this

// export default function Wishlist() {
//   const { user } = useAuth();
//   const [wishlistIds, setWishlistIds] = useState([]);
//   const [products, setProducts] = useState([]);

//   useEffect(() => {
//     async function loadWishlist() {
//       if (!user) return;
//       const ids = await fetchWishlist(user.uid);
//       setWishlistIds(ids);

//       const prods = await fetchProductsByIds(ids);
//       setProducts(prods);
//     }
//     loadWishlist();
//   }, [user]);

//   const refreshWishlist = async () => {
//     if (!user) return;
//     const ids = await fetchWishlist(user.uid);
//     setWishlistIds(ids);
//     const prods = await fetchProductsByIds(ids);
//     setProducts(prods);
//   };

//   const handleRemove = async (productId) => {
//     await removeFromWishlist(user.uid, productId);
//     refreshWishlist();
//   };

//   const handleMoveToCart = async (product) => {
//     await addToCart(user.uid, product);
//     await handleRemove(product.id); // remove from wishlist
//     alert(`${product.title} moved to cart`);
//   };

//   if (!wishlistIds.length) return <p>Your wishlist is empty</p>;

//   return (
//     <div>
//       <ul>
//         {products.map((prod) => (
//           <li
//             key={prod.id}
//             style={{
//               marginBottom: "1rem",
//               display: "flex",
//               alignItems: "center",
//               gap: "1rem",
//             }}
//           >
//             <img
//               src={prod.image}
//               alt={prod.title}
//               style={{
//                 width: "50px",
//                 height: "50px",
//                 objectFit: "cover",
//                 borderRadius: "4px",
//               }}
//             />
//             <span>{prod.title}</span>
//             <button onClick={() => handleMoveToCart(prod)}>Move to Cart</button>
//             <button
//               onClick={() => handleRemove(prod.id)}
//               style={{ color: "red" }}
//             >
//               Remove
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import {
  fetchWishlist,
  fetchProductsByIds,
  addToCart,
  removeFromWishlist,
} from "../api";
import useAuth from "../hooks/useAuth";

export default function Wishlist() {
  const { user } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadWishlist() {
      if (!user) return;
      const ids = await fetchWishlist(user.uid);
      const prods = await fetchProductsByIds(ids);
      setProducts(prods);
    }
    loadWishlist();
  }, [user]);

  const handleRemove = async (productId) => {
    await removeFromWishlist(user.uid, productId);
    const ids = await fetchWishlist(user.uid);
    const prods = await fetchProductsByIds(ids);
    setProducts(prods);
  };

  const handleMoveToCart = async (product) => {
    await addToCart(user.uid, product);
    await handleRemove(product.id);
    alert(`${product.title} moved to cart`);
  };

  if (!products.length)
    return (
      <p className="text-center text-gray-500 mt-10">
        Your wishlist is empty ❤️
      </p>
    );

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">Your Wishlist</h2>

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
        {products.map((prod) => (
          <div
            key={prod.id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition p-4 flex flex-col items-center"
          >
            <img
              src={prod.image}
              alt={prod.title}
              className="w-32 h-32 object-cover rounded mb-3"
            />
            <h4 className="font-semibold text-center">{prod.title}</h4>
            <p className="text-gray-600 mb-3">₹{prod.price}</p>

            <div className="flex gap-2">
              <button
                onClick={() => handleMoveToCart(prod)}
                className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
              >
                Move to Cart
              </button>
              <button
                onClick={() => handleRemove(prod.id)}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
